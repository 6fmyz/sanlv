import { parse } from 'qs'
import {
  queryNonce,
  queryToken,
  queryInitData,
} from '../services/login'
import _ from 'lodash'
import { arrayToTree, setCookie, encryptPassword, generateHMAC } from '../utils'

const getTokenParam = (username, password, nonce) => {
  const encryptedPassword = encryptPassword(password)
  const HMAC = generateHMAC(nonce, encryptedPassword)
  return {
    mail: username,
    password: HMAC,
  }
}

// const getCollegeData = (collegeInfo) => {
//   const obj = {
//     id: 0,
//     name: '',
//     college: [],
//     profession: [],
//   }
//   let collegeObj = {}
//   let professionObj = {}
//   _.map(collegeInfo, (value) => {
//     switch (value.level) {
//       case 0:
//         obj.name = value.orgName
//         obj.id = value.orgId
//         break
//       case 1:
//         collegeObj = {
//           id: value.orgId,
//           name: value.orgName,
//           isDisabled: false,
//           isDefault: false
//         }
//         obj.college.push(collegeObj)
//         break
//       case 2:
//         professionObj = {
//           id: value.orgId,
//           name: value.orgName,
//           pId: value.pId,
//           isDisabled: false,
//           isDefault: false
//         }
//         obj.profession.push(professionObj)
//         break
//       default:
//         break
//     }
//   })
//   return obj
// }

// const getInfoData = (collegeInfo) => {
//   const data = getCollegeData(collegeInfo)
//   const collegeData = {
//     id: data.id,
//     name: data.name,
//   }
//   const collegeTree = collegeInfo.filter(v => v.pid !== 0)
//   collegeData.college = collegeTree
//   return collegeData
// }

export default {
  namespace: 'login',
  state: {
    isPassword: true,
    pwdPopoverVisible: false,
    isAutoLogin: false,
    loginStatus: false,
    userOrgList: {},
    loginMsg: '',
    email: '',
    role: null,
    // initOrgListStatus: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/user/login' || location.pathname === '/') {
          const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
          if (userInfo && userInfo.isAutoLogin) {
            dispatch({ type: 'autoLoginWithToken', data: userInfo })
          }
        }
      })
    }
  },
  effects: {
    * submitLogin(action, { call, put }) {
      const param = {
        account: action.email,
      }
      try {
        const res = yield call(queryNonce, parse(param))
        const tokenParam = getTokenParam(action.email, action.password, res.nonce)
        const loginParam = {
          account: tokenParam.mail,
          password: tokenParam.password,
        }

        try {
          const loginResult = yield call(queryToken, parse(loginParam))
          yield put({
            type: 'loginSuccess',
            data: loginResult,
            remember: action.remember,
          })
        } catch (err) {
          let pwdPopoverVisible = false
          switch (err.resp.status) {
            case 401:
              pwdPopoverVisible = true
              break
            default:
              break
          }
          yield put({ type: 'loginFail', pwdPopoverVisible: pwdPopoverVisible, msg: '' })
        }
      } catch (err) {
        let msg
        let pwdPopoverVisible = false
        switch (err.resp.status) {
          case 404:
            msg = '没有该用户'
            pwdPopoverVisible = true
            break
          case 400:
            msg = '密码错误'
            pwdPopoverVisible = true
            break
          default:
            break
        }
        yield put({ type: 'loginFail', pwdPopoverVisible: pwdPopoverVisible, msg: msg })
      }
    },
    // * queryInitData(action, { call, put }) {
    //   const initOrgList = yield call(queryInitData)
    //   const collegeData = getInfoData(initOrgList.data.userOrgList)
    //   yield put({
    //     type: 'initOrgListSuccess',
    //     data: initOrgList.data,
    //     collegeData: collegeData
    //   })
    // },
  },
  reducers: {
    passwordTypeChange(state, action) {
      return {
        ...state,
        isPassword: action.passwordType
      }
    },
    popoverVisibleChange(state, action) {
      return {
        ...state,
        pwdPopoverVisible: action.pwdPopoverVisible,
      }
    },
    // 登录成功
    loginSuccess(state, action) {
      const { data } = action
      const userInfo = {
        ...data.user,
        role: {
          rules: [...data.user.rules],
          role: data.user.role,
        },
        username: data.user.name,
        email: data.user.account,
        departmentId: data.user.departmentId !== 0 ? data.user.departmentId : null,
        isAutoLogin: action.remember,
        isAppUserOpen: data.user.isOpen,
        token: data.token,
        CIAuthorization: data.CIAuthorization,
      }
      delete userInfo.rules
      // 待改造
      window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
      /*
      导出需要使用cookie信息，TODO 将用户信息存在cookie中，但登录接口返回用户可见的所有院校信息。
      cookie中无法存储那么长字节，这里需要改造登录返回值，将用户可见学校信息拆分为列一个接口，登录后再请求该接口
      获得可见的院校信息
      */
      setCookie(userInfo)
      return {
        ...state,
        loginStatus: true,
        ...userInfo,
      }
    },
    // 登录失败
    loginFail(state, action) {
      return {
        ...state,
        loginStatus: false,
        pwdPopoverVisible: action.pwdPopoverVisible,
        loginMsg: action.msg,
      }
    },
    // 记住登录
    autoLoginWithToken(state, action) {
      return {
        ...state,
        loginStatus: true,
        ...action.data,
      }
    },
    // // 查询机构数据成功
    // initOrgListSuccess(state, action) {
    //   const { data } = action
    //   const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    //   const userSource = {
    //     ...userInfo,
    //     userOrgList: action.collegeData,
    //     orgSpecialties: data.orgSpecialties,
    //     orglist: data.userOrgList,
    //   }
    //   window.localStorage.setItem('userInfo', JSON.stringify(userSource))
    //   return {
    //     ...state,
    //     initOrgListStatus: true,
    //     ...userSource,
    //   }
    // }
  },
}
