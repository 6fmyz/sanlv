import { parse } from 'qs'
import {
  resetPasswordForSendEmail,
  resetPasswordSendNewPwd
} from '../services/login'
import config from '../config'
import md5 from 'md5'

const encryptPassword = password => {
  const passwordSalt = config.auth.passwordSalt
  return md5(md5(`${passwordSalt}_${password}_${passwordSalt}`))
}

export default {
  namespace: 'findPwd',
  state: {
    email: '',
    step: 2,
    sendEmailState: true,
    isPassword: false,
  },
  subscriptions: {
  },
  effects: {
    // 发送重置密码邮件
    * sendEmail(action, { call, put }) {
      const param = {
        account: action.email
      }
      try {
        const res = yield call(resetPasswordForSendEmail, parse(param))
        if (res.success === true) {
          yield put({ type: 'sendEmailSuccess', mail: action.email })
        } else {
          yield put({ type: 'sendEmailFilad' })
        }
      } catch (err) {
        switch (err.resp.status) {
          case 400: // 邮件错误
            break
          case 403: // 邮件发送失败
            break
          case 404: // 邮件非管理员邮箱
            break
          default:
            break
        }
        yield put({ type: 'resetPasswordFilad' })
      }
    },
    // 重置密码
    * resetPassword(action, { call, put }) {
      action.param.password = encryptPassword(action.param.password)
      try {
        const res = yield call(resetPasswordSendNewPwd, parse(action.param))
        if (res.success === true) {
          yield put({ type: 'resetPasswordSuccess' })
        }
      } catch (err) {
        yield put({ type: 'resetPasswordFilad' })
      }
    },
  },
  reducers: {
    // 设置重置密码的步骤数
    setStep(state, action) {
      return {
        ...state,
        step: action.step,
      }
    },
    // 发送邮件成功
    sendEmailSuccess(state, action) {
      return {
        ...state,
        step: 1,
        email: action.mail,
        sendEmailState: true,
        sendEmailAgain: true,
      }
    },
    // 发送邮件失败
    sendEmailFilad(state, action) {
      return {
        ...state,
        step: 1,
        sendEmailState: false,
        sendEmailAgain: true,
      }
    },
    // 重置密码成功
    resetPasswordSuccess(state, action) {
      return {
        ...state,
        step: 3,
      }
    },
    // 重置密码失败
    resetPasswordFilad(state, action) {
      return {
        ...state,
        step: 4,
      }
    },
  },
}
