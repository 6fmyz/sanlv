import { createSelector } from 'reselect'
import { getParamOrgId } from '../../../utils/index'

const sourceInfoState = state => state.v2_teachingResourceAnalysis
const appState = state => state.app

const selectors = createSelector(
  sourceInfoState, appState,
  (sourceInfo, app) => {
    const collegeOrgId = app.user ? app.collegeOrgId : null
    const fstOrgId = app.user ? app.fstOrgId : null
    const secOrgId = app.user ? app.secOrgId : null
    const orgId = getParamOrgId(collegeOrgId, fstOrgId, secOrgId)
    let childId = app.user ? app.fstOrgId : null
    childId = app.secOrgId ? app.secOrgId : childId
    return ({
      ...sourceInfo,
      orgId: app.user.departmentId ? app.user.departmentId :collegeOrgId,
      orglist: app.user ? app.user.orglist : {},
      accountLevel: childId ? 1 : 0,
      userDepartmentId: app.user.departmentId ? app.user.departmentId : null,
    })
  }
)
export default selectors