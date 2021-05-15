import * as request from '../../utils/request'
const config = require('../../config')
const { apiPrefix } = config
// 注意力分析
// 课堂历史数据-列表
export async function queryCourseMonitorsList(params) {
  return request.GetJson(`${apiPrefix}/courseMonitors`, params)
}
// 教师联想搜索
export function queryTeachers(params) {
  return request.GetJson(`${apiPrefix}/searchs/teachers`, params)
}

// 课程联想搜索
export function queryCourses(params) {
  return request.GetJson(`${apiPrefix}/searchs/courses`, params)
}

// 教室联想搜索
export function queryClassrooms(params) {
  return request.GetJson(`${apiPrefix}/searchs/classrooms`, params)
}

// 课堂历史数据-列表-详情
export async function queryCourseMonitorsBoxList(courseId) {
  return request.GetJson(`${apiPrefix}/courseMonitors/${courseId}`)
}

// 课堂历史数据-列表-某一堂课的上课详情
export async function queryCourseMonitorsBoxDetail(scheduleId) {
  return request.GetJson(`${apiPrefix}/courseMonitors/${scheduleId}/detail`)
}

// 实时看板-教室搜索
export async function queryClassroom() {
  return request.GetJson(`${apiPrefix}/resources/classrooms`)
}

// 实时看板-数据接口
export async function queryBoardData(classroom) {
  return request.GetJson(`${apiPrefix}/courseMonitors/${classroom}/currentTime/board`)
}

// 教室历史数据查询
// 1.校区
export async function queryCampus() {
  return request.GetJson(`${apiPrefix}/resources/campus`)
}
// 2.教学楼
export async function queryTeachingBuilding(params) {
  return request.GetJson(`${apiPrefix}/resources/classroomBuildings`, params)
}
// 3.教室
export async function queryDataClassroom(params) {
  return request.GetJson(`${apiPrefix}/resources/classrooms`, params)
}
// 4.教室历史数据查询
export async function queryClassroomList(params) {
  return request.GetJson(`${apiPrefix}/courseMonitors/classrooms/list`, params)
}
// 5.根据课堂id查询课堂的课程信息
export async function queryClassroomCourseDetailApi({classroomId, page, pageSize}) {
  return request.GetJson(`${apiPrefix}/courseMonitors/classrooms/${classroomId}/list?page=${page}&pageSize=${pageSize}`)
}

export async function queryDataClassroomApi(params) {
  return request.GetJson(`${apiPrefix}/sanlvs`, params)

}


// 课堂数据分析
// 1.根据院系ID 查询院系教师
export async function queryTeacherByDepartmentId(params) {
  return request.GetJson(`${apiPrefix}/searchs/${params.departmentId}/teachers`)
}
// 2.根据条件，查询课堂三率数据
export async function queryCoursesAnalysisData(params) {
  return request.GetJson(`${apiPrefix}/courseMonitors/coursesRate/list`, params)
}

// 3.根据教师ID查询他的课堂
export async function queryCourseListByTeacherId(params) {
  return request.GetJson(`${apiPrefix}/courses/list/${params.teacherId}`, params)
}

// 总体设备控制
// 1.获得教室设备状态
// /api/devices?campusId=1&classroomBuildingId=1
export async function queryClassroomDevices(params) {
  return request.GetJson(`${apiPrefix}/devices`, params)
}
// 2.教室设备的开机关机状态设置
// PUT: /api/devices/:deviceId body参数：command：turn-on： 开机 turn-off：关机
export async function setClassroomDevicesStatus(params) {
  return request.PutJson(`${apiPrefix}/devices/${params.deviceId}`, params)
}
// 3.三率监测状态
// /api/sanlvs?campusId=1&classroomBuildingId=1
// 数据[{id: 1, name: 'xx', status: 1}] status: (0:不在线 1:监测中)
export async function queryClassroomSanlv(params) {
  return request.GetJson(`${apiPrefix}/sanlvs`, params)
}

// 4.查询教室开机日志
export async function queryClassroomBootLogs(params) {
  return request.GetJson(`${apiPrefix}/teacherLogs`, params)
}

// 删除课堂信息
export async function deleteClassroomHistoryDataApi({id}) {
  return request.DelJson(`${apiPrefix}/courseMonitors/${id}`)
}
