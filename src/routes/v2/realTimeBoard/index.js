import React from 'react'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { connect } from 'dva'
import selectors from './selectors'
import styles from './index.less'
import { HomeAttentionChart } from '../../../components/Chart'
import RectangleInImg from '../../../components/RectangleInImg'
import CircleSmall from '../teachingResourceAnalysis/Circle'
import { Input, message, Select, Spin, Icon, Button } from 'antd'
import { isEmpty } from 'lodash'
import queryString from 'query-string'
import classnames from 'classnames'

let socket
let _this
let lockReconnect = true
const time = 3000

class realTimeBoard extends React.Component {
  componentWillMount() {
    this.queryParams = this.getQueryParams()
    this.props.dispatch({ type: 'v2_realTimeBoard/queryCampus', campusId: this.queryParams.campusId})
  }

  componentWillReceiveProps(nextProps) {
    _this = this
    // 更新webScoket地址，创建连接
    if (this.props.webSocketLinkUrl !== nextProps.webSocketLinkUrl && nextProps.webSocketLinkUrl) {
      if ('WebSocket' in window) {
        try {
          if (socket && nextProps.webSocketIsLink) {
            this.closeWebScoket(nextProps, true)
          } else {
            this.createWebSocket(nextProps)
          }
        } catch (err) {
          _this.props.dispatch({ type: 'v2_realTimeBoard/setWebSocketIsLinkStatus', status: false })
          _this.reconnect()
          message.error(err)
        }
      }
      this.getWebScoketStatus()
    }
    // webScoket地址请求报错
    if (this.props.errorMsg !== nextProps.errorMsg && nextProps.errorMsg) {
      this.closeWebScoket(nextProps, true)
      message.error(nextProps.errorMsg)
    }
    // 更换校区
    if (this.props.campusId !== nextProps.campusId && nextProps.campusId) {
      this.props.dispatch({
        type: 'v2_realTimeBoard/queryTeachingBuilding',
        params: { campusId: nextProps.campusId, classroomBuildingId: this.queryParams.classroomBuildingId }
      })
    }
    // 更换教学楼
    if (this.props.classroomBuildingId !== nextProps.classroomBuildingId
    && nextProps.classroomBuildingId) {
      this.props.dispatch({
        type: 'v2_realTimeBoard/queryClassroom',
        params: { classroomBuildingId: nextProps.classroomBuildingId, campusId: nextProps.campusId, activeClassroom: this.queryParams.roomId }
      })
    }
    // 更换教室时请求教室的webScoket地址
    if (this.props.activeClassroom !== nextProps.activeClassroom && nextProps.activeClassroom) {
      this.props.dispatch({
        type: 'v2_realTimeBoard/queryBoardData',
        param: {
          classroom: nextProps.activeClassroom,
          prevClassroom: this.props.activeClassroom,
          webSocketIsLink: nextProps.webSocketIsLink,
        }
      })
    }
    if (this.props.activeClassroom !== nextProps.activeClassroom && !nextProps.activeClassroom) {
      this.props.dispatch({
        type: 'v2_realTimeBoard/queryClassroom',
        params: { classroomBuildingId: nextProps.classroomBuildingId, campusId: nextProps.campusId }
      })
      if ('WebSocket' in window) {
        _this.props.dispatch({ type: 'v2_realTimeBoard/webSocketLinkClose' })
        this.closeWebScoket(this.props, false)
      }
    }
  }

  componentWillUnmount() {
    if ('WebSocket' in window) {
      _this.props.dispatch({ type: 'v2_realTimeBoard/webSocketLinkClose' })
      this.closeWebScoket(this.props, false)
    }
    this.props.dispatch({ type: 'v2_realTimeBoard/changeCampus', id: null })
    this.props.dispatch({ type: 'v2_realTimeBoard/changeClassroomBuilding', id: null })
    this.props.dispatch({ type: 'v2_realTimeBoard/changeClassroom', classroom: null })
  }

