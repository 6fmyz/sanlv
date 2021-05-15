import { createSelector } from 'reselect'

const historyDataDetailedState = state => state.v2_historyDataDetailed
const appState = state => state.app

const selectors = createSelector(
  historyDataDetailedState, appState,
  (detailed, app) => ({
    ...detailed,
    collegeInfo: null,//app.user ? app.user.userOrgList : null,
    userDepartmentId: null,//app.user.departmentId ? app.user.departmentId : null,
    fstOrgId: null,//app.user.departmentId ? app.user.departmentId : null,
  })
)
export default selectors