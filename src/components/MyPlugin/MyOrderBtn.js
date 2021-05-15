import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import styles from './MyOrderBtn.less'

class MyOrderBtn extends React.Component {
  render() {
    const { text, sortType, orderBtnClick, cellName } = this.props
    const upBtn = sortType === 2 ? `${styles.btnStyle} ${styles.active}` : `${styles.btnStyle}`
    const downBtn = sortType === 1 ? `${styles.btnStyle} ${styles.active}` : `${styles.btnStyle}`
    return (
      <div className={styles.orderBtnwrapper}>
        <div className={styles.textWrapper}>{text}</div>
        <div className={styles.btnWrapper}>
          <Button className={upBtn} icon="caret-up" onClick={() => orderBtnClick(cellName, 2)} />
          <Button className={downBtn} icon="caret-down" onClick={() => orderBtnClick(cellName, 1)} />
        </div>
      </div>
    )
  }
}

MyOrderBtn.propTypes = {
  cellName: PropTypes.string,
  text: PropTypes.string,
  sortType: PropTypes.number,
  orderBtnClick: PropTypes.func,
}

export default MyOrderBtn