  getWebScoketStatus() {
    socket.onopen = () => {
      _this.props.dispatch({ type: 'v2_realTimeBoard/setWebSocketIsLinkStatus', status: true })
      _this.heartCheck()
    }
    socket.onmessage = (e) => {
      _this.props.dispatch({ type: 'v2_realTimeBoard/setWebSocketIsLinkStatus', status: true })
      const data = JSON.parse(e.data)
      if (data.type === 'lookUp') {
        _this.props.dispatch({ type: 'v2_realTimeBoard/webSocketLinkLookUpSuccess', data: e.data })
      } else if (data.type === 'nod') {
        _this.props.dispatch({ type: 'v2_realTimeBoard/webSocketLinkNodSuccess', data: e.data })
      }
      _this.heartCheck()
    }
    // 链接关闭
    socket.onclose = (e) => {
      _this.props.dispatch({ type: 'v2_realTimeBoard/setWebSocketIsLinkStatus', status: false })
      if (_this.props.webSocketLinkUrl && lockReconnect) {
        _this.reconnect()
      }
    }
    // 链接错误
    socket.onerror = (e) => {
      _this.props.dispatch({ type: 'v2_realTimeBoard/setWebSocketIsLinkStatus', status: false })
      _this.reconnect()
    }
  }

  getQueryParams = () => {
    const {
      location: {
        search
      }
    } = this.props
    const queryParams = queryString.parse(search)
    if (queryParams && queryParams.campusId) {
      return queryParams      
    }
    return {}
  }

  createWebSocket(props) {
    lockReconnect = true
    socket = new WebSocket(props.webSocketLinkUrl)
  }

  closeWebScoket(props, lockReconnectStatus) {
    if (socket && props.webSocketIsLink) {
      lockReconnect = lockReconnectStatus
      socket.close()
    }
  }

