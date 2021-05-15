import { createSelector } from 'reselect'

const resetPasswordState = state => state.resetPassword

const selectors = createSelector(
  resetPasswordState,
  (resetPassword) => ({
    ...resetPassword,
  })
)
export default selectors