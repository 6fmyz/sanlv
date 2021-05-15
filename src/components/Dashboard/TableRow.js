import React from 'react'
import PropTypes from 'prop-types'
import QueueAnim from 'rc-queue-anim'
import styles from './TableRow.less'
import _ from 'lodash'
import upIcon from './images/icon-up.png'
import downIcon from './images/icon-down.png'
const cssStyle = {
  topRank: {
    color: '#e64d47',
  },
}

const TableRow = ({ data, tableType, goInfo }) => {
  const type = tableType

  const getRowRankColor = (rank) => {
    let rowRankColor = {}
    if (rank <= 3) {
      rowRankColor = cssStyle.topRank
    }
    return rowRankColor
  }

  const getRow = () =>
    _.map(data, (rowInfo, key) => (
      <div
        style={tableType === 2 ? { cursor: 'pointer' } : {}}
        key={key}
        className={styles.rowWrapper}
        onClick={() => {
          if (tableType !== 2) {
            return
          }
          goInfo(tableType, rowInfo)
        }}
      >
        <div
          style={getRowRankColor(rowInfo.orderNum)}
          className={styles.rank}
        >
          {rowInfo.orderNum}
        </div>
        <div className={styles.name}>
          {
            type === 0 &&
              <span>{rowInfo.orgName}</span>
          }
          {
            type === 1 &&
              <span>{rowInfo.orgName}</span>
          }
          {
            type === 2 &&
              <span>
                <span>{rowInfo.courseName}</span>
                <span className={styles.teacherName}>{rowInfo.teacherName}</span>
              </span>
          }
          {
            type === 3 &&
              <span>{rowInfo.courseName}</span>
          }
          {
            type === 4 &&
              <span>
                <span>{rowInfo.teacherName}</span>
                <span>({rowInfo.orgName})</span>
              </span>
          }
          {
            type === 5 &&
              <span>{rowInfo.orgName}</span>
          }
        </div>
        <div className={styles.numWrapper}>
          <div className={styles.num}>
            {
              type === 0 &&
                <span>{Number(rowInfo.actRate)}%</span>
            }
            {
              type === 1 &&
                <span>{Number(rowInfo.actDegree)}</span>
            }
            {
              type === 2 &&
                <span>{Number(rowInfo.actCount)}</span>
            }
            {
              type === 3 &&
                <span>{Number(rowInfo.signRate)}%</span>
            }
            {
              type === 4 &&
                <span>{Number(rowInfo.actCount)}</span>
            }
            {
              type === 5 &&
                <span>{Number(rowInfo.signRate)}%</span>
            }
          </div>
          <div className={styles.upWrapper}>
            {
              rowInfo.trend === 1 &&
                <img alt="" src={downIcon} />
            }
            {
              rowInfo.trend === 0 &&
                <img alt="" src={upIcon} />
            }
          </div>
        </div>
      </div>
    ))

  return (
    <QueueAnim
      component="div"
      animConfig={[
        { opacity: [1, 0], translateY: [0, 30] },
        { height: 0 },
      ]}
      ease={['easeOutQuart', 'easeInOutQuart']}
      duration={[550, 450]}
      interval={150}
    >
      {getRow()}
    </QueueAnim>
  )
}

TableRow.propTypes = {
  data: PropTypes.array,
  tableType: PropTypes.number,
  goInfo: PropTypes.func,
}

export default TableRow
