import * as request from '../utils/request'
const config = require('../config')
const { apiPrefix } = config

export async function queryNonce(params) {
  return request.GetJson(`${apiPrefix}/authentication/nonce`, params)
}
export async function queryToken(params) {
  return request.PostJson(`${apiPrefix}/authentication`, params)
}
export async function loginOut() {
  return request.DelJson(`${apiPrefix}/authentication`)
}
export async function resetPasswordForSendEmail(params) {
  return request.DelJson(`${apiPrefix}/authentication/password`, params)
}
export async function resetPasswordSendNewPwd(params) {
  return request.PostJson(`${apiPrefix}/authentication/password`, params)
}
export async function resetAccountPassword(params) {
  return request.PutJson(`${apiPrefix}/accounts/password`, params)
}
export async function queryInitData(params) {
  return request.GetJson(`${apiPrefix}/orgs/initData`, params)
}

/* 查询用户权限数据 */
export async function accountRolesAppmodulesApi() {
  return request.GetJson(`${apiPrefix}/accountRoles/appModules`)
}