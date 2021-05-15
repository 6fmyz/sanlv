import React from 'react'
import PropTypes from 'prop-types'
import styles from './CollegeTable.less'
import _ from 'lodash'
import { Icon, Button } from 'antd'

const CollegeTable = ({ type, heads, data, goUnSignTable }) => {
  const getTableHead = () =>
    _.map(heads, (head, key) => {
      let style = {}
      if (type === 3) {
        if (key === 0) {
          style = { width: '10%' }
        }
        if (key === 1) {
          style = { width: '35%' }
        }
        if (key === 2) {
          style = { width: '15%' }
        }
        if (key === 3) {
          style = { width: '20%' }
        }
        if (key === 4) {
          style = { width: '10%' }
        }
        if (key === 5) {
          style = { width: '10%' }
        }
      }
      if (type === 4) {
        if (key === 0) {
          style = { width: '10%' }
        }
        if (key === 1) {
          style = { width: '15%' }
        }
        if (key === 2) {
          style = { width: '35%' }
        }
      }
      if (type === 5) {
        if (key === 0) {
          style = { width: '10%' }
        }
        if (key === 1) {
          style = { width: '30%' }
        }
      }
      return (<div style={style} key={key}>{head}</div>)
    })

  const getRow = (val) => {
    let page
    switch (type) {
      // case 0: // 院校教师活跃率
      //   page = (
      //     <div className={styles.row}>
      //       <div>
      //         <div className={styles.rank}>{val.orderNum}</div>
      //       </div>
      //       <div>{val.orgName}</div>
      //       <div>{val.teacherCount}</div>
      //       <div>{val.teacherActCount}</div>
      //       <div>{val.actRate}%</div>
      //     </div>
      //   )
      //   break
      // case 1: // 学生活跃度
      //   page = (
      //     <div className={styles.row}>
      //       <div>
      //         <div className={styles.rank}>{val.orderNum}</div>
      //       </div>
      //       <div>{val.orgName}</div>
      //       <div>{val.actCount}</div>
      //       <div>{val.actDegree}</div>
      //     </div>
      //   )
      //   break
      case 3: // 课堂签到率
        page = (
          <div className={styles.row}>
            <div style={{ width: '10%' }}>
              <div className={styles.rank}>{val.orderNum}</div>
            </div>
            <div style={{ width: '35%' }}>{val.courseName}</div>
            <div style={{ width: '15%' }}>{val.teacherName}</div>
            <div style={{ width: '20%' }}>{val.orgName}</div>
            <div style={{ width: '10%' }} className={styles.numTextAlign}>{Number(val.signRate)}%</div>
            <div style={{ width: '10%', textAlign: 'center' }}>
              <Button
                onClick={() => goUnSignTable(val.courseId)}
                style={{
                  padding: 0,
                  border: 0,
                  textAlign: 'left',
                  color: 'rgb(16, 142, 233)',
                  background: 'none',
                }}
              > 缺勤详情</Button>
            </div>
          </div>
        )
        break
      case 4: // 教师活跃度
        page = (
          <div className={styles.courseInfoRow}>
            <div style={{ width: '10%', justifyContent: 'center' }}>
              <div className={styles.rank}>{val.orderNum}</div>
            </div>
            <div style={{ width: '15%' }}>{val.teacherName}</div>
            <div className={styles.courseInfoCell} style={{ display: 'block', width: '35%' }}>
              {
                _.map(val.courseName, (info, key) => (
                  <div key={`course-info-${key}`} style={{ lineHeight: '47px' }}>
                    {info}
                  </div>
                ))
              }
            </div>
            <div>{val.teacherOrgName}</div>
            <div style={{ display: 'grid', textAlign: 'right' }} >{Number(val.actCount)}</div>
          </div>
        )
        break
      case 5: // 院系签到率
        page = (
          <div className={styles.row}>
            <div style={{ width: '10%' }}>
              <div className={styles.rank}>{val.orderNum}</div>
            </div>
            <div style={{ width: '30%' }}>{val.orgName}</div>
            <div className={styles.numTextAlign}>{Number(val.teacherCount)}</div>
            <div className={styles.numTextAlign}>{Number(val.teacherActCount)}</div>
            <div className={styles.numTextAlign}>{Number(val.signRate)}%</div>
            <div className={styles.numTextAlign}>{Number(val.attendance)}</div>
            <div className={styles.numTextAlign}>{Number(val.vacate)}</div>
            <div className={styles.numTextAlign}>{Number(val.late)}</div>
            <div className={styles.numTextAlign}>{Number(val.absenteeism)}</div>
          </div>
        )
        break
      case 6: // 今日学情历史表
        page = (
          <div className={styles.row}>
            <div>
              <div className={styles.rank}>{val.date}</div>
            </div>
            <div className={styles.numTextAlign}>{Number(val.teacherActCount)}人</div>
            <div className={styles.numTextAlign}>{Number(val.interSum)}人</div>
            <div className={styles.numTextAlign}>{Number(val.avgCourseActDegree)}次</div>
            <div className={styles.numTextAlign}>{Number(val.avgAttendanceRate)}%</div>
            <div className={styles.numTextAlign}>{Number(val.studentActCount)}次</div>
          </div>
        )
        break
      default:
        break
    }
    return page
  }

  const getTableBody = () =>
    _.map(data, (val, key) => {
      let style = {}
      if (type === 4 && val.courseInfo) {
        const len = val.courseInfo.length
        const height = len > 0 ? len * 48 : 48
        style = {
          height: height
        }
      }
      return (
        <button style={style} key={key} id={val.id}>
          {getRow(val)}
        </button>
      )
    })

  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.tableHead}>
          {getTableHead()}
        </div>
        <div className={styles.tableBody}>
          {
            data.length > 0 ?
              getTableBody()
            : <div className={styles.dataEmpty}><Icon type="inbox" />暂无数据</div>
          }
        </div>
      </div>
    </div>

  )
}

CollegeTable.propTypes = {
  type: PropTypes.number,
  heads: PropTypes.array,
  data: PropTypes.array,
  goUnSignTable: PropTypes.func,
}

export default CollegeTable
