const config = require('../config')
const { apiPrefix } = config
const API = {
  userorglist: `${apiPrefix}/org/userorglist`,
  status: `${apiPrefix}/statistic/status`,
  timeline: `${apiPrefix}/statistic/timeline`,
  rankgroup: `${apiPrefix}/statistic/rankgroup`,
  total: `${apiPrefix}/statistic/total`,
  sourceInfo: `${apiPrefix}/statistic/info`,
  teacheractlist: `${apiPrefix}/statistic/teacheractlist`,
  studentactlist: `${apiPrefix}/statistic/studentactlist`,
  courseactlist: `${apiPrefix}/statistic/courseactlist`,
  orgteacheractratelist: `${apiPrefix}/statistic/orgteacheractratelist`,
  orgsignratelist: `${apiPrefix}/statistic/orgsignratelist`,
  orgstudentactdegreelist: `${apiPrefix}/statistic/orgstudentactdegreelist`,
  courseactdegreelist: `${apiPrefix}/statistic/courseactdegreelist`,
  coursesignratelist: `${apiPrefix}/statistic/coursesignratelist`,
  teacheractdegreelist: `${apiPrefix}/statistic/teacheractdegreelist`,

  // 教师管理相关
  teacher: `${apiPrefix}/teacher`,
  frozen: `${apiPrefix}/teacher/frozen`,

  // 登录相关
  nonce: `${apiPrefix}/authentication/nonce`,
  login: `${apiPrefix}/authentication`,
  password: `${apiPrefix}/authentication/password`,

  // 学生管理
  student: `${apiPrefix}/student`,

  // 院系认证
  college: `${apiPrefix}/org`,

  // 今日学情历史记录
  hislist: `${apiPrefix}/statistic/status/hislist`,

  // 修改密码
  resetPsd: `${apiPrefix}/accounts/password`,

  // 账号管理
  account: `${apiPrefix}/accounts`,

  // 答题课堂信息
  courses: `${apiPrefix}/courses`,

  // 答题 题库
  libraries: `${apiPrefix}/libraries`,
}

export default API
