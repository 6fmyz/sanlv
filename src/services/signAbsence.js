import * as request from '../utils/request'
const config = require('../config')
const { apiPrefix } = config

// 查询缺勤情况
export async function queryAbsenteeismsList(params) {
  return request.GetJson(`${apiPrefix}/signs/absenteeisms`, params)
}
