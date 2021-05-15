import { createSelector } from 'reselect'

const historyDetailedBoxState = state => state.v2_historyDataDetailedBox
const appState = state => state.app

const selectors = createSelector(
  historyDetailedBoxState, appState,
  (detailedBox, app) => {
    return ({
      ...detailedBox,
      collegeInfo: null,//app.user ? app.user.userOrgList : null,
      userDepartmentId: null,//app.user.departmentId ? app.user.departmentId : null,
      fstOrgId: null,// app.user.departmentId ? app.user.departmentId : null,
    })
  }
)
export default selectors