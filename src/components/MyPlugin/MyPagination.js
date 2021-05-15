import React from 'react'
import PropTypes from 'prop-types'
import { Pagination } from 'antd'
import styles from './MyPagination.less'

class MyPagination extends React.Component {
  render() {
    const { totalCount, pageNum, pageSize, onChangePageNumber } = this.props
    return (
      <div className={styles.paginationWrapper}>
        <Pagination
          total={totalCount}
          current={pageNum}
          pageSize={pageSize}
          onChange={onChangePageNumber}
        />
        <div className={styles.totalNum}>
          共&nbsp;&nbsp;{totalCount}&nbsp;&nbsp;条数据
        </div>
      </div>
    )
  }
}

MyPagination.propTypes = {
  totalCount: PropTypes.number,
  pageNum: PropTypes.number,
  pageSize: PropTypes.number,
  // 翻页
  onChangePageNumber: PropTypes.func,
}

export default MyPagination