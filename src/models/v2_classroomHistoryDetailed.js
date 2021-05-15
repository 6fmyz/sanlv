import {
  queryCourseMonitorsBoxDetail,
  deleteClassroomHistoryDataApi,
} from '../services/v2/attention'
import { isEmpty } from 'lodash'

// 历史记录查询
export default {
  namespace: 'v2_classroomHistoryDetailed',
  state: {
    activeMarkInfo: {},
    teacherName: '',
    className: '',
    courseId: '',
    semester: '',
    date: '',
    studentsNum: '',
    scheduleId: null,
    dataSource: {},
    loading: false,
    classroomMsg: {},
    snapshots: [], // 所有时间节点的图像数据
    attendanceCounts: [],
    maxStudents: {},
  },
  subscriptions: {
  },
  effects: {
    * queryBoxDetail(action, { call, put }) {
      yield put({ type: 'queryBoxDetailStart' })
      const res = yield call(queryCourseMonitorsBoxDetail, action.scheduleId)
      yield put({ type: 'queryBoxDetailSuccess', data: res.data })
    },
    * deleteDetail(action, { call, put }) {
      try {
        yield call(deleteClassroomHistoryDataApi, { id: action.id })
        action.deleteSuccess()
      } catch(err) {
        console.log(err)
        action.deleteFailed()
      }
    }
  },
  reducers: {
    // 开始查询
    queryBoxDetailStart(state) {
      return {
        ...state,
        loading: true,
        dataSource: {},
        activeMarkInfo: {},
      }
    },
    // 查询成功
    queryBoxDetailSuccess(state, action) {
      const data = action.data
      const arr = data.nodeNum.map((val, key) => [data.lookUp[key], val])
      let active

      const newLookUpMark = [...data.lookUpMark]
      if (!isEmpty(data.maxStudents)) {
        newLookUpMark.push(data.maxStudents)
        active = {
          activeImgUrl: data.maxStudents.url,
          rate: data.maxStudents.attendanceCount,
          date: data.maxStudents.time,
          bbox: data.maxStudents.bbox
        }
      }
      if (!active && !isEmpty(data.lookUpMark)) {
        active = {
          activeImgUrl: data.lookUpMark.url,
          rate: data.lookUpMark.attendanceCount,
          date: data.lookUpMark.time,
          bbox: data.lookUpMark.bbox
        }
      }

      if(!active && data.date && data.date.length) {
        active = {  
          activeImgUrl: data.snapshots[0],
          rate: data.attendanceCounts[0],
          date: data.date[0],
          bbox: data.bboxs && data.bboxs[0]
        }
      }
      newLookUpMark.push({
        type: 4,
        avgLookUp: data.avgLookUp,
      })
      newLookUpMark.push({
        type: 5,
        avgNod: data.avgNod,
      })
      return {
        ...state,
        loading: false,
        activeMarkInfo: !isEmpty(active) ? active : {},
        teacherName: data.course ? data.course.name : '',
        className: data.course ? data.course.courseName : '',
        courseId: data.course ? data.course.courseId : '',
        semester: data.course ? data.course.term : '',
        dataSource: {
          chartData: {
            nodMark: data.nodMark,
            // nod: data.nod,
            nodeNum: data.nodeNum, // 点头数
            lookUpMark: newLookUpMark, //
            lookUp: data.lookUp, // 抬头率
            date: data.date, // 时间轴
          },
          students: data.students,
          distributedChartData: arr, // 散点图
        },
        maxStudents: data.maxStudents,
        snapshots: data.snapshots,
        attendanceCounts: data.attendanceCounts,
        classroomMsg: data.classroom,
        avgLookUp: data.avgLookUp,
        avgNode: data.avg,
        bboxs: data.bboxs
      }
    },
    changeActiveMarkInfo(state, action) {
      return {
        ...state,
        activeMarkInfo: {
          name: action.info.name,
          activeImgUrl: action.info.url,
          rate: action.info.value,
          unit: action.info.unit,
          unitText: action.info.unitText,
          id: action.info.id,
          date: action.info.xAxis,
          bbox: action.info.bbox
        },
      }
    },
    setTeacherInfo(state, action) {
      return {
        ...state,
        teacherName: action.info.teacherName,
        className: action.info.className,
        semester: action.info.semester,
        date: action.info.date,
        studentsNum: action.info.studentsNum,
        scheduleId: action.info.scheduleId,
      }
    },
    changeActiveTime(state, action) {
      const activeTime = action.time
      let dateIndex
      let activeMarkInfo
      if (action.isTag && action.isTag === 'attendanceTag') {
        activeMarkInfo = {
          ...state.maxStudents,
          date: activeTime,
          activeImgUrl: state.maxStudents.url,
          rate: state.maxStudents.attendanceCount,
        }
      } else if (action.isTag && action.isTag === 'lookUpTag') {
        const lookUpTagData = state.dataSource.chartData.lookUpMark[0]
        activeMarkInfo = {
          ...lookUpTagData,
          date: activeTime,
          activeImgUrl: lookUpTagData.url,
        }
      } else {
        state.dataSource.chartData.date.some((item, index) => {
          if (item === activeTime) {
            dateIndex = index
            return true
          }
        })
        let activeImgUrl = state.snapshots[dateIndex]
        let rate = state.attendanceCounts[dateIndex]
        let bbox = state.bboxs[dateIndex]
        if ((!activeImgUrl || !activeImgUrl.length) && !isEmpty(state.maxStudents)) {
          activeImgUrl = state.maxStudents.url
          bbox = state.maxStudents.bbox
        }
        activeMarkInfo = {
          activeImgUrl: activeImgUrl,
          date: activeTime,
          rate: rate,
          bbox
        }
      }
      return {
        ...state,
        activeMarkInfo,
      }
    }
  },
}
