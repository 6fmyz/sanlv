import { parse } from 'qs'
import moment from 'moment'
import {
  queryTeacherByDepartmentId,
  queryCoursesAnalysisData,
  queryCourseListByTeacherId,
  deleteClassroomHistoryDataApi,
} from '../services/v2/attention'


export default {
  namespace: 'v2_courseDataAnalysis',
  state: {
    collegeOrgId: null,
    fstOrgId: null,
    secOrgId: null,
    tableDate: [],
    totalDataNum: 0,
    loading: false,
    startDate: '2020-05-18', 
    endDate: '2021-05-18', 
    pageNum: 1,
    pageSize: 5,
    // teacherId: null,
    rate: ['attendanceRate', 'lookupRate', 'nodRate'],
    teacherList: [],
    teacherCourseList: [],
    // courseId: null,
    currentPeriod: 0,
  },
  subscriptions: {
  },
  effects: {
    // 查询院系下的教师
    * queryTeachersListByDepartmentId(action, { call, put }) {
      const res = yield call(queryTeacherByDepartmentId, parse(action.param))
      yield put({ type: 'queryTeacherByDepartmentIdSuccess', data: res })
    },
    // 查询教师的课堂
    * queryCourseListByTeacherId(action, { call, put }) {
      const res = yield call(queryCourseListByTeacherId, parse(action.param))
      yield put({ type: 'queryCourseListByTeacherIdSuccess', data: res })
    },
    // 课堂数据分析列表
    * queryCoursesAnalysisDataRate(action, { call, put }) {
      const res = yield call(queryCoursesAnalysisData, parse(action.param))
      yield put({ type: 'queryCoursesAnalysisDataSuccess', data: res.data.records, total: res.data.num })
    },
    // 删除课堂信息
    * deleteCourseData(action, { call, put }) {
      try {
        const res = yield call(deleteClassroomHistoryDataApi, {id: action.id})
        yield put({
          type: 'deleteCourseDataSuccess',
          id: action.id
        })
        action.deleteSuccess()
      } catch(err) {
        console.log(err)
        action.deleteFailed()
      }
    }
  },
  reducers: {
    // 选择学院信息
    collegeChange(state, action) {
      return {
        ...state,
        fstOrgId: action.id,
      }
    },
    // 选择教师
    teacherChange(state, action) {
      return {
        ...state,
        teacherId: action.id,
      }
    },
    // 更换教师课堂
    teacherCourseChange(state, action) {
      return {
        ...state,
        courseId: action.id,
      }
    },
    // 时间段变化
    changeCurrentPeriod(state, action) {
      return {
        ...state,
        currentPeriod: action.dieff,
      }
    },
    // 更换开始时间
    changeStartDate(state, action) {
      return {
        ...state,
        startDate: action.startDate,
      }
    },
    // 更换结束时间
    changeEndDate(state, action) {
      return {
        ...state,
        endDate: action.endDate,
      }
    },
    // 更换三率显示
    changeRate(state, action) {
      return {
        ...state,
        rate: action.rate,
      }
    },
    // 翻页
    changePageNumber(state, action) {
      return {
        ...state,
        pageNum: action.pageNumber,
      }
    },

    // 查询院系下的教师-开始查询
    queryTeachersListByDepartmentId(state) {
      return {
        ...state,
        teacherList: [],
      }
    },
    // 查询院系下的教师-成功
    queryTeacherByDepartmentIdSuccess(state, action) {
      return {
        ...state,
        teacherList: action.data,
      }
    },
    // 查询教师课堂列表-成功
    queryCourseListByTeacherIdSuccess(state, action) {
      return {
        ...state,
        teacherCourseList: action.data,
      }
    },
    // 查询课堂数据分析列表
    queryCoursesAnalysisData(state) {
      return {
        ...state,
        tableDate: [],
        totalDataNum: 0,
      }
    },
    // 查询课堂数据分析列表-成功
    queryCoursesAnalysisDataSuccess(state, action) {
      return {
        ...state,
        tableDate: action.data,
        totalDataNum: action.total,
      }
    },
    // 初始化列表过滤参数
    initFilterParams(state, action) {
      return {
        ...state,
        // teacherId: null,
        // courseId: null,
        currentPeriod: 0,
        pageNum: 1, 
        rate: ['attendanceRate', 'lookupRate', 'nodRate'],
        fstOrgId: null,
        startDate: '2020-05-18', 
        endDate: '2021-05-18', 
        pageSize: 5,
      }
    },
    deleteCourseDataSuccess(state, action) {
      return {
        ...state,
        tableDate: state.tableDate.filter(course => {
          return course.id !== action.id
        }),
        totalDataNum: state.totalDataNum - 1
      }
    }
  },
}
