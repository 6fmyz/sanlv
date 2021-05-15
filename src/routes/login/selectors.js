import { createSelector } from 'reselect'

const loginState = state => state.login
const appState = state => state.app

const selectors = createSelector(
  loginState, appState,
  (login, app) => ({
    ...login,
    initOrgListStatus: app.initOrgListStatus,
  })
)
export default selectors