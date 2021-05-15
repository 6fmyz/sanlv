import {
  queryClassroomCourseDetailApi,
  deleteClassroomHistoryDataApi,
} from '../services/v2/attention'

export default {
  namespace: 'v2_classroomHistoryClassroomDetail',
  state: {
    loading: false,
    dataSource: [],
    totalNum: 0,
    page: 1,
    pageSize: 20,
    classroom: {},
  },
  effects: {
    * queryClassroomCourseDetail(actions, { call, put }) {
      yield put({ type: 'queryClassroomCourseDetailStart'})
      const res = yield call(queryClassroomCourseDetailApi, {classroomId: actions.classroomId, page: actions.page, pageSize: 20})
      yield put({
        type: 'queryClassroomCourseDetailSuccess',
        data: res.data.records,
        totalNum: res.data.num,
        classroom: res.data.classroom,
      })
    },
    * deleteClassroomHistoryData(actions, { call, put }) {
      try {
        yield call(deleteClassroomHistoryDataApi, {id: actions.id})
        yield put({
          type: 'deleteClassroomHistoryDataSuccess',
          id: actions.id,
        })
        actions.deleteSuccess()
      } catch(err) {
        console.log(err)
        actions.deleteFailed()
      }
    }
  },
  reducers: {
    queryClassroomCourseDetailStart(state, actions) {
      return {
        ...state,
        loading: true,
      }
    },
    queryClassroomCourseDetailSuccess(state, actions) {
      return {
        ...state,
        loading: false,
        dataSource: actions.data,
        totalNum: actions.totalNum,
        classroom: actions.classroom,
      }
    },
    changePageNumber(state, actions) {
      return {
        ...state,
        page: actions.page,
      }
    },
    deleteClassroomHistoryDataSuccess(state, actions) {
      return {
        ...state,
        dataSource: state.dataSource.filter(data => {
          return data.id !== actions.id
        }),
        totalNum: state.totalNum - 1
      }
    }
  }
}