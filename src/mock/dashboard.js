const Mock = require('mockjs')
const config = require('../config')
const { apiPrefix } = config

const CollegeInfo = Mock.mock([
  { orgId: 1, orgName: '华中科技大学', pId: -1, level: 0 },
  { orgId: 2, orgName: '电子信息工程学院', pId: 1, level: 1 },
  { orgId: 3, orgName: '计算机学院', pId: 1, level: 1 },
  { orgId: 21, orgName: '电子信息工程专业', pId: 2, level: 2 },
  { orgId: 22, orgName: '通信专业', pId: 2, level: 2 },
  { orgId: 31, orgName: '软件工程专业', pId: 3, level: 2 },
  { orgId: 32, orgName: '软件开发专业', pId: 3, level: 2 }
])

const todayData = Mock.mock({
  teacherActCount: 51,
  studentActCount: 633,
  interSum: {
    today: 8613,
    history: [3422, 2321, 3242, 5353, 2345, 1245, 8613]
  },
  avgAttendanceRate: {
    today: 87,
    history: [86, 87, 92, 67, 84, 89, 87]
  },
  avgCourseActDegree: {
    today: 3.3,
    history: [3.4, 5.4, 3.2, 4.5, 3.2, 5.4, 3.3]
  }
})

module.exports = {
  [`GET ${apiPrefix}/org/userorglist`](req, res) {
    res.json(CollegeInfo)
  },
  // [`GET ${apiPrefix}/statistic/status`](req, res) {
  //   res.json(todayData)
  // },
}
