import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import selectors from './selectors'
import { push } from 'react-router-redux'
import styles from './index.less'
import { Checkbox, Radio, Table, Select, Button, Modal, message } from 'antd'
import moment from 'moment'
import { SmallAttentionChart, SmallBarChart } from '../../../components/Chart'
const config = require('../../../config')
import _ from 'lodash'
const { apiPrefix } = config
const Option = Select.Option
import {
  SelectCollege,
  DatePickerPlugin,
} from '../../../components/Dashboard'
import { MyPagination, MyLoading } from '../../../components/MyPlugin'
import queryString from 'query-string'

const cssStyle = {
  btn: {
    border: 'none',
    color: '#108EE9',
    fontSize: '14px',
    marginLeft: '15px',
  },
  selectStyle: {
    minWidth: '150px',
    marginTop: '8px',
    marginRight: '20px',
    height: 34,
    color: 'rgba(0, 0, 0, 0.65)',
    fontSize: '14px',
  }
}
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const RadioButton = Radio.Button


const notClearFilterParamsArr = [
  '/v2-history-data-query/detailed'
]
class courseDataAnalysis extends React.Component {
  state = {
    showDeleteModal: false,
    deleteConfirmLoading: false,
    idDeleted: null,
  }
  componentWillMount() {
    // this.getQueryDate(this.props.currentPeriod)
    this.initParams()
  }

  // componentDidMount() {
  //   this.props.dispatch({ type: 'v2_courseDataAnalysis/changeStartDate', startDate: '2020-05-18' })
  // }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentPeriod !== nextProps.currentPeriod) {
      this.getQueryDate(nextProps.currentPeriod)
    }
    if (this.props.collegeOrgId !== nextProps.collegeOrgId
    || this.props.fstOrgId !== nextProps.fstOrgId
    || this.props.secOrgId !== nextProps.secOrgId
    || this.props.startDate !== nextProps.startDate
    || this.props.endDate !== nextProps.endDate
    // || this.props.teacherId !== nextProps.teacherId
    // || this.props.courseId !== nextProps.courseId
    ) {
      this.handleOnChangePageNumber(1)
      this.queryList(nextProps)
    }
    if (this.props.pageNum !== nextProps.pageNum) {
      this.queryList(nextProps)
    }
    // if (this.props.fstOrgId !== nextProps.fstOrgId) {
    //   this.queryTeacherList(nextProps.fstOrgId === null ? 0 : nextProps.fstOrgId)
    // }
    // if (this.props.teacherId !== nextProps.teacherId && nextProps.teacherId) {
    //   this.queryCourseList(nextProps.teacherId)
    // }
  }

  getQueryDate = (dieff) => {
    if (dieff > -1) {
      const startDate = moment().subtract(dieff, 'days').format('YYYY-MM-DD')
      const endDate = moment().format('YYYY-MM-DD')
      this.props.dispatch({ type: 'v2_courseDataAnalysis/changeStartDate', startDate: startDate })
      this.props.dispatch({ type: 'v2_courseDataAnalysis/changeEndDate', endDate: endDate })
    }
  }

  // 初始化参数
  initParams() {
    const {
      location: {
        search,
      }
    } = this.props
    const searchParams = queryString.parse(search)
    if (!searchParams.back || notClearFilterParamsArr.indexOf(searchParams.back) === -1) {
      this.props.dispatch({ type: 'v2_courseDataAnalysis/initFilterParams' })
      this.queryList({
        startDate: '2020-05-18', 
        endDate: '2021-05-18', 
        pageNum: 1,
        pageSize: 5,
        // teacherId: null,
        // courseId: null,
        fstOrgId: null,
      })
      // this.queryTeacherList(0)
    } else {
      this.queryList(this.props)
    }
  }

  queryList = (props) => {
    const param = {
      departmentId: props.fstOrgId,
      startDate: props.startDate,
      endDate: props.endDate,
      page: props.pageNum,
      pageSize: 5,
      // teacherId: props.teacherId,
      // courseId: props.courseId,
    }
    this.props.dispatch({
      type: 'v2_courseDataAnalysis/queryCoursesAnalysisDataRate',
      param,
    })
  }

  queryTeacherList = (id) => {
    this.props.dispatch({
      type: 'v2_courseDataAnalysis/queryTeachersListByDepartmentId',
      param: {
        departmentId: id,
      }
    })
  }

  queryCourseList = (id) => {
    this.props.dispatch({
      type: 'v2_courseDataAnalysis/queryCourseListByTeacherId',
      param: {
        teacherId: id,
      }
    })
  }

  // 更改院系
  handleCollegeChange = (value) => {
    this.props.dispatch({ type: 'v2_courseDataAnalysis/collegeChange', id: value })
    this.handleChangeTeacherId(null)
    this.handleChangeCourseId(null)
  }

  // 更换教师
  handleChangeTeacherId = (teacherId) => {
    this.props.dispatch({ type: 'v2_courseDataAnalysis/teacherChange', id: teacherId })
    this.handleChangeCourseId(null)
  }
  // 更换教师课堂
  handleChangeCourseId = (courseId) => {
    this.props.dispatch({ type: 'v2_courseDataAnalysis/teacherCourseChange', id: courseId })
  }
  // 时间段选中变化
  handelRadioGroupChange = (dieff) => {
    // console.log(dieff)
    this.props.dispatch({ type: 'v2_courseDataAnalysis/changeCurrentPeriod', dieff: dieff })
  }

  // 更换开始时间
  startChange = (date) => {
    this.props.dispatch({ type: 'v2_courseDataAnalysis/changeStartDate', startDate: date })
  }

  // 更换结束时间
  endChange = (date) => {
    this.props.dispatch({ type: 'v2_courseDataAnalysis/changeEndDate', endDate: date })
  }

  // 更换三率
  handleRateOnChange = (checkedValues) => {
    this.props.dispatch({ type: 'v2_courseDataAnalysis/changeRate', rate: checkedValues })
  }

  // 翻页事件
  handleOnChangePageNumber = (current) => {
    this.props.dispatch({ type: 'v2_courseDataAnalysis/changePageNumber', pageNumber: current })
  }

  // 导出表单数据
  exportRank = () => {
    let params = `startDate=${this.props.startDate}
    &endDate=${this.props.endDate}`
    if (this.props.fstOrgId) {
      params = `${params}&departmentId=${this.props.fstOrgId}`
    }
    const to = `${apiPrefix}/courses/export?${params}`
    window.open(to)
  }
  // 删除课堂数据
  deleteCourseData = () => {
    this.setState({
      deleteConfirmLoading: true,
    })
    this.props.dispatch({
      type: 'v2_courseDataAnalysis/deleteCourseData',
      id: this.state.idDeleted,
      deleteSuccess: () => {
        this.setState({
          deleteConfirmLoading: false,
          showDeleteModal: false,
          idDeleted: null,
        })
        message.success('删除成功!')
      },
      deleteFailed: () => {
        this.setState({
          deleteConfirmLoading: false,
        })
        message.error('删除失败!')
      }
    })
  }

  // 取消删除课堂数据
  cancelDeleteCourseData = () => {
    this.setState({
      showDeleteModal: false,
      deleteConfirmLoading: false,
      idDeleted: null,
    })
  }

  pushColumns = (columns, rate) => {
    if (rate.indexOf('attendanceRate') > -1) {
      columns.splice(columns.length - 2, 0,
        {
          title: '出勤率',
          className: `${styles.numTextAlign}`,
          render: (text, record) => {
            const avgStudents = !_.isEmpty(record.chartData) ? record.chartData.avgStudents : 0
            const studentCount = record.studentCount
            let attendanceRate = studentCount === 0 ? 0 : parseInt(((avgStudents / studentCount) * 10000) / 100, 10)
            attendanceRate = attendanceRate > 100 ? 100 : attendanceRate
            return `${attendanceRate}%`
          }
        }
      )
    }
    if (rate.indexOf('lookupRate') > -1) {
      columns.splice(columns.length - 2, 0,
        {
          title: '抬头率',
          render: (text, record) => (
            <div>
              {
                record.chartData &&
                  <SmallAttentionChart
                    chart={record.chartData}
                    color={[]}
                    chartId={`samll-${record.id}-lookUp`}
                    style={{ width: 240, height: 60 }}
                    type="lookUp"
                    isShowAverageLine
                  />
              }
            </div>
          )
        }
      )
    }
    if (rate.indexOf('nodRate') > -1) {
      columns.splice(columns.length - 2, 0,
        {
          title: '点头数',
          render: (text, record) => (
            <div>
              {
                record.chartData &&
                  <SmallBarChart
                    chart={record.chartData}
                    chartId={`samll-${record.id}-nod`}
                    style={{ width: 240, height: 60 }}
                    isShowAverageLine
                  />
              }
            </div>
          )
        }
      )
    }
    return columns
  }

  render() {
    const {
      showDeleteModal,
      deleteConfirmLoading,
    } = this.state
    const {
      loading, tableDate, teacherId, teacherList, rate,
      teacherCourseList, courseId, totalDataNum, pageNum, pageSize,
      currentPeriod,
      accountRoleRules,
      location: {
        pathname
      }
    } = this.props
    const selectCollege = {
      collegeOrgId: this.props.collegeOrgId,
      universityData: this.props.collegeInfo,
      currentCollegeId: this.props.fstOrgId,
      fstOrgId: this.props.fstOrgId,
      secOrgId: this.props.secOrgId,
      handleCollegeChange: this.handleCollegeChange,
      handleProfessionChange: this.handleProfessionChange,
      userDepartmentId: this.props.userDepartmentId,
      // style: { color: 'rgba(0, 0, 0, 0.65)' },
      isTeacher: true,
    }
    const DatePickerDate = {
      defaultStartDate: this.props.startDate,
      defaultEndDate: this.props.endDate,
      handelStartChange: this.startChange,
      handelEndChange: this.endChange,
      style: { color: '#333' }
    }
    const plainOptions = [
      { label: '出勤率', value: 'attendanceRate' },
      { label: '抬头率', value: 'lookupRate' },
      { label: '点头数', value: 'nodRate' },
    ]
    let columns = [
      {
        title: '课堂名称',
        dataIndex: 'courseName',
        key: 'courseName',
        className: `${styles.textAlign}`,
        render: (text, record) => (
          <a onClick={() => this.props.dispatch(push(`/v2-history-data-query/detailed?id=${record.monitorId}&from=${pathname}`))}>
            {record.courseName}
          </a>
        )
      },
      {
        title: '课堂编号',
        dataIndex: 'courseCode',
        key: 'courseCode',
        className: `${styles.numTextAlign}`,
      },
      {
        title: '教师名称',
        dataIndex: 'teacherName',
        key: 'teacherName',
        className: `${styles.textAlign}`,
      },
      {
        title: '院系',
        dataIndex: 'departmentName',
        key: 'departmentName',
        className: `${styles.textAlign}`,
      },
      {
        title: '课堂人数',
        dataIndex: 'studentCount',
        key: 'studentCount',
        className: `${styles.numTextAlign}`,
      },
      {
        title: '时间段',
        dataIndex: 'time',
        key: 'time',
        className: `${styles.textAlign}`,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Button
            style={{
              color: 'red',
            }}
            icon="delete"
            onClick={() => {
              // const to = `${apiPrefix}/courseMonitors/coursesRate/list/${record.monitorId}/export`
              // window.open(to)
              this.setState({
                showDeleteModal: true,
                idDeleted: record.id
              })
            }}
            disabled={!accountRoleRules.del}
          >
            删除
          </Button>
        )
      },
    ]
    columns = this.pushColumns(columns, rate)
    const bordered = true
    return (
      <div className={styles.courseDataAnalysisPage}>
        {/* <Button
            onClick={() => {
              this.props.history.push('/')
            }}
          >返回主菜单</Button> */}
        <div className={styles.pageTop}>
          {/* <SelectCollege {...selectCollege} /> */}
          <div className={styles.pageTitle}>课堂数据分析</div>
          <Button onClick={()=>this.props.history.push(`/v2-time-board`)} style={{position: 'absolute', right: '2vw', top: '1vh'}}>直播</Button>
          <Button onClick={()=>this.props.history.push(`/v2-classroom-history-data-query`)} style={{position: 'absolute', right: '8vw', top: '1vh'}}>所有教室</Button>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.topWrapper}>
            {/* <div className={styles.queryConditions}>
              <div className={styles.word}>教师：</div>
              <div className={styles.selectBox}>
                <Select
                  value={teacherId}
                  style={{
                    minWidth: '150px',
                    marginTop: '8px',
                    marginRight: '20px',
                    height: 34,
                    color: 'rgba(0, 0, 0, 0.65)',
                    fontSize: '14px',
                  }}
                  onChange={this.handleChangeTeacherId}
                >
                  <Option value={null}>请选择教师</Option>
                  {
                    _.map(teacherList, (item) => (<Option value={item.id}>{item.name}</Option>))
                  }
                </Select>
                <Select
                  value={courseId}
                  style={{
                    minWidth: '180px',
                    marginTop: '8px',
                    marginRight: '20px',
                    height: 34,
                    color: 'rgba(0, 0, 0, 0.65)',
                    fontSize: '14px',
                  }}
                  onChange={this.handleChangeCourseId}
                >
                  <Option value={null}>请选择课堂</Option>
                  {
                    _.map(teacherCourseList, (item) =>
                      (<Option value={item.id}>{item.name}</Option>))
                  }
                </Select>
              </div>
            </div> */}
            {/* <div className={[`${styles.pickerWrapper} ${styles.queryConditions}`]}>
              <div className={styles.word}>时间：</div>
              <div className={styles.timeBox}>
                <RadioGroup
                  buttonStyle="solid"
                  value={currentPeriod}
                  onChange={(e) => this.handelRadioGroupChange(e.target.value)}
                >
                  <RadioButton value={0}>当天</RadioButton>
                  <RadioButton value={7}>一周</RadioButton>
                  <RadioButton value={30}>一月</RadioButton>
                  <RadioButton value={-1}>指定时间段</RadioButton>
                </RadioGroup>
                {
                  currentPeriod === -1 && <DatePickerPlugin {...DatePickerDate} />
                }
              </div>
            </div> */}
            <div className={styles.queryConditions}>
              <div className={styles.word}>内容：</div>
              <CheckboxGroup
                options={plainOptions}
                value={rate}
                onChange={this.handleRateOnChange}
              />
            </div>
          </div>
          { loading && <MyLoading />}
          {
            !loading &&
              <div className={styles.contentTable}>
                <Table
                  bordered={bordered}
                  rowKey={record => record.id}
                  columns={columns}
                  loading={loading}
                  dataSource={tableDate}
                  pagination={false}
                  className={styles.table}
                />
                {
                  totalDataNum > 0 &&
                    <MyPagination
                      totalCount={totalDataNum}
                      pageNum={pageNum}
                      pageSize={pageSize}
                      onChangePageNumber={this.handleOnChangePageNumber}
                    />
                }
              </div>
          }
        </div>
        <Modal
          title="删除"
          visible={showDeleteModal}
          onOk={this.deleteCourseData}
          onCancel={this.cancelDeleteCourseData}
          width={400}
          bodyStyle={{
            height: '120px'
          }}
          confirmLoading={deleteConfirmLoading}
        >
          您确定删除吗？
        </Modal>
      </div>
    )
  }
}

courseDataAnalysis.propTypes = {
  tableDate: PropTypes.array,
  totalDataNum: PropTypes.number,
  loading: PropTypes.bool,
  collegeOrgId: PropTypes.number,
  fstOrgId: PropTypes.number,
  secOrgId: PropTypes.number,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  pageNum: PropTypes.number,
  pageSize: PropTypes.number,
  dispatch: PropTypes.func,
  location: PropTypes.object,
  collegeInfo: PropTypes.object,
  userDepartmentId: PropTypes.number,
  teacherId: PropTypes.string,
  rate: PropTypes.array,
  teacherList: PropTypes.array,
  teacherCourseList: PropTypes.array,
  courseId: PropTypes.string,
  currentPeriod: PropTypes.number,
  accountRoleRules: PropTypes.object, // 权限
}

export default connect(selectors)(courseDataAnalysis)
