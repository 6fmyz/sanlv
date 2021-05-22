import React from 'react'
import {
  push
} from 'react-router-redux'
import {
  Button

} from 'antd'
import styles from './index.less'


class MainPage extends React.Component {
  

  render() {
    return (
      <div className={styles.buttonGroup}> 
        {/* <div className={styles.button} onClick={() => {this.props.history.push(`/v2-time-board`)}}>实时看板模块</div> */}
        <div className={styles.button} onClick={() => {this.props.history.push(`/v2-classroom-history-data-query`)}}>教室历史数据模块</div>
        <div className={styles.button} onClick={() => {this.props.history.push(`/v2-course-data-analysis/`)}}>课堂数据分析模块</div>
      </div>
    )
  }
}

export default MainPage;