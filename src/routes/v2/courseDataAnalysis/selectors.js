import { createSelector } from 'reselect'
import menus from '../../../utils/menu'

const courseDataAnalysisState = state => state.v2_courseDataAnalysis
const appState = state => state.app

const locationState = (state, props) => props.location

/* 获取当前页面模块的权限 */
const accountRoleRulesSelector = createSelector(
  appState,
  locationState,
  (app, location) => {
    const role = app.user ? app.user.role : null
    // const {
    //   rules=null,
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
  courseDataAnalysisState, appState,
  accountRoleRulesSelector,
  (cda, app, accountRoleRules) => {
    let collegeOrgId = app.user ? app.collegeOrgId : null
    collegeOrgId = cda ? cda.collegeOrgId : collegeOrgId
    let fstOrgId = app.user ? app.fstOrgId : null
    fstOrgId = cda && cda.fstOrgId ? cda.fstOrgId : fstOrgId
    fstOrgId = cda.fstOrgId ? cda.fstOrgId : fstOrgId
    let secOrgId = app.user ? app.secOrgId : null
    secOrgId = cda && cda.secOrgId ? cda.secOrgId : secOrgId
    return ({
      ...cda,
      collegeInfo: null,//app.user ? app.user.userOrgList : null,
      userDepartmentId: null,//app.user.departmentId ? app.user.departmentId : null,
      collegeOrgId:  collegeOrgId,
      fstOrgId: null,//app.user.departmentId ? app.user.departmentId : fstOrgId,
      secOrgId: secOrgId,
      accountRoleRules,
      // startDate: app.startDate,
      // endDate: app.endDate,
    })
  }
)
export default selectors