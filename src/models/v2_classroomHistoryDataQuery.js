import {
  queryCampus,
  queryTeachingBuilding,
  // queryDataClassroomApi,
  queryClassroomList,
  queryDataClassroom,
} from '../services/v2/attention'
import moment from 'moment'
import { parse } from 'qs'

// 教室历史记录查询
export default {
  namespace: 'v2_classroomHistoryDataQuery',
  state: {
    loading: false,
    campus: [],
    classroomBuilding: [],
    classroom: [],
    campusId: undefined,
    classroomBuildingId: undefined,
    classroomId: undefined,
    dataSource: [],
    totalNun: 0,
    page: 1,
    pageSize: 20,
    startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  },
  subscriptions: {
  },
  effects: {
    // 查询校区
    * queryCampus(action, { call, put }) {
      const res = yield call(queryCampus)
      yield put({ type: 'queryCampusSuccess', data: res.data })
    },
    // 查询教学楼
    * queryTeachingBuilding(action, { call, put }) {
      const res = yield call(queryTeachingBuilding, parse(action.params))
      yield put({ type: 'queryTeachingBuildingSuccess', data: res.data })
    },
    // 查询教室
    * queryClassroom(action, { call, put }) {
      const res = yield call(queryDataClassroom, parse(action.params))
      yield put({ type: 'queryClassroomSuccess', data: res.data })
    },
    // 查询列表数据
    * queryClassroomList(action, { call, put }) {
      const res = yield call(queryClassroomList, parse(action.params))
      console.log(222, res.data)
      let data = res.data.map(item=>{
        if(!item.classroomName.includes('教室')){
          return {...item, classroomName: item.classroomName+'教室'}
        }
        return item
      })
      yield put({ type: 'queryClassroomListSuccess', data: data })
    },
  },
  reducers: {
    queryCampusSuccess(state, action) {
      return {
        ...state,
        campus: action.data,
      }
    },
    queryTeachingBuildingSuccess(state, action) {
      return {
        ...state,
        classroomBuilding: action.data,
      }
    },
    queryClassroomSuccess(state, action) {
      return {
        ...state,
        classroom: action.data,
      }
    },
    queryClassroomListSuccess(state, action) {
      return {
        ...state,
        dataSource: action.data,
      }
    },
    // 更换学院
    collegeChange(state, action) {
      return {
        ...state,
        departmentId: action.id,
      }
    },
    // 更换校区
    changeCampus(state, action) {
      return {
        ...state,
        campusId: action.id,
      }
    },
    // 更换教学楼
    changeClassroomBuilding(state, action) {
      return {
        ...state,
        classroomBuildingId: action.id,
      }
    },
    // 更换教室
    changeClassroom(state, action) {
      return {
        ...state,
        classroomId: action.id,
      }
    },
    // 翻页
    changePageNumber(state, action) {
      return {
        ...state,
        page: action.page,
      }
    },
    initFilterParams(state, action) {
      return {
        ...state,
        ...action.params
      }
    }
  },
}
