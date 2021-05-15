import React from 'react'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { connect } from 'dva'
import selectors from './selectors'
import styles from './index.less'
import { Button, Icon } from 'antd'
import { SmallAttentionChart } from '../../../components/Chart'
import { random, randomArray, randomDate, randomNumBothandomNum } from '../../../utils/randomChartData'
import queryString from 'query-string'
import { MyLoading } from '../../../components/MyPlugin'
class historyDataDetailedBox extends React.Component {
  componentDidMount() {
    this.queryBoxList()
    // this.getScreenChange()
    // window.addEventListener('resize', () => this.getScreenChange())
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', () => this.getScreenChange())
  }
  // 窗口变化
  getScreenChange() {
    const bodyw = document.body.clientWidth
    const constenw = 1350 + 48
    const navigation = document.getElementById('navigation')
    const navigationw = navigation.clientWidth
    const box = document.getElementById('boxWrapper')
    if (bodyw < (constenw + navigationw) && box !== null) {
      document.getElementById('boxWrapper').style.height = 'auto'
      document.getElementById('box').style.width = 'auto'
      document.getElementById('box').style.position = 'relative'
      document.getElementById('box').style.right = '0'
      document.getElementById('box').style.margin = '0'
    }
  }

  currId = () => parseInt(queryString.parse(this.props.location.search).id, 10)

  // 查询课程列表数据
  queryBoxList() {
    this.props.dispatch({
      type: 'v2_historyDataDetailedBox/queryBoxList',
      courseId: this.currId() // this.props.courseId,
    })
  }

  attentionData(minNum, maxNum) {
    return {
      students: randomNumBothandomNum(40, 90),
      nod: randomArray(minNum, maxNum),
      lookUp: randomArray(minNum, maxNum),
      date: randomDate(),
    }
  }

  // 选中教师课程时间
  handleItemClick(item) {
    this.props.dispatch({
      type: 'v2_historyDataDetailed/setTeacherInfo',
      info: {
        teacherName: this.props.teacherName,
        className: this.props.className,
        semester: this.props.semester,
        date: item.date,
        studentsNum: item.chartData.students,
        scheduleId: item.id,
      }
    })
    this.props.dispatch({ type: 'v2_historyDataDetailed/changeActiveItem', id: item.id })
    // this.props.dispatch(push('/v2-history-data-query/detailed'))
    this.props.dispatch(push(`/v2-history-data-query/detailed?id=${item.id}`))
  }

  // 返回跳转地址
  goBackBtn = () => {
    const {
      location: {
        search,
        pathname,
      }
    } = this.props
    const from = queryString.parse(search).from
    let goBackUrl = `/v2-history-data-query?back=${pathname}`
    if (from) {
      goBackUrl = from
    }
    this.props.dispatch(push(`${goBackUrl}`))
  }
  render() {
    const { teacherName, className, semester, dataSource, loading } = this.props
    return (
      <div className={styles.historyDataDetailedBoxMain}>
        <div className={styles.pageTitle}>
          <Button icon="left-circle" onClick={this.goBackBtn} />
          {teacherName}老师 {semester} {className}数据总览
        </div>
        <div id="boxWrapper" className={styles.boxWrapper}>
          { loading && <MyLoading />}
          {
            !loading &&
              <div id="box" className={styles.box}>
                {
                  dataSource.map(item => {
                    const page = (
                      <div key={item.id}>
                        <Button onClick={() => this.handleItemClick(item)}>
                          <div className={styles.num}>{item.chartData.students}</div>
                          <div className={styles.smallChartWrapprt}>
                            <SmallAttentionChart
                              chart={item.chartData}
                              color={[]}
                              chartId={`samll${item.id}`}
                              style={{ width: 240, height: 60 }}
                            />
                          </div>
                          <div className={styles.classInfo}>
                            {item.date}
                          </div>
                        </Button>
                        <div className={styles.courseRoomMsg}>{`${item.classroomName}`}</div>
                        {/* <div className={styles.courseRoomMsg}>{`${item.campusName}-${item.buildingName}-${item.classroomName}`}</div> */}
                      </div>

                    )
                    return page
                  })
                }
              </div>
          }
        </div>
      </div>
    )
  }
}

historyDataDetailedBox.propTypes = {
  dispatch: PropTypes.func,
  teacherName: PropTypes.string,
  className: PropTypes.string,
  semester: PropTypes.string,
  dataSource: PropTypes.array,
  courseId: PropTypes.number,
  location: PropTypes.object,
  loading: PropTypes.bool,
}

export default connect(selectors)(historyDataDetailedBox)
