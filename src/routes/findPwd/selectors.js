import { createSelector } from 'reselect'

const findPwdState = state => state.findPwd

const selectors = createSelector(
  findPwdState,
  (findPwd) => ({
    ...findPwd,
  })
)
export default selectors