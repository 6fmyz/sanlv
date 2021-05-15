import React from 'react'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { connect } from 'dva'
import selectors from './selectors'
import styles from './index.less'
import { Button, Spin, Modal, message } from 'antd'
import { AttentionChart, DistributedChart } from '../../../components/Chart'
import RectangleInImg from '../../../components/RectangleInImg'
import { isEmpty } from 'lodash'
import queryString from 'query-string'
import { emptyData } from '../../../utils/index'
const config = require('../../../config')
const { apiPrefix } = config

let _this
class classroomHistoryDetailed extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isShowDeleteDialog: false,
      isDeleteLoading: false,
    }
  }

  componentWillMount() {
    this.queryBoxDetail()
  }

  componentWillReceiveProps(nextProps) {
  }

  currId = () => parseInt(this.props.match.params.cId, 10)

  queryBoxDetail() {
    this.props.dispatch({
      type: 'v2_classroomHistoryDetailed/queryBoxDetail',
      scheduleId: this.currId(),
    })
  }

  handleChangeActiveImgUrl = (markInfo) => {
    _this.props.dispatch({ type: 'v2_classroomHistoryDetailed/changeActiveMarkInfo', info: markInfo })
  }

  goBackBtn = () => {
    const {
      location: {
        search
      }
    } = this.props
    const from = queryString.parse(search).from
    let goBackUrl = '/v2-classroom-history-data-query'
    if (from) {
      goBackUrl = from
    }
    this.props.dispatch(push(`${goBackUrl}`))
  }

  // 跳转到课堂历史数据详情总览页面
  goCourseHistoryDetailBox = () => {
    const {
      courseId,
      location: {
        pathname,
        search
      }
    } = this.props
    const searchParams = queryString.parse(search)
    let goUrl = `/v2-history-data-query/detailedBox?id=${courseId}&from=${pathname}`
    if (searchParams.from) {
      goUrl = `/v2-history-data-query/detailedBox?id=${courseId}&from=${pathname}?from=${searchParams.from}`
    }
    this.props.dispatch(push(`${goUrl}`))
  }

  // 导出详情
  handleExportDetail = () => {
    window.open(`${apiPrefix}/courseMonitors/${this.currId()}/detail/export`)
  }

  handleChangeActiveTime = (time, isTag) => {
    this.props.dispatch({
      type: 'v2_classroomHistoryDetailed/changeActiveTime',
      time,
      isTag,
    })
  }

    // 删除
    handleDelete = () => {
      this.setState({
        isDeleteLoading: true,
      })
      const id = this.currId()
      this.props.dispatch({
        type: 'v2_classroomHistoryDetailed/deleteDetail',
        id,
        deleteSuccess: () => {
          this.setState({
            isShowDeleteDialog: false,
            isDeleteLoading: false,
          })
          message.success('删除成功!')
          this.goBackBtn()
        },
        deleteFailed: () => {
          message.error('删除失败!')
          this.setState({
            isDeleteLoading: false,
          })
        },
      })
    }

    // 取消删除
    handleCancel = () => {
      this.setState({
        isShowDeleteDialog: false
      })
    }

  render() {
    _this = this
    const isMark = true
    const { teacherName, className, semester, date, activeMarkInfo, dataSource, classroomMsg: {
      campusName,
      buildingName,
      classroomName
    } } = this.props
    return (
      <div className={styles.historyDataDetailedMain}>
        <div className={styles.pageTitle}>
          <Button icon="left-circle" onClick={this.goBackBtn} />
          <div>
            {teacherName}
            <a onClick={this.goCourseHistoryDetailBox}>{className}</a>
            数据详情

          </div>
          <Button
            onClick={() => {
              this.setState({
                isShowDeleteDialog: true,
              })
            }}
          >删除</Button>
          <Button onClick={this.handleExportDetail}>导出</Button>
        </div>
        {this.props.loading && <div className={styles.loadingWrapper}><Spin /></div>}
        {
          !isEmpty(dataSource) &&
            <div className={styles.detailedWrapper}>
              <div className={styles.leftTab} style={{ width: '65%', position: 'relative' }}>
              {
                  (activeMarkInfo.rate !== 0 && activeMarkInfo.type !== 1 && activeMarkInfo.unitText !== '%')&&
                    <div className={styles.imgTitle}>
                      <div>
                        出勤人数：
                        {/* <span className={styles.unit}>{activeMarkInfo.unit}</span> */}
                        <span className={styles.num}>{activeMarkInfo.rate}</span>
                        <span className={styles.unitText}>人</span>
                      </div>
                    </div>
                }
                <span>
                  {/* {`${campusName} - ${buildingName} - ${classroomName}`} */}
                  {`${classroomName}`}
                </span>
                {
                  !isEmpty(activeMarkInfo) ?
                    <div style={{ width: '100%' }}>
                      {/* <img src={activeMarkInfo.activeImgUrl} alt="" /> */}
                      <RectangleInImg
                        url={activeMarkInfo.activeImgUrl}
                        rectArr={JSON.parse(activeMarkInfo.bbox || '[]')}
                        imgMode={2}
                      />
                    </div>
                  : emptyData()
                }
              </div>
              <div className={styles.rightChart} style={{ width: 'calc(35% - 20px)' }}>
                {
                  // <div className={styles.numberWrapper}>
                  //   出勤人数：
                  //   <span className={styles.num}>{dataSource.students}</span>
                  // </div>
                }
                <div>
                  {
                    dataSource.chartData ?
                      <AttentionChart
                        style={{ width: 'calc(100%)', height: 220 }}
                        dataSource={dataSource.chartData}
                        isMark={isMark}
                        onClickFun={this.handleChangeActiveImgUrl}
                        styles={styles}
                        // activeMarkId={activeMarkInfo.id}
                        activeTime={activeMarkInfo.date}
                        handleChangeActiveTime={this.handleChangeActiveTime}
                      />
                    : emptyData()
                  }
                </div>
                <div className={styles.chartWrapper}>
                  {
                    dataSource.distributedChartData ?
                      <DistributedChart
                        style={isEmpty(dataSource.chartData.lookUpMark) ? { width: 'calc(100%)', height: 350 } : { width: 'calc(100%)', height: 300 }}
                        dataSource={dataSource.distributedChartData}
                      />
                    : emptyData()
                  }
                </div>
              </div>
            </div>
        }
        <Modal
          title="删除"
          visible={this.state.isShowDeleteDialog}
          onOk={this.handleDelete}
          onCancel={this.handleCancel}
          bodyStyle={{height: '110px'}}
          width={400}
          confirmLoading={this.state.isDeleteLoading}
        >
          确定删除吗？
        </Modal>
      </div>
    )
  }
}

classroomHistoryDetailed.propTypes = {
  activeMarkInfo: PropTypes.object,
  dispatch: PropTypes.func,
  teacherName: PropTypes.string,
  className: PropTypes.string,
  courseId: PropTypes.string,
  semester: PropTypes.string,
  date: PropTypes.string,
  studentsNum: PropTypes.string,
  dataSource: PropTypes.object,
  scheduleId: PropTypes.number,
  location: PropTypes.object,
  loading: PropTypes.bool,
  classroomMsg: PropTypes.object,
  match: PropTypes.object,
}

export default connect(selectors)(classroomHistoryDetailed)
