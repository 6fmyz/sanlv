import React from 'react'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { connect } from 'dva'
import selectors from './selectors'
import styles from './index.less'
import SearchInput from './SearchInput'
import { Table, Select, Input } from 'antd'
const Search = Input.Search
import { SelectCollege } from '../../../components/Dashboard'
import { MyPagination, MyLoading } from '../../../components/MyPlugin'
import {
  startYearList,
  currentTermYear,
  inputDebounce,
} from '../../../utils/helperValue'
import queryString from 'query-string'

class historyDataQuery extends React.Component {
  componentWillMount() {
    this.initParams()

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.departmentId !== nextProps.departmentId
    || this.props.teacher !== nextProps.teacher
    || this.props.course !== nextProps.course
    || this.props.term !== nextProps.term
    || this.props.year !== nextProps.year
    ) {
      this.handleChangePageNumber(1)
      this.queryList(nextProps)
    }
    if (this.props.page !== nextProps.page) {
      this.queryList(nextProps)
    }
  }

  // 初始化数据
  initParams() {
    const {
      location: {
        search
      }
    } = this.props
    const back = queryString.parse(search).back
    const teacherId = queryString.parse(search).teacherId || undefined
    if (!back || back.indexOf('v2-history-data-query/detailedBox') === -1) {
      const term = teacherId ? null : currentTermYear.currentTerm
      const year = teacherId ? null : currentTermYear.currentYear
      this.handleChangeTeacher(teacherId)
      this.handleChangeCourse(undefined)
      this.handleChangeTerm(term)
      this.handleChangeYear(year)
      this.handleChangePageNumber(1)
      this.handleCollegeChange(null)
      this.queryList({...this.props, teacher: teacherId, course: undefined, term: term, year: year, page: 1, pageSize: 20})
    } else {
      this.queryList(this.props)
    }
  }

  // 查询数据
  queryList(props) {
    this.props.dispatch({
      type: 'v2_historyDataQuery/queryCourseList',
      params: {
        departmentId: props.userDepartmentId ? props.userDepartmentId : props.departmentId,
        teacher: props.teacher,
        course: props.course,
        term: props.term,
        page: props.page,
        pageSize: props.pageSize,
        year: props.year,
      },
    })
  }

  // 更换学院
  handleCollegeChange = (value) => {
    this.props.dispatch({ type: 'v2_historyDataQuery/collegeChange', id: value })
  }
  // 搜索教师
  handleSearchTeacher = (val) => {
    this.props.dispatch({ type: 'v2_historyDataQuery/queryTeachers', params: { search: val } })
  }
  // 选择教师
  handleChangeTeacher = (value) => {
    this.props.dispatch({ type: 'v2_historyDataQuery/changeTeacher', teacher: value || undefined })
  }
  // 搜索课堂
  handleSearchCourse = (val) => {
    this.props.dispatch({ type: 'v2_historyDataQuery/queryCourses', params: { search: val } })
  }
  // 更换课堂
  handleChangeCourse = (value) => {
    this.props.dispatch({ type: 'v2_historyDataQuery/changeCourse', course: value || undefined })
  }
  // 翻页
  handleChangePageNumber = (value) => {
    this.props.dispatch({ type: 'v2_historyDataQuery/changePageNumber', page: value })
  }
  // 更换学期
  handleChangeTerm = (value) => {
    this.props.dispatch({ type: 'v2_historyDataQuery/changeTerm', term: value })
  }
  // 更换学年
  handleChangeYear = (value) => {
    this.props.dispatch({
      type: 'v2_historyDataQuery/changeYear', year: value
    })
  }
  
  render() {
    const {
      term, dataSource, teacherNames, courseNames, totalNun,
      page, pageSize, year, teacher,
      course,
      location: {
        pathname,
        search,
      }
    } = this.props
    const columns = [
      { 
        title: '教师姓名', 
        dataIndex: 'teacherName', 
        key: 'teacherName', 
        // className: `${styles.textAlign}`,
        render: function(teacherName, record) {
          return {
            children: <div>{teacherName}</div>,
            props: {
              rowSpan: record.rowSpan,
            }
          }
        }
      },
      {
        title: '教师课堂',
        children: [
          { title: '课堂名称', 
            dataIndex: 'courseName', 
            key: 'courseName', 
            render: (courseName, record) => {
              return (
    
                <button
                  style={{
                    color: '#0e8ee9',
                    border: 'none',
                    background: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  onClick={() => {
                    if (teacher) {
                      this.props.dispatch(push(`/v2-history-data-query/detailedBox?id=${record.courseId}`))
                    } else {
                      this.props.dispatch(push(`/v2-history-data-query/detailedBox?id=${record.courseId}`))
                    }
                  }}
                >
                  {courseName}
                </button>
              )
            }
          },
          {
            title: '上课次数',
            dataIndex: 'courseCount',
            key: 'courseCount',
          },          
        ]
      },
      { 
        title: '总上课次数', 
        dataIndex: 'count', 
        key: 'count', 
        render: function(count, record) {
          return {
            children: <div>{count}</div>,
            props: {
              rowSpan: record.rowSpan,
            }
          }
        }
      },
    ]
    const selectCollege = {
      universityData: this.props.collegeInfo,
      currentCollegeId: this.props.departmentId,
      fstOrgId: this.props.departmentId,
      secOrgId: null,
      handleCollegeChange: this.handleCollegeChange,
      handleProfessionChange: this.handleProfessionChange,
      userDepartmentId: this.props.userDepartmentId,
    }

    return (
      <div className={styles.historyDataQueryMain}>
        <div className={styles.topWrapper}>
          <SelectCollege {...selectCollege} />
          <div className={styles.pageTitle}>课程历史数据查询</div>
        </div>
        <div className={styles.historyDataWrapper}>
          <div className={styles.queryWrapper}>
            <div className={styles.queryBox}>
              <div className={styles.queryText}>教师：</div>
              {
                <SearchInput
                  onSearch={this.handleSearchTeacher}
                  onChange={this.handleChangeTeacher}
                  placeholder="请输入教师姓名"
                  dataSource={teacherNames}
                  style={{ width: 200 }}
                  defaultValue={teacher}
                />
                // <Search
                //   placeholder="请输入教师姓名"
                //   onSearch={value => this.handleChangeTeacher(value)}
                //   enterButton
                // />
              }
            </div>
            <div className={styles.queryBox}>
              <div className={styles.queryText}>课程：</div>
              {
                <Input 
                  onChange={inputDebounce((e) => this.handleChangeCourse(e.target.value), 1000)}
                  placeholder="请输入课程名称"
                  style={{ width: 200 }}
                  defaultValue={course}
                />
              }
            </div>
            <div className={styles.queryBox}>
              学年：
              <Select value={year} style={{ width: 120 }} onChange={this.handleChangeYear}>
                {
                  startYearList().map((item, index) => {
                    return (
                      <Select.Option value={item} key={index}>
                        {item || '全部'}
                      </Select.Option>
                    )
                  })
                }
              </Select>
            </div>
            <div className={styles.queryBox}>
              学期：
              <Select value={term} style={{ width: 120 }} onChange={this.handleChangeTerm}>
                <Select.Option value={null}>全部</Select.Option>
                <Select.Option value="春">春</Select.Option>
                <Select.Option value="秋">秋</Select.Option>
                <Select.Option value="其他">其他</Select.Option>
              </Select>
            </div>
          </div>
          <div className={styles.dataTable}>
            {this.props.loading && <MyLoading />}
            {
              !this.props.loading &&
                <div>
                  <Table bordered={true} pagination={false} columns={columns} dataSource={dataSource} />
                  {
                    totalNun > 0 &&
                      <MyPagination
                        totalCount={totalNun}
                        pageNum={page}
                        pageSize={pageSize}
                        onChangePageNumber={this.handleChangePageNumber}
                      />
                  }
                </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

historyDataQuery.propTypes = {
  loading: PropTypes.bool,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  collegeInfo: PropTypes.object,
  userDepartmentId: PropTypes.number,
  departmentId: PropTypes.string,
  teacher: PropTypes.string,
  course: PropTypes.string,
  term: PropTypes.string,
  year: PropTypes.string,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  dataSource: PropTypes.array,
  totalNun: PropTypes.number,
  teacherNames: PropTypes.array,
  courseNames: PropTypes.array,
}

export default connect(selectors)(historyDataQuery)
