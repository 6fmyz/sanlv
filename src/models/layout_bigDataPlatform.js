import { parse } from 'qs'

export default {
  namespace: 'layout_bigDataPlatform',
  state: {
    clickType: 0,
  },
  subscriptions: {
  },
  effects: {
    
  },
  reducers: {
    changeClickType(state, action) {
      return {
        ...state,
        clickType: action.data,
      }
    }
  },
}
