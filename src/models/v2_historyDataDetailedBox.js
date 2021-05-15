
import { parse } from 'qs'
import {
  queryCourseMonitorsBoxList
} from '../services/v2/attention'

// 历史记录查询
export default {
  namespace: 'v2_historyDataDetailedBox',
  state: {
    teacherName: '',
    className: '',
    semester: '',
    courseId: null,
    loading: false,
    dataSource: [],
  },
  subscriptions: {
  },
  effects: {
    * queryBoxList(action, { call, put }) {
      yield put({ type: 'queryBoxListStart' })
      const res = yield call(queryCourseMonitorsBoxList, action.courseId)
      yield put({ type: 'queryBoxListSuccess', data: res.data })
    },
  },
  reducers: {
    // 设置标题数据
    setTitleInfo(state, action) {
      const data = action.data
      return {
        ...state,
        teacherName: action.record.name,
        className: action.record.courseName,
        semester: action.record.term,
        courseId: action.record.courseId,
      }
    },
    // 开始查询
    queryBoxListStart(state) {
      return {
        ...state,
        loading: true,
        dataSource: [],
      }
    },
    // 查询成功
    queryBoxListSuccess(state, action) {
      const source = action.data
      return {
        ...state,
        loading: false,
        dataSource: source.data,
        teacherName: source.course.name,
        className: source.course.courseName,
        semester: source.course.term,
      }
    },
  },
}
