import { createSelector } from 'reselect'

const historyState = state => state.v2_classroomHistoryDataQuery
const appState = state => state.app

const selectors = createSelector(
  historyState, appState,
  (history, app) => {
    return ({
      ...history,
      collegeInfo: null,//app.user ? app.user.userOrgList : null,
      userDepartmentId: null,//app.user.departmentId ? app.user.departmentId : null,
      fstOrgId: null,//app.user.departmentId ? app.user.departmentId : null,
    })
  }
)
export default selectors