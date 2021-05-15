import React from 'react'
import PropTypes from 'prop-types'
import QueueAnim from 'rc-queue-anim'
import TableRow from './TableRow'
import styles from './RankTable.less'
import { Button, Icon } from 'antd'
import _ from 'lodash'
import noSourceIcon from './images/no-source-icon.png'

const RankTable = ({ data, handelGoTableInfo }) => {
  const getRows = (tableRows) =>
    (<TableRow data={tableRows.data} tableType={tableRows.tableType} goInfo={handelGoTableInfo} />)

  const getTables = () =>
    _.map(data, (tableDate, key) => {
      const tableRows = {
        tableType: tableDate.tableType,
        data: tableDate.data,
        imgSrc: tableDate.imgSrc,
      }
      // const imgSrc = tableImg(tableDate.tableType)
      const rows = getRows(tableRows)
      return (
        <div className={styles.rankTableWrapper} key={key}>
          <div className={styles.topTitle}>
            <div className={styles.tableName}>
              {
                // <img alt="" src={tableRows.imgSrc} />
              }
              <span>{tableDate.name}排行榜</span>
            </div>
            {
              !tableDate.noMore &&
                <Button
                  type="primary"
                  onClick={() => handelGoTableInfo(tableDate.tableType)}
                >
                  查看完整榜单<Icon type="right" />
                </Button>
            }
          </div>
          <div className={styles.tableHead}>
            <div className={styles.headRank}>排名</div>
            <div className={styles.headName}>名字</div>
            <div className={styles.headLast}>{tableDate.lastRow}</div>
          </div>
          <QueueAnim type={['right', 'left']}>
            {
              tableRows.data.length > 0 ? [
                <div className={styles.tableRowWrapper}>
                  {
                    rows
                  }
                </div>
              ] : [
                <div className={styles.noRowsWrapper}>
                  <div>
                    <img alt="" src={noSourceIcon} />
                    <p>没有数据哟~</p>
                  </div>
                </div>
              ]
            }
          </QueueAnim>
        </div>
      )
    })

  return (<div className={styles.wrapper}>{getTables()}</div>)
}

RankTable.propTypes = {
  data: PropTypes.array,
  handelGoTableInfo: PropTypes.func,
}

export default RankTable
