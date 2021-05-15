import { createSelector } from 'reselect'

const timeBoardState = state => state.v2_realTimeBoard
const appState = state => state.app

const selectors = createSelector(
  timeBoardState, appState,
  (timeBoard, app) => ({
    ...timeBoard,
    collegeInfo: null,//app.user ? app.user.userOrgList : null,
    userDepartmentId: null,//app.user.departmentId ? app.user.departmentId : null,
    fstOrgId: null,//app.user.departmentId ? app.user.departmentId : null,
  })
)
export default selectors