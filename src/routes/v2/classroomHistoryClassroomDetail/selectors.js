import {
  createSelector
} from 'reselect'
import menus from '../../../utils/menu'


const stateDomain = state => state.v2_classroomHistoryClassroomDetail

const appState = state => state.app

const locationState = (state, props) => props.location

/* 获取当前页面模块的权限 */
const accountRoleRulesSelector = createSelector(
  appState,
  locationState,
  (app, location) => {
    const role = app.user ? app.user.role : null
    // const {
    //   rules,
    // } = role
    const rules = null;
    const path = location.pathname
    const currentModuleId = menus.filter(item => { // 当前路由对应的模块id
      return item.router === `/${path.split('/')[1]}`
    })[0].id
    return rules && rules.length !== 0 ? rules.filter(item => { // 当前用户在此模块下的权限
      return item.moduleId === currentModuleId
    })[0] : {
      add: 0,
      del: 0,
      edit: 0,
      view: 1,
      export: 0,
    }
  }
)

const selectors = createSelector(
  stateDomain,
  accountRoleRulesSelector,
  (state, accountRoleRules) => {
    return {
      ...state,
      accountRoleRules,
    }
  }
)

export default selectors