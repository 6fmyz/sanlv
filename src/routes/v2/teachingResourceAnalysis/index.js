import React from 'react'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { connect } from 'dva'
import selectors from './selectors'
import styles from './index.less'
import { Table } from 'antd'
import CircleSmall from './Circle'
import { MyPagination, MyLoading } from '../../../components/MyPlugin'

class teachingResourceAnalysis extends React.Component {
  componentWillMount() {
    const param = {
      page: this.props.page,
      pageSize: this.props.pageSize,
      departmentId: this.props.userDepartmentId,
    }
    this.props.dispatch({
      type: 'v2_teachingResourceAnalysis/querySource',
      param,
    })
    this.props.dispatch({
      type: 'v2_teachingResourceAnalysis/queryHomeTotalResources',
      param: { departmentId: this.props.userDepartmentId }
    })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.page !== nextProps.page) {
      const param = {
        page: nextProps.page,
        pageSize: nextProps.pageSize,
        departmentId: this.props.userDepartmentId,
      }
      this.props.dispatch({ type: 'v2_teachingResourceAnalysis/querySource', param })
    }
  }

  handleGoInfoById = (departmentId) => {
    // this.props.dispatch({ type: 'v2_courseInfoList/collegeChange', id: departmentId })
    this.props.dispatch(push(`v2-courseInfoList?id=${departmentId}`))
  }

  // 翻页事件
  handelOnPageChange = (current) => {
    this.props.dispatch({ type: 'v2_teachingResourceAnalysis/changePageNumber', pageNumber: current })
  }

  render() {
    const columns = [
      {
        title: '院系',
        dataIndex: 'name',
        key: 'name',
        className: `${styles.textAlign}`
      },
      {
        title: '单题',
        dataIndex: 'questionCount',
        key: 'questionCount',
        className: `${styles.numTextAlign}`,
        render: (text, record) => (Number(record.questionCount)),
      },
      {
        title: '组卷',
        dataIndex: 'quizzeCount',
        key: 'quizzeCount',
        className: `${styles.numTextAlign}`,
        render: (text, record) => (Number(record.quizzeCount)),
      },
      {
        title: '课件',
        dataIndex: 'coursewareCount',
        key: 'coursewareCount',
        className: `${styles.numTextAlign}`,
        render: (text, record) => (Number(record.coursewareCount)),
      },
      {
        title: '微课',
        dataIndex: 'weikeCount',
        key: 'weikeCount',
        className: `${styles.numTextAlign}`,
        render: (text, record) => (Number(record.weikeCount)),
      },
      {
        title: '板书',
        dataIndex: 'draftCount',
        key: 'draftCount',
        className: `${styles.numTextAlign}`,
        render: (text, record) => (Number(record.draftCount)),
      },
      {
        title: '作业',
        dataIndex: 'homeworkCount',
        key: 'homeworkCount',
        className: `${styles.numTextAlign}`,
        render: (text, record) => (Number(record.homeworkCount)),
      },
      {
        title: '互评',
        dataIndex: 'assessmentCount',
        key: 'assessmentCount',
        className: `${styles.numTextAlign}`,
        render: (text, record) => (Number(record.assessmentCount)),
      },
      {
        title: '课堂数',
        dataIndex: 'courseCount',
        key: 'courseCount',
        className: `${styles.numTextAlign}`,
        render: (text, record) => (Number(record.courseCount)),
      },
      {
        title: '课均资源',
        dataIndex: 'avgCourseCount',
        key: 'avgCourseCount',
        className: `${styles.numTextAlign}`,
        render: (text, record) => (Number(record.avgCourseCount)),
      },
      {
        title: '教师数',
        dataIndex: 'teacherCount',
        key: 'teacherCount',
        className: `${styles.numTextAlign}`,
        render: (text, record) => (Number(record.teacherCount)),
      },
      {
        title: '师均资源',
        dataIndex: 'avgTeacherCount',
        key: 'avgTeacherCount',
        className: `${styles.numTextAlign}`,
        render: (text, record) => (Number(record.avgTeacherCount)),
      },
      {
        title: '总计',
        dataIndex: 'total',
        key: 'total',
        render: (text, record) => (Number(record.total)),
      },
      {
        title: '详情',
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
              onClick={() => this.handleGoInfoById(record.id)}
            >
              详情
            </button>
          </div>
        ),
      }
    ]
    const { totalInfo, departmentList, departmentCount, pageSize, page, loading } = this.props
    const courseNum = parseInt(totalInfo.courseNum, 10)
    const questionNum = parseInt(totalInfo.questionNum, 10)
    const quizzeNum = parseInt(totalInfo.quizzeNum, 10)
    const coursewareNum = parseInt(totalInfo.coursewareNum, 10)
    const weikeNum = parseInt(totalInfo.weikeNum, 10)
    const assessmentNum = parseInt(totalInfo.assessmentNum, 10)
    const homeworkNum = parseInt(totalInfo.homeworkNum, 10)
    const draftNum = parseInt(totalInfo.draftNum, 10)
    const total = courseNum + questionNum + quizzeNum + weikeNum +
      assessmentNum + coursewareNum + homeworkNum + draftNum
    const bordered = true
    return (
      <div>
        <div className={styles.pageTitle}>全校教学资源概览</div>
        <div className={styles.sourceWrapper}>
          {loading && <MyLoading />}
          {
            !loading &&
              <div>
                <div className={styles.sourceHeade}>
                  <div>
                    <CircleSmall
                      value={(courseNum / total) * 10000 / 100}
                      count={courseNum}
                      text="课程"
                      foreground="#0575f9"
                      bgColor="#abcef7"
                    />
                  </div>
                  <div>
                    <CircleSmall
                      value={(questionNum / total) * 10000 / 100}
                      count={questionNum}
                      text="单题"
                      foreground="#0575f9"
                      bgColor="#abcef7"
                    />
                  </div>
                  <div>
                    <CircleSmall
                      value={parseInt((quizzeNum / total) * 10000 / 100, 10)}
                      count={quizzeNum}
                      text="组卷"
                      foreground="#0575f9"
                      bgColor="#abcef7"
                    />
                  </div>
                  <div>
                    <CircleSmall
                      value={(coursewareNum / total) * 10000 / 100}
                      count={coursewareNum}
                      text="课件"
                      foreground="#0575f9"
                      bgColor="#abcef7"
                    />
                  </div>
                  <div>
                    <CircleSmall
                      value={(weikeNum / total) * 10000 / 100}
                      count={weikeNum}
                      text="微课"
                      foreground="#0575f9"
                      bgColor="#abcef7"
                    />
                  </div>
                  <div>
                    <CircleSmall
                      value={(assessmentNum / total) * 10000 / 100}
                      count={assessmentNum}
                      text="互评"
                      foreground="#0575f9"
                      bgColor="#abcef7"
                    />
                  </div>
                  <div>
                    <CircleSmall
                      value={(draftNum / total) * 10000 / 100}
                      count={draftNum}
                      text="板书"
                      foreground="#0575f9"
                      bgColor="#abcef7"
                    />
                  </div>
                  <div>
                    <CircleSmall
                      value={(homeworkNum / total) * 10000 / 100}
                      count={homeworkNum}
                      text="作业"
                      foreground="#0575f9"
                      bgColor="#abcef7"
                    />
                  </div>
                </div>
                <div className={styles.sourceBody}>
                  <Table
                    bordered={bordered}
                    rowKey={(record, index) => index}
                    loading={loading}
                    columns={columns}
                    dataSource={departmentList}
                    pagination={false}
                    size="middle"
                  />
                  {
                    departmentCount > 0 &&
                      <MyPagination
                        totalCount={departmentCount}
                        pageNum={page}
                        pageSize={pageSize}
                        onChangePageNumber={this.handelOnPageChange}
                      />
                  }
                </div>
              </div>
          }
        </div>
      </div>
    )
  }
}

teachingResourceAnalysis.propTypes = {
  loading: PropTypes.bool,
  orgId: PropTypes.number,
  totalInfo: PropTypes.object,
  departmentCount: PropTypes.number,
  departmentList: PropTypes.array,
  queryString: PropTypes.string,
  dispatch: PropTypes.func,
  location: PropTypes.object,
  collegeInfo: PropTypes.object,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  userDepartmentId: PropTypes.number,
}

export default connect(selectors)(teachingResourceAnalysis)
