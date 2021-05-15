import { parse } from 'qs'
import {
  queryCourseMonitorsList,
  queryTeachers,
  queryCourses,
} from '../services/v2/attention'
import {
  currentTermYear,
} from '../utils/helperValue'
import {
  getShowTableData
} from '../routes/v2/historyDataQuery/helper'

// 历史记录查询
export default {
  namespace: 'v2_historyDataQuery',
  state: {
    loading: false,
    dataSource: [],
    totalNun: 0,
    departmentId: null,
    teacher: undefined,
    course: undefined,
    term: currentTermYear.currentTerm,
    year: currentTermYear.currentYear,
    page: 1,
    pageSize: 20,
    teacherNames: [],
    courseNames: [],
  },
  subscriptions: {
  },
  effects: {
    * queryCourseList(action, { call, put }) {
      yield put({type: 'queryCourseListStart'})
      const res = yield call(queryCourseMonitorsList, parse(action.params))
      yield put({ type: 'queryCourseListSuccess', data: res.data.records, total: res.data.num })
    },
    // 教师名称联想
    * queryTeachers(action, { call, put }) {
      const res = yield call(queryTeachers, parse(action.params))
      yield put({ type: 'queryTeachersSuccess', data: res })
    },
    // 课程数据联想
    * queryCourses(action, { call, put }) {
      const res = yield call(queryCourses, parse(action.params))
      yield put({ type: 'queryCoursesSuccess', data: res })
    },
  },
  reducers: {

    queryCourseListStart(state, action) {
      return {
        ...state,
        loading: true,
      }
    },
    // 课程历史数据列表查询
    queryCourseListSuccess(state, action) {
      return {
        ...state,
        dataSource: getShowTableData(action.data),
        totalNun: action.total,
        loading: false,
      }
    },
    // 教师名称联想查询成功
    queryTeachersSuccess(state, action) {
      return {
        ...state,
        teacherNames: action.data,
      }
    },
    // 课程名称联想查询成功
    queryCoursesSuccess(state, action) {
      return {
        ...state,
        courseNames: action.data,
      }
    },
    // 更换学院
    collegeChange(state, action) {
      return {
        ...state,
        departmentId: action.id,
      }
    },
    // 选择教师
    changeTeacher(state, action) {
      return {
        ...state,
        teacher: action.teacher,
      }
    },
    // 更换课堂
    changeCourse(state, action) {
      return {
        ...state,
        course: action.course,
      }
    },
    // 更换学期
    changeTerm(state, action) {
      return {
        ...state,
        term: action.term,
      }
    },
    // 更换学年
    changeYear(state, action) {
      return {
        ...state,
        year: action.year,
      }
    },
    // 翻页
    changePageNumber(state, action) {
      return {
        ...state,
        page: action.page,
      }
    }
  },
}
