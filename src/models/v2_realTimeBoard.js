import { parse } from 'qs'
import {
  queryCampus,
  queryClassroom,
  queryBoardData,
  queryDataClassroom,
  queryDataClassroomApi,
  queryTeachingBuilding,
} from '../services/v2/attention'
import { drop, isNumber, isEmpty } from 'lodash'

const getPercent = (num, total) => {
  let percent
  if (num > total) {
    percent = 100
  } else {
    const currentNum = num < 0 ? 0 : num
    // percent = total !== 0 ? Math.round((parseInt(currentNum, 10) / total) * 10000) / 100 : 0
    percent = total !== 0 ? Math.round(currentNum * 10000) / 100 : 0
  }
  return percent
}

const getNum = (num) => (isNumber(num) ? Math.round(num * 10000) / 100 : 0)

const fixedArrLen = (arr, newNumber) => {
  const len = arr.length
  let newArr = arr
  if (len === 90) {
    newArr = drop(arr)
  }
  newArr.push(newNumber)
  return newArr
}
// 历史数据查询
export default {
  namespace: 'v2_realTimeBoard',
  state: {
    loading: false,
    campus: [],
    classroomData: [],
    activeClassroom: null,
    studentNum: undefined,
    currentNod: 0,
    currentLookUp: 0,
    base64Url: '',
    bbox: [], // 抬头低头矩形框坐标
    nod: [], // // 抬头率/分钟
    lookUp: [], // 抬头率/秒
    nodNum: [], // 点头频次
    date: [],
    webSocketLinkError: false,
    webSocketIsLink: false,
    webSocketLinkUrl: '',
    errorMsg: '',
    webSocketLinkErrorClose: true,
    campusId: null,
    classroomBuilding: [],
    classroomBuildingId: null,
    courseBasicMsg: {},
  },
  subscriptions: {
  },
  effects: {
    // 查询校区
    * queryCampus(action, { call, put }) {
      yield put({ type: 'queryCampusStart' })
      const res = yield call(queryCampus)
      let id = null
      if (res.data && res.data.length) {
        if (action.campusId) {
          id = action.campusId
        } else {
          id = res.data[0].id
        }
      }
      yield put({ type: 'queryCampusSuccess', data: res.data, id: id ? parseInt(id, 10): null})
    },
    // 查询教学楼
    * queryTeachingBuilding(action, { call, put }) {
      yield put({ type: 'queryTeachingBuildingStart' })
      const res = yield call(queryTeachingBuilding, parse(action.params))
      let id = null
      if (res && res.data && res.data.length) {
        if (action.params.classroomBuildingId) {
          id = action.params.classroomBuildingId
        } else {
          id = res.data[0].id
        }
      }
      yield put({ type: 'queryTeachingBuildingSuccess', data: res.data, id: id ? parseInt(id, 10): null })
    },
    // 根据校区查询教室 根据教学楼ID查询教室
    * queryClassroom(action, { call, put }) {
      yield put({ type: 'queryClassroomStart' })
      const res = yield call(queryDataClassroomApi, parse(action.params))
      let id = null
      if (res && res.length) {
        if (action.params.activeClassroom) {
          id = action.params.activeClassroom
        }
      }
      yield put({ type: 'queryClassroomSuccess', data: res, id: id ? parseInt(id, 10): null })
    },
    // // 根据校区查询教室
    // * queryClassroom(action, { call, put }) {
    //   yield put({ type: 'queryClassroomStart' })
    //   const res = yield call(queryClassroom)
    //   yield put({ type: 'queryClassroomSuccess', data: res.data })
    // },
    * queryBoardData(action, { call, put }) {
      yield put({ type: 'queryBoardDataStart' })
      try {
        const res = yield call(queryBoardData, action.param.classroom)
        yield put({ type: 'queryBoardDataSuccess', data: res })
      } catch (err) {
        if (err.resp.status === 400) {
          yield put({ type: 'queryBoardDataFile', data: { msg: err.resp.data.msg, param: action.param } })
        }
      }
    }
  },
  reducers: {
    queryCampusStart(state) {
      return {
        ...state,
        loading: true,
        campus: [],
        classroomBuildingId: null,
        classroomBuilding: [],
      }
    },
    queryCampusSuccess(state, action) {
      return {
        ...state,
        loading: false,
        campus: action.data,
        campusId: action.id,
      }
    },
    queryTeachingBuildingStart(state) {
      return {
        ...state,
        loading: true,
        classroomBuilding: [],
        activeClassroom: null,
        classroomData: [],
      }
    },
    queryTeachingBuildingSuccess(state, action) {
      return {
        ...state,
        loading: false,
        classroomBuilding: action.data,
        classroomBuildingId: action.id
      }
    },
    queryClassroomStart(state) {
      return {
        ...state,
        loading: true,
        classroomData: [],
      }
    },
    // 教室查询成功
    queryClassroomSuccess(state, action) {
      return {
        ...state,
        loading: false,
        classroomData: action.data,
        activeClassroom: action.id,
      }
    },
    // 开始查询websocket地址
    queryBoardDataStart(state) {
      return {
        ...state,
        errorMsg: '',
        loading: true,
        currentNod: 0,
        currentLookUp: 0,
        studentNum: 0,
        nod: [],
        lookUp: [],
        nodNum: [],
        date: [],
        base64Url: null,
      }
    },
    // 查询webSocket地址成功
    queryBoardDataSuccess(state, action) {
      return {
        ...state,
        webSocketLinkUrl: action.data.channel,
        courseBasicMsg: {
          course: action.data.course,
          teacher: action.data.teacher,
          department: action.data.department,
          avatar: action.data.avatar,
        }
      }
    },
    // 查询webSocket地址失败
    queryBoardDataFile(state, action) {
      const data = action.data
      return {
        ...state,
        loading: false,
        errorMsg: data.msg,
        webSocketLinkUrl: '',
        activeClassroom: data.param.classroom,
        currentNod: 0,
        currentLookUp: 0,
        studentNum: 0,
        nod: [],
        lookUp: [],
        nodNum: [],
        date: [],
        base64Url: null,
        bbox: [],
      }
    },
    // webSocket 链接成功 接受返回数据-抬头率返回值
    webSocketLinkLookUpSuccess(state, action) {
      const data = JSON.parse(action.data)
      let result = { ...state, loading: false }
      if (!isEmpty(data)) {
        let dateArr = state.date ? state.date : []
        dateArr = fixedArrLen(dateArr, data.date)

        let lookUpArr = state.lookUp ? state.lookUp : []
        lookUpArr = fixedArrLen(lookUpArr, getPercent(data.lookUp, data.studentNum))
        
        let nodArr = state.nod ? state.nod : []
        nodArr = fixedArrLen(nodArr, 0)

        let nodNum = state.nodNum ? state.nodNum : []
        nodNum = fixedArrLen(nodNum, 0)

        result = {
          ...state,
          loading: false,
          currentLookUp: getPercent(data.lookUp, data.studentNum),
          studentNum: data.studentNum,
          lookUp: lookUpArr,
          nod: nodArr,
          nodNum: nodNum,
          date: dateArr,
          base64Url: data.url,
          errorMsg: '',
          bbox: data.bbox
        }
      }
      return result
    },
    // 抬头率/分 和 点头频次返回值
    webSocketLinkNodSuccess(state, action) {
      const data = JSON.parse(action.data)
      let result = { ...state, loading: false }
      if (!isEmpty(data)) {
        let dateArr = state.date ? state.date : []
        dateArr = fixedArrLen(dateArr, data.date)

        let nodArr = state.nod ? state.nod : []
        nodArr = fixedArrLen(nodArr, getNum(data.lookUp))

        let nodNumArr = state.nodNum ? state.nodNum : []
        nodNumArr = fixedArrLen(nodNumArr, data.nod)

        result = {
          ...state,
          loading: false,
          currentNod: getNum(data.lookUp),
          nod: nodArr, // 抬头率/分钟
          nodNum: nodNumArr,
          date: dateArr,
          errorMsg: '',
          courseBasicMsg: {
            course: data.course,
            teacher: data.teacher,
            department: data.department,
            avatar: data.avatar,
          }
        }
      }
      return result
    },
    // // 点头频次数据返回成功
    // webSocketLinkNodeNumSuccess(state, action) {
    //   const data = JSON.parse(action.data)
    //   let result = { ...state, loading: false }
    //   if (!isEmpty(data)) {
    //     let nodNumArr = state.nodNum ? state.nodNum : []
    //     let dateArr = state.date ? state.date : []
    //     dateArr = fixedArrLen(dateArr, data.date)
    //     nodNumArr = fixedArrLen(nodNumArr, getNum(data.nodNum))
    //     result = {
    //       ...state,
    //       loading: false,
    //       currentNod: getNum(data.nodNum),
    //       nodNum: nodNumArr,
    //       date: dateArr,
    //       errorMsg: '',
    //       courseBasicMsg: {
    //         course: data.course,
    //         teacher: data.teacher,
    //         department: data.department,
    //         avatar: data.avatar,
    //       }
    //     }
    //   }
    //   return result
    // },
    // webSocket 链接错误
    setWebSocketLinkErrorStatus(state, action) {
      return {
        ...state,
        loading: false,
        webSocketLinkError: action.status,
        errorMsg: action.err,
      }
    },
    // 关闭webSocket链接
    webSocketLinkClose(state) {
      return {
        ...state,
        webSocketLinkUrl: '',
        currentNod: 0,
        currentLookUp: 0,
        studentNum: 0,
        nod: [],
        lookUp: [],
        date: [],
        base64Url: null,
        errorMsg: '',
      }
    },
    // 设置websocket链接状态
    setWebSocketIsLinkStatus(state, action) {
      return {
        ...state,
        webSocketIsLink: action.status,
      }
    },
    // 搜索教室
    changeClassroom(state, action) {
      return {
        ...state,
        errorMsg: '',
        loading: false,
        activeClassroom: action.classroom,
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
    }
  },
}
