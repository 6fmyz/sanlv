import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { push } from 'react-router-redux'
import styles from './TableInfo.less'

class TableInfo extends React.Component {
  state = {
    data: [],
    loading: false,
  }

  componentWillMount() {
    this.setState({
      data: this.props.dataSource,
      loading: this.props.loading,
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.dataSource,
      loading: nextProps.loading,
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onTableChange(null, { key: sorter.columnKey, order: sorter.order })
  }

  handleGoCourseDetailed = (courseId) => {
    this.props.dispatch({ type: 'v2_courseDetailed/setCourseId', courseId: courseId })
    this.props.dispatch({ type: 'v2_courseInfoList/setCourseId', courseId: courseId })
    this.props.dispatch(push('v2-courseInfoList/courseDetailed'))
  }

  render() {
    const pagination = false
    const columns = [
      {
        title: '工号',
        dataIndex: 'staffId',
        key: 'staffId',
      }, {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '院系',
        dataIndex: 'fstOrgName',
        key: 'fstOrgName',
        className: `${styles.colWord}`,
      }, {
        title: '课程',
        dataIndex: 'courseName',
        key: 'courseName',
        className: `${styles.colWord}`,
      }, {
        title: '电子资源(个)',
        children: [{
          title: '单题(个)',
          dataIndex: 'questionNum',
          key: 'questionNum',
          className: `${styles.colNumber}`,
          sorter: (a, b) => a.questionNum - b.questionNum,
        }, {
          title: '组卷(个)',
          dataIndex: 'quizzeNum',
          key: 'quizzeNum',
          className: `${styles.colNumber}`,
          sorter: (a, b) => a.quizzeNum - b.quizzeNum,
        }, {
          title: '课件(个)',
          dataIndex: 'courseWareNum',
          key: 'courseWareNum',
          className: `${styles.colNumber}`,
          sorter: (a, b) => a.courseWareNum - b.courseWareNum,
        }, {
          title: '微课(个)',
          dataIndex: 'weikeNum',
          key: 'weikeNum',
          className: `${styles.colNumber}`,
          sorter: (a, b) => a.weikeNum - b.weikeNum,
        }, {
          title: '互评(个)',
          dataIndex: 'assessmentNum',
          key: 'assessmentNum',
          className: `${styles.colNumber}`,
          sorter: (a, b) => a.assessmentNum - b.assessmentNum,
        }],
      }, {
        title: '学生(人)',
        dataIndex: 'studentNum',
        key: 'studentNum',
        className: `${styles.colNumber}`,
        sorter: (a, b) => a.studentNum - b.studentNum,
      }, {
        title: '课堂互动(次)',
        dataIndex: 'interactionNum',
        key: 'interactionNum',
        className: `${styles.colNum}`,
        sorter: (a, b) => a.interactionNum - b.interactionNum,
      }, {
        title: '人均互动(次)',
        dataIndex: 'avgInteractionNum',
        key: 'avgInteractionNum',
        className: `${styles.colNum}`,
        sorter: (a, b) => a.avgInteractionNum - b.avgInteractionNum,
      }, {
        title: '教师互动总数(次)',
        dataIndex: 'interactionSum',
        key: 'interactionSum',
        className: `${styles.colNum}`,
        sorter: (a, b) => a.interactionSum - b.interactionSum,
      }, {
        title: '详情',
        className: `${styles.colNumber}`,
        render: (text, record) => (
          <div>
            <button
              style={{
                color: '#0e8ee9',
                border: 'none',
                background: 'none',
                outline: 'none',
                cursor: 'pointer',
              }}
              onClick={() => this.handleGoCourseDetailed(record.courseId)}
            >
              详情
            </button>
          </div>
        ),
      }
    ]
    return (
      <div>
        <Table
          bordered={true}
          rowKey={(record, index) => index}
          columns={columns}
          dataSource={this.state.data}
          pagination={pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
      </div>
    )
  }
}

TableInfo.propTypes = {
  dataSource: PropTypes.array,
  loading: PropTypes.bool,
  pagination: PropTypes.object,
  onTableChange: PropTypes.func,
  dispatch: PropTypes.func,
}

export default TableInfo
