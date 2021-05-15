import { createSelector } from 'reselect'

const historyDataDetailedState = state => state.v2_classroomHistoryDetailed
const appState = state => state.app

const selectors = createSelector(
  historyDataDetailedState, appState,
  (detailed, app) => {
    return ({
      ...detailed,
      collegeInfo: app.user ? app.user.userOrgList : null,
      userDepartmentId: app.user.departmentId ? app.user.departmentId : null,
      fstOrgId: app.user.departmentId ? app.user.departmentId : null,
    })
  }
)
export default selectors