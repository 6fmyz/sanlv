import React from 'react'
import PropTypes from 'prop-types'
import selectors from './selectors'
import { connect } from 'dva'
import queryString from 'query-string'
import {
  Button,
  Table,
  Modal,
  message,
} from 'antd'
import styles from './index.less'
import {
  push
} from 'react-router-redux'
import { MyPagination, MyLoading } from '../../../components/MyPlugin'
import {
  SmallAttentionChart,
  SmallBarChart,
} from '../../../components/Chart'

class ClassroomHistoryClassroomDetail extends React.Component {
  state = {
    showDeleteModal: false,
    idDeleted: null,
    deleteConfirmLoading: false,
  }
  componentWillMount() {
    const {
      location: {
        search
      },
      page,
    } = this.props
    const classroomId = queryString.parse(search).classroomId
    this.props.dispatch({type: 'v2_classroomHistoryClassroomDetail/queryClassroomCourseDetail', classroomId, page})
  }

  handleChangePageNumber = (value) => {
    this.props.dispatch({ type: 'v2_classroomHistoryClassroomDetail/changePageNumber', page: value })
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        search
      },
    } = this.props
    const classroomId = queryString.parse(search).classroomId
    if (this.props.page !== prevProps.page) {
      this.props.dispatch({type: 'v2_classroomHistoryClassroomDetail/queryClassroomCourseDetail', classroomId, page: this.props.page })
    }
  }

  componentWillUnmount() {
    if (!this.goClassroomDetail) {
      this.props.dispatch({ type: 'v2_classroomHistoryClassroomDetail/changePageNumber', page: 1 })
    }
  }

  deleteClassroomHistoryData = () => {
    this.setState({
      deleteConfirmLoading: true,
    })
    this.props.dispatch({
      type: 'v2_classroomHistoryClassroomDetail/deleteClassroomHistoryData',
      id: this.state.idDeleted,
      deleteSuccess: () => {
        this.setState({
          showDeleteModal: false,
          idDeleted: null,
          deleteConfirmLoading: false,
        })
        message.success('删除成功!')
      },
      deleteFailed: () => {
        message.error('删除失败!')
        this.setState({
          deleteConfirmLoading: false,
        })
      }
    })

  }

  cancelDeleteClassroomHistoryData = () => {
    this.setState({
      showDeleteModal: false,
      idDeleted: null,
      deleteConfirmLoading: false,
    })
  }

  render() {
    const {
      dataSource,
      location: {
        pathname,
        search,
      },
      totalNum,
      page,
      pageSize,
      loading,
      accountRoleRules,
      classroom:{
        campus,
        classroomBuilding,
        classroom,
      },
    } = this.props
    const {
      showDeleteModal,
      deleteConfirmLoading,
    } = this.state
    const columns = [
      // { title: '校区', dataIndex: 'campus', key: 'campus', className: `${styles.textAlign}` },
      // { title: '教学楼', dataIndex: 'classroomBuilding', key: 'classroomBuilding', className: `${styles.textAlign}` },
      // { title: '教室', dataIndex: 'classroomname', key: 'classroomname', className: `${styles.textAlign}` },
      {
        title: '教师',
        dataIndex: 'teacherName',
        key: 'teacherName',
        className: `${styles.textAlign}`,
        render: (text, record) => {
          return `${record.teacherName ? record.teacherName : ''}${record.employeeNumber ? `(${record.employeeNumber})` : ''}`
          // (
          //   <button
          //     style={{
          //       color: '#0e8ee9',
          //       border: 'none',
          //       background: 'none',
          //       outline: 'none',
          //       // cursor: 'pointer',
          //       padding: 0,
          //     }}
          //     // onClick={() => {
          //     //   this.goClassroomDetail = true
          //     //   this.props.dispatch(push(`/v2-history-data-query?teacherId=${record.teacherName}`))
          //     // }}
          //   >{`${record.teacherName ? record.teacherName : ''}${record.employeeNumber ? `(${record.employeeNumber})` : ''}`}</button>
          // )
        }
      },
      {
        title: '课程名称',
        dataIndex: 'courseName',
        key: 'courseName',
        className: `${styles.textAlign}`,
        render: (text, record) => {
          return (
            <button
              style={{
                color: '#0e8ee9',
                border: 'none',
                background: 'none',
                outline: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              onClick={() => {
                this.goClassroomDetail = true
                this.props.dispatch(push(`/v2-history-data-query/detailedBox?id=${record.courseId}&from=${pathname}${search}`))
              }}
            >{text || ''}</button>
          )
        }
      },
      {
        title: "出勤人数",
        render: (text, record) => {
          return text.attendanceCount || ''
        }
      },
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
      },
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
      },
      {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '操作',
        className: `${styles.setWidth}`,
        dataIndex: '',
        key: 'x',
        render: (text, record) => {
          const page = (
            <div>
              <button
                style={{
                  color: 'white',
                  border: 'none',
                  backgroundColor: '#409eff',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  width: '50px',
                  height: '30px',
                  
                }}
                onClick={() => {
                  // this.props.dispatch({ type: 'v2_classroomHistoryDataQuery/setTitleInfo', data: { ...record, type: 2 } })
                  this.goClassroomDetail = true
                  this.props.dispatch(push(`/v2-classroom-history-data-query/detailed/${record.id}?from=${pathname}${search}`))
                }}
              >
                详情
              </button>
              <button
                style={{
                  color: 'white',
                  border: 'none',
                  backgroundColor: '#ff5757',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  marginLeft: '10px',
                  width: '50px',
                  height: '30px',
                }}
                disabled={!accountRoleRules.del}
                onClick={() => {
                  this.setState({
                    showDeleteModal: true,
                    idDeleted: record.id,
                  })
                }}
              >
                删除
              </button>
            </div>
          )
          return page
        }
      },
    ]
    const isShowClassMsg = campus && classroomBuilding && classroom
    return (
      <div>
        <div className={styles.top}>
          {/* <Button
            onClick={() => {
              this.props.dispatch(push(`/v2-classroom-history-data-query?from=${pathname}${search}`))
            }}
          >返回</Button> */}
           <Button icon="left-circle" onClick={()=>this.props.history.push(`/v2-classroom-history-data-query`)} />
          {/* <div className={styles.title}>{`${isShowClassMsg ? `(${campus}-${classroomBuilding}-${classroom})` : ''}教室历史课程数据查询`}</div> */}
          <div className={styles.title}>{`${isShowClassMsg ? `(${classroom})` : ''}教室历史课程数据查询`}</div>
        </div>
        <div className={styles.classroomDetailWrapper}>

          <Table className={styles.table} dataSource={dataSource} bordered={true} columns={columns} pagination={false} loading={loading}/>
          {
            this.props.totalNum > 0 &&
              <MyPagination
                totalCount={totalNum}
                pageNum={page}
                pageSize={pageSize}
                onChangePageNumber={this.handleChangePageNumber}
              />
          }
        </div>
        <Modal
          title="删除"
          visible={showDeleteModal}
          onOk={this.deleteClassroomHistoryData}
          onCancel={this.cancelDeleteClassroomHistoryData}
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

ClassroomHistoryClassroomDetail.propTypes = {
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
  location: PropTypes.object,
  dataSource: PropTypes.array,
  totalNum: PropTypes.number,
  accountRoleRules: PropTypes.object,
  classroom: PropTypes.object,
}


export default connect(selectors)(ClassroomHistoryClassroomDetail)