  // 重连
  reconnect() {
    // TODO 教室不在线时，取消重连机制
    if (this.props.webSocketIsLink) {
      return
    }
    // 设置延迟避免请求过多
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      _this.createWebSocket(_this.props, true)
      _this.getWebScoketStatus()
    }, time)
  }

  // 心跳检测
  heartCheck() {
    this.timeout && clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      // onmessage拿到返回的心跳就说明连接正常
      socket && socket.send('链接中...')
    }, time)
  }
  // 选择校区
  handleChangeCampus = (value) => {
    if (value) {
      this.props.dispatch({ type: 'v2_realTimeBoard/changeCampus', id: !value ? null : parseInt(value, 10) })
      this.props.dispatch({ type: 'v2_realTimeBoard/changeClassroomBuilding', id: null })
      this.props.dispatch({ type: 'v2_realTimeBoard/changeClassroom', classroom: null })
    }
  }
  // 更换教学楼
  handleChangeClassroomBuilding = (value) => {
    if (value) {
      this.props.dispatch({ type: 'v2_realTimeBoard/changeClassroomBuilding', id: value })
      this.props.dispatch({ type: 'v2_realTimeBoard/changeClassroom', classroom: null })
    }
  }
  // 更换课堂
  handleChangeClassroom = (value) => {
    if (value) {
      this.props.dispatch({ type: 'v2_realTimeBoard/changeClassroom', classroom: value })
    }
  }

  // 空数据展示
  emptyData() {
    let element = (
      <div className={styles.dataEmpty}><Icon type="inbox" />暂无数据</div>
    )
    if (this.props.errorMsg.indexOf('课间休息') > -1) {
      element = (<div className={styles.dataRest}>{this.props.errorMsg}</div>)
    }
    return element
  }

  showClassroomSanlvDetail = (classroom) => {
    if (classroom.status) {
      this.props.dispatch({ type: 'v2_realTimeBoard/changeClassroom', classroom: classroom.id })
    }
  }

  // 渲染教室页面
  renderClassRoomList = () => {
    const {
      campusId,
      classroomBuildingId,
      campus,
      classroomBuilding,
      classroomData,
    } = this.props
    let currentCampusName
    let currentClassroomBuilding
    campus.some(camp => {
      if (camp.id === campusId) {
        currentCampusName = camp.name
      }
    })
    classroomBuilding.some(building => {
      if (building.id === classroomBuildingId) {
        currentClassroomBuilding = building.name
      }
    })
    return (
      <div 
        className={styles.classroomListWrapper}
      >
        {
          classroomData && classroomData.length && classroomData.map(item => {
            return (
              <div 
                key={item.id} 
                className={styles.classroomItem} 
                style={{ 
                  background: `${item.status ? 'rgb(24, 152, 88)' : 'rgb(193, 45, 50)'}`,
                  cursor: `${item.status ? 'pointer' : 'default'}`
                }}
                onClick={() => this.showClassroomSanlvDetail(item)}
              >
                <p>
                  {`${item.status ? '三率监测中' : '教室不在线'}`}
                </p>
                <div>
                  {`${currentCampusName}-${currentClassroomBuilding}-${item.name}`}
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }

  // 渲染活跃教室的三率数据
  renderActiveClassroomSanlvData = () => {
    const {
      studentNum, currentNod, currentLookUp, nod, lookUp, date, loading,
      activeClassroom, classroomData, base64Url, campus, campusId, classroomBuilding,
      classroomBuildingId, nodNum, bbox,
      courseBasicMsg: {
        course,
        teacher,
        department,
        avatar,
      },
    } = this.props
    const data = {
      nod: nod,
      lookUp: lookUp,
      date: date,
      nodNum: nodNum,
    }
    let campusName
    let classroomBuildingName
    let activeClassroomName
    campus.some(campusItem => {
      if (campusItem.id === campusId) {
        campusName = campusItem.name
        return true
      }
    })
    classroomBuilding.some(item => {
      if (item.id === classroomBuildingId) {
        classroomBuildingName = item.name
        return true
      }
    })
    classroomData.some(item => {
      if (item.id === activeClassroom) {
        activeClassroomName = item.name
        return true
      }
    })
    return (
      <div className={styles.timeBoardWrapper}>
        <div className={styles.pictureWrapper}>
          <div style={{width: '100%'}}>
            {
              base64Url ?
                // <img alt="" src={base64Url} />
                <RectangleInImg url={base64Url} rectArr={bbox || []} imgMode={2}/>
              : this.emptyData()
            }
            {base64Url && course? <div className={styles.courseBasicMsg}>
              <img src={avatar}/>
              <span>{`${department}的 ${teacher}老师 正在上《${course}》`}</span>
              {/* <span>{`${department}`}</span>
              <span>{`${department}`}</span> */}
            </div> : null}
          </div>
        </div>
        <div className={styles.bottomChart}>
          {
            base64Url || !isEmpty(nod) || !isEmpty(lookUp) ?
              <div className={styles.bottomBox}>
                <div className={styles.dataWrapper}>
                  <div className={styles.classInfo}>
                    <div className={styles.title}>
                      {
                        // `${campusName} - ${classroomBuildingName} - ${activeClassroomName}`
                        `${activeClassroomName}`
                      }
                    </div>
                  </div>
                  <div className={styles.boxWrapper}>
                    <div className={styles.box}>
                      <CircleSmall
                        value={100}
                        count={studentNum}
                        unit=""
                        text="出勤人数"
                        bgColor="#333"
                        foreground="#1890ff"
                        maskBgColor="#1D1D1D"
                      />
                    </div>
                    <div className={styles.box}>
                      <CircleSmall
                        value={currentLookUp}
                        count={currentLookUp}
                        unit="%"
                        text="抬头率/秒"
                        bgColor="#333"
                        foreground="red"
                        maskBgColor="#1D1D1D"
                      />
                    </div>
                    {
                      <div className={styles.box}>
                        <CircleSmall
                          value={currentNod}
                          count={currentNod}
                          unit="%"
                          text="抬头率/分"
                          bgColor="#333"
                          foreground="#eab60bf7"
                          maskBgColor="#1D1D1D"
                        />
                      </div>
                    }
                  </div>
                </div>
                <div className={styles.chartWrapper} style={{ width: '100%' }}>
                  <HomeAttentionChart style={{ width: '100%', height: 300 }} dataSource={data} />
                </div>
              </div>
            : this.emptyData()
          }
        </div>
      </div>
    )
  }

  render() {
    const {
      studentNum, currentNod, currentLookUp, nod, lookUp, date, loading,
      activeClassroom, classroomData, base64Url, campus, campusId, classroomBuilding,
      classroomBuildingId, location
    } = this.props

    return (
      <div className={styles.realTimeBoardMain}>
        <div className={styles.pageTitle}>
          <div className={styles.queryWrapper}>
          {activeClassroom && <Button
            style={{
              height: '30px',
              marginRight: '8px',
            }}
            onClick={() => {
              const from = queryString.parse(location.search).from
              if (from) {
                this.props.dispatch(push(from))
              } else {
                this.props.dispatch({ type: 'v2_realTimeBoard/changeClassroom', classroom: null })
              }
            }}
          >
            返回
          </Button>}
            <div className={classnames(styles.queryBox, {
              [styles.hiddenQueryBox]: activeClassroom
            })}>
              <span className={styles.text}>校区：</span>
              <Select
                showSearch
                allowClear
                value={campusId}
                style={{ color: '#e8e8e8' }}
                placeholder="请选择校区"
                optionFilterProp="children"
                onChange={this.handleChangeCampus}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Select.Option value={null}>请选择校区</Select.Option>
                {campus.map(d => <Select.Option value={d.id}>{d.name}</Select.Option>)}
              </Select>
            </div>
            <div className={classnames(styles.queryBox, {
              [styles.hiddenQueryBox]: activeClassroom
            })}>
              <span className={styles.text}>教学楼：</span>
              <Select
                showSearch
                allowClear
                value={classroomBuildingId}
                style={{ color: '#e8e8e8' }}
                placeholder="请选择教学楼"
                optionFilterProp="children"
                onChange={this.handleChangeClassroomBuilding}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Select.Option value={null}>请选择教学楼</Select.Option>
                {classroomBuilding.map(d => <Select.Option value={d.id}>{d.name}</Select.Option>)}
              </Select>
            </div>
            <div className={classnames(styles.queryBox, {
              [styles.hiddenQueryBox]: activeClassroom
            })}>
              <span className={styles.text}>教室：</span>
              <Select
                value={activeClassroom}
                style={{ color: '#e8e8e8', minWidth: '150px' }}
                onChange={this.handleChangeClassroom}
              >
                <Select.Option value={null}>请选择教室</Select.Option>
                {
                  classroomData.map(val => <Select.Option value={val.id}>{val.name}</Select.Option>)
                }
              </Select>
            </div>
          </div>
          <div>实时看板</div>
        </div>
        {loading && <div className={styles.loadingWrapper}><Spin /></div>}
        {
          !activeClassroom && campusId && classroomBuildingId && classroomData && classroomData.length && this.renderClassRoomList()
        }
        {
          activeClassroom && this.renderActiveClassroomSanlvData()
        }

      </div>
    )
  }
}

realTimeBoard.propTypes = {
  dispatch: PropTypes.func,
  location: PropTypes.object,
  activeClassroom: PropTypes.number,
  campus: PropTypes.array,
  campusId: PropTypes.number,
  classroomData: PropTypes.array,
  base64Url: PropTypes.string,
  bbox: PropTypes.array,
  errorMsg: PropTypes.string,
  loading: PropTypes.bool,
  studentNum: PropTypes.number,
  currentNod: PropTypes.number,
  currentLookUp: PropTypes.number,
  nod: PropTypes.array,
  lookUp: PropTypes.array,
  date: PropTypes.array,
  linkError: PropTypes.string,
  webSocketLinkUrl: PropTypes.string,
  webSocketIsLink: PropTypes.bool,
  webSocketLinkError: PropTypes.bool,
  webSocketLinkErrorClose: PropTypes.bool,
  classroomBuilding: PropTypes.array,
  classroomBuildingId: PropTypes.number,
  nodNum: PropTypes.array,
}

export default connect(selectors)(realTimeBoard)
