import { parse } from 'qs'
import {
  resetAccountPassword
} from '../services/login'
import { removeUserInfo, encryptPassword } from '../utils/index'

export default {
  namespace: 'resetPassword',
  state: {
    step: 0,
  },
  subscriptions: {
  },
  effects: {
    // 重置密码
    * resetPassword(action, { call, put }) {
      const oldPsd = encryptPassword(action.param.oldPsd)
      const newPsd = encryptPassword(action.param.newPsd)
      try {
        const res = yield call(resetAccountPassword, parse({ oldPsd, newPsd }))
        if (res.message === 'success') {
          yield put({ type: 'resetPasswordSuccess' })
        }
      } catch (err) {
        yield put({ type: 'resetPasswordFilad' })
      }
    },
  },
  reducers: {
    // 重置step
    changeStep(state, action) {
      return {
        ...state,
        step: action.step,
      }
    },
    // 重置密码成功
    resetPasswordSuccess(state, action) {
      removeUserInfo()
      return {
        ...state,
        step: 1,
      }
    },
    // 重置密码失败
    resetPasswordFilad(state, action) {
      return {
        ...state,
        step: 2,
      }
    },
  },
}
