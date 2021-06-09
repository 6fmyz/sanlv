import React from 'react'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { connect } from 'dva'
import selectors from './selectors'
import styles from './index.less'
import { Table, Select, Button } from 'antd'
import { MyPagination, MyLoading } from '../../../components/MyPlugin'
import queryString from 'query-string'
import searchIcon from '../../../images/search.svg'
class classroomHistoryDataQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource,
      classroom: [],
      classroomSelected: [],
    };
  }
  componentWillMount() {
    this.props.dispatch({ type: 'v2_classroomHistoryDataQuery/queryCampus' })
    this.initParams()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: nextProps.dataSource,
      classroom: nextProps.dataSource.map((item)=>{return {'id': item.classroomId,'name': item.classroomName}})
    })
    if (this.props.campusId !== nextProps.campusId && nextProps.campusId) {
      this.props.dispatch({
        type: 'v2_classroomHistoryDataQuery/queryTeachingBuilding',
        params: { campusId: nextProps.campusId }
      })
    }
    if (this.props.classroomBuildingId !== nextProps.classroomBuildingId
    && nextProps.classroomBuildingId) {
      this.props.dispatch({
        type: 'v2_classroomHistoryDataQuery/queryClassroom',
        params: { classroomBuildingId: nextProps.classroomBuildingId, campusId: nextProps.campusId }
      })
    }
    if (this.props.page !== nextProps.page && nextProps.page) {
      this.queryList(nextProps)
    }
  }

  // 初次请求数据
  initParams() {
    const {
      location: {
        search
      },
    } = this.props
    let campusId = this.props.campusId
    let classroomBuildingId = this.props.classroomBuildingId
    let classroomId = this.props.classroomId
    const from = queryString.parse(search).from
    if (!from || from.indexOf('/v2-classroom-history-data-query/classroomDetailed') === -1) {
      campusId = undefined
      classroomBuildingId = undefined
      classroomId = undefined
      this.props.dispatch({
        type: 'v2_classroomHistoryDataQuery/initFilterParams',
        params: {campusId, classroomBuildingId, classroomId}
      })
    }
    const props = {
      campusId,
      classroomBuildingId,
      classroomId,
    }
    this.queryList(props)
  }

  // 查询数据
  queryList(props) {
    this.props.dispatch({
      type: 'v2_classroomHistoryDataQuery/queryClassroomList',
      params: {
        campus: props.campusId,
        classroomBuilding: props.classroomBuildingId,
        classroom: props.classroomId,
        // page: props.page,
        // pageSize: props.pageSize,
      },
    })
  }

  // 更换学院
  handleCollegeChange = (value) => {
    this.props.dispatch({ type: 'v2_classroomHistoryDataQuery/collegeChange', id: value })
  }
  // 翻页
  handleChangePageNumber = (value) => {
    this.props.dispatch({ type: 'v2_classroomHistoryDataQuery/changePageNumber', page: value })
  }

  // 选择校区
  handleChangeCampus = (value) => {
    this.props.dispatch({
      type: 'v2_classroomHistoryDataQuery/changeCampus',
      id: !value ? null : parseInt(value, 10) })
  }
  // 选择教学楼
  handleChangeClassroomBuilding = (value) => {
    this.props.dispatch({
      type: 'v2_classroomHistoryDataQuery/changeClassroomBuilding',
      id: !value ? null : parseInt(value, 10)
    })
  }
  // 选择教室
  handleChangeClassroom = (value) => {
    // this.props.dispatch({
    //   type: 'v2_classroomHistoryDataQuery/changeClassroom',
    //   id: !value ? null : parseInt(value, 10)
    // })
    if(value){
      this.setState({
        classroomSelected: this.state.classroom.find(d=>d.id === value),
      })
    } else {
      this.setState({
        dataSource: this.props.dataSource,
        classroomSelected: []
      })
    }
    
  }

  // 查询数据
  handelQueryData = () => {
    this.handleChangePageNumber(1)
    // this.queryList(this.props)
    this.setState({
      dataSource: this.props.dataSource.filter(d=>d.classroomId === this.state.classroomSelected.id)
    })
  }


  loadData(selectedOptions) {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true

    setTimeout(() => {
      targetOption.loading = false
      targetOption.children = [{
        label: `${targetOption.label} Dynamic 1`,
        value: 'dynamic1',
      }, {
        label: `${targetOption.label} Dynamic 2`,
        value: 'dynamic2',
      }]
      this.setState({
        options: [...this.state.options],
      })
    }, 1000)
  }

  render() {
    const {dataSource, classroom, classroomSelected }= this.state;
    const {  campus, classroomBuilding, 
      totalNun, page, pageSize,
      campusId,
      classroomBuildingId,
      
    } = this.props
    // const classroom=dataSource.map((item)=>{return {'id': item.classroomId,'name': item.classroomName}});
    // const classroomId=dataSource.map((item)=>item.classroomId);
    const columns = [
      // { title: '校区', dataIndex: 'campusName', key: 'campusName', className: `${styles.textAlign}` },
      // { title: '教学楼', dataIndex: 'classroomBuilding', key: 'classroomBuilding', className: `${styles.textAlign}` },
      { title: '教室', dataIndex: 'classroomName', key: 'classroomName', className: `${styles.textAlign}` },
      {
        title: '上课次数',
        dataIndex: 'count',
        key: 'count',
        className: `${styles.textAlign}`
      },
      {
        title: '详情',
        dataIndex: '',
        key: 'x',
        render: (text, record) => {
          const page = (
            <div>
              <button
                style={{
                  color: 'white',
                  border: 'none',
                  backgroundColor: '#409eff',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  width: '50px',
                  height: '30px',
                }}
                onClick={() => {
                  // this.props.dispatch({ type: 'v2_classroomHistoryDataQuery/setTitleInfo', data: { ...record, type: 2 } })
                  this.props.dispatch(push(`/v2-classroom-history-data-query/classroomDetailed?classroomId=${record.classroomId}`))
                }}
              >
                详情
              </button>
            </div>
          )
          return page
        }
      },
    ]

    let campusSelected
    let classroomBuildingSelected
    // let classroomSelected
    // campus.some(item => {
    //   if (item.id === campusId && campusId) {
    //     campusSelected = item.name
    //     return true
    //   }
    // })
    // classroomBuilding.some(item => {
    //   if (item.id === classroomBuildingId && classroomBuildingId) {
    //     classroomBuildingSelected = item.name
    //     return true
    //   }
    // })
    
    // classroom.some(item => {
    //   if (item.id === classroomId && classroomId) {
    //     classroomSelected = item.name
    //     return true
    //   }
    // })
    return (
      <div className={styles.historyDataQueryMain}>
        {/* <Button
            onClick={() => {
              this.props.history.push('/')
            }}
          >返回主菜单</Button> */}
        <div className={styles.topWrapper}>
          <Button icon="left-circle" onClick={()=>this.props.history.push(`/v2-course-data-analysis/`)} />
          <div className={styles.pageTitle}>教室历史数据查询</div>
        </div>
        <div className={styles.historyDataWrapper}>
          <div className={styles.queryWrapper}>
            {/* <div className={styles.queryBox}>
              校区：
              <Select
                showSearch
                allowClear
                style={{ width: 200 }}
                placeholder="请选择校区"
                optionFilterProp="children"
                onChange={this.handleChangeCampus}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={campusSelected}
              >
                {campus.map(d => <Select.Option key={d.id}>{d.name}</Select.Option>)}
              </Select>
            </div>
            <div className={styles.queryBox}>
              教学楼：
              <Select
                showSearch
                allowClear
                style={{ width: 200 }}
                placeholder="请选择教学楼"
                optionFilterProp="children"
                onChange={this.handleChangeClassroomBuilding}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={classroomBuildingSelected}
              >
                {classroomBuilding.map(d => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>)}
              </Select> 
            </div> */}
            <div className={styles.queryBox}>
              教室：
              {
                <Select
                  showSearch
                  allowClear
                  style={{ width: 200 }}
                  placeholder="请选择教室"
                  optionFilterProp="children"
                  onChange={this.handleChangeClassroom}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  value={classroomSelected.name}
                >
                  {classroom.map(d => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>)}
                  {/* {classroom.map((d, index) => <Select.Option key={classroomId[index]} value={classroomId[index]}>{d}</Select.Option>)} */}
                </Select>
              }
            </div>
            <Button onClick={this.handelQueryData} style={{ height: '34px', width: '60px', background: `#00a19c url(${searchIcon}) center no-repeat`, backgroundSize: '22px' }}></Button>
          </div>
          <div className={styles.dataTable}>
            {this.props.loading && <MyLoading />}
            {
              !this.props.loading &&
                <div>
                  <Table bordered={true} columns={columns} pagination={false} dataSource={dataSource} className={styles.table} />
                  {/* {
                    this.props.totalNun > 0 &&
                      <MyPagination
                        totalCount={totalNun}
                        pageNum={page}
                        pageSize={pageSize}
                        onChangePageNumber={this.handleChangePageNumber}
                      />
                  } */}
                </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

classroomHistoryDataQuery.propTypes = {
  loading: PropTypes.bool,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  campus: PropTypes.array,
  classroomBuilding: PropTypes.array,
  classroom: PropTypes.array,
  campusId: PropTypes.number,
  classroomBuildingId: PropTypes.number,
  classroomId: PropTypes.number,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  dataSource: PropTypes.array,
  totalNun: PropTypes.number,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
}

export default connect(selectors)(classroomHistoryDataQuery)
