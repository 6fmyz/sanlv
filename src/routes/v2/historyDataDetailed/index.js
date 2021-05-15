import React from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import selectors from "./selectors";
import styles from "./index.less";
import { Button, Spin, Modal, message } from "antd";
import { AttentionChart, DistributedChart } from "../../../components/Chart";
import RectangleInImg from "../../../components/RectangleInImg";
import {
  randomArray,
  randomDoubleArray,
  randomDate,
} from "../../../utils/randomChartData";
import { isEmpty } from "lodash";
import queryString from "query-string";
import { emptyData } from "../../../utils/index";
import { push } from "react-router-redux";
const config = require("../../../config");
const { apiPrefix } = config;

class historyDataDetailed extends React.Component {
  state = {
    isShowDeleteDialog: false,
    isDeleteLoading: false,
  };
  static defaultProps = {
    classroom: {},
  };
  componentWillMount() {
    this.queryBoxDetail();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.scheduleId !== nextProps.scheduleId) {
      this.queryBoxDetail();
    }
  }

  currId = () => parseInt(queryString.parse(this.props.location.search).id, 10);

  queryBoxDetail() {
    this.props.dispatch({
      type: "v2_historyDataDetailed/queryBoxDetail",
      scheduleId: this.currId(), // this.props.scheduleId,
    });
  }

  attentionData(minNum, maxNum) {
    return {
      // students: randomArray(minNum, maxNum),
      nod: randomArray(minNum, maxNum),
      lookUp: randomArray(minNum, maxNum),
      date: randomDate(),
      distributedChartData: randomDoubleArray(minNum, maxNum),
    };
  }

  handleChangeActiveImgUrl = (markInfo) => {
    this.props.dispatch({
      type: "v2_historyDataDetailed/changeActiveMarkInfo",
      info: markInfo,
    });
  };

  // 返回按钮
  goBackBtn = () => {
    const {
      location: { search, pathname },
    } = this.props;
    const searchParams = queryString.parse(search);
    if (searchParams && searchParams.from) {
      this.props.dispatch(push(`${searchParams.from}?back=${pathname}`));
    } else {
      window.history.back();
    }
  };

  // 导出详情
  handleExportDetail = () => {
    window.open(`${apiPrefix}/courseMonitors/${this.currId()}/detail/export`);
  };

  handleChangeActiveTime = (time, isTag) => {
    this.props.dispatch({
      type: "v2_historyDataDetailed/changeActiveTime",
      time,
      isTag,
    });
  };

  // 删除
  handleDelete = () => {
    this.setState({
      isDeleteLoading: true,
    });
    const id = this.currId();
    this.props.dispatch({
      type: "v2_historyDataDetailed/deleteDetail",
      id,
      deleteSuccess: () => {
        this.setState({
          isShowDeleteDialog: false,
          isDeleteLoading: false,
        });
        message.success("删除成功!");
        this.goBackBtn();
      },
      deleteFailed: () => {
        message.error("删除失败!");
        this.setState({
          isDeleteLoading: false,
        });
      },
    });
  };

  // 取消删除
  handleCancel = () => {
    this.setState({
      isShowDeleteDialog: false,
    });
  };

  render() {
    const isMark = true;
    const {
      teacherName,
      className,
      date,
      activeMarkInfo,
      dataSource,
      classroomMsg,
    } = this.props;
    return (
      <div className={styles.historyDataDetailedMain}>
        <div className={styles.pageTitle}>
          <Button icon="left-circle" onClick={this.goBackBtn} />
          <div>
            {teacherName} {className} {date} 数据详情
          </div>
          <Button
            onClick={() => {
              this.setState({
                isShowDeleteDialog: true,
              });
            }}
          >
            删除
          </Button>
          <Button onClick={this.handleExportDetail}>导出</Button>
        </div>
        {this.props.loading && (
          <div className={styles.loadingWrapper}>
            <Spin />
          </div>
        )}
        {!isEmpty(dataSource) && (
          <div className={styles.detailedWrapper}>
            <div
              className={styles.leftTab}
              style={{ width: "65%", position: "relative" }}
            >
              {activeMarkInfo.rate !== 0 &&
                activeMarkInfo.type !== 1 &&
                activeMarkInfo.unitText !== "%" && (
                  <div className={styles.imgTitle}>
                    <div>
                      出勤人数：
                      {/* <span className={styles.unit}>{activeMarkInfo.unit}</span> */}
                      <span className={styles.num}>{activeMarkInfo.rate}</span>
                      <span className={styles.unitText}>人</span>
                    </div>
                  </div>
                )}
              {classroomMsg.classroomName ? (
                <div className={styles.classRoomMsg}>
                  {`${classroomMsg.classroomName}`}
                  {/* {`${classroomMsg.campusName} - ${classroomMsg.buildingName} - ${classroomMsg.classroomName}`} */}
                </div>
              ) : null}
              {!isEmpty(activeMarkInfo) ? (
                <div style={{ width: "100%" }}>
                  {/* <img src={activeMarkInfo.activeImgUrl} alt="" /> */}
                  <RectangleInImg
                    url={activeMarkInfo.activeImgUrl}
                    rectArr={JSON.parse(activeMarkInfo.bbox || "[]")}
                    imgMode={2}
                  />
                </div>
              ) : (
                emptyData()
              )}
            </div>
            <div
              className={styles.rightChart}
              style={{ width: "calc(35% - 20px)" }}
            >
              {
                // <div className={styles.numberWrapper}>
                //   出勤人数：
                //   <span className={styles.num}>
                //     {dataSource.students}
                //   </span>
                // </div>
              }
              <div>
                {dataSource.chartData ? (
                  <AttentionChart
                    style={{ width: "calc(100%)", height: 220 }}
                    dataSource={dataSource.chartData}
                    isMark={isMark}
                    onClickFun={this.handleChangeActiveImgUrl}
                    styles={styles}
                    // activeMarkId={activeMarkInfo.id}
                    activeTime={activeMarkInfo.date}
                    handleChangeActiveTime={this.handleChangeActiveTime}
                  />
                ) : (
                  emptyData()
                )}
              </div>
              <div className={styles.chartWrapper}>
                {dataSource.distributedChartData ? (
                  <DistributedChart
                    style={
                      isEmpty(dataSource.chartData.lookUpMark)
                        ? { width: "calc(100%)", height: 350 }
                        : { width: "calc(100%)", height: 300 }
                    }
                    dataSource={dataSource.distributedChartData}
                  />
                ) : (
                  emptyData()
                )}
              </div>
            </div>
          </div>
        )}
        <Modal
          title="删除"
          visible={this.state.isShowDeleteDialog}
          onOk={this.handleDelete}
          onCancel={this.handleCancel}
          bodyStyle={{ height: "110px" }}
          width={400}
          confirmLoading={this.state.isDeleteLoading}
        >
          确定删除吗？
        </Modal>
      </div>
    );
  }
}

historyDataDetailed.propTypes = {
  loading: PropTypes.bool,
  activeMarkInfo: PropTypes.object,
  dispatch: PropTypes.func,
  teacherName: PropTypes.string,
  className: PropTypes.string,
  semester: PropTypes.string,
  date: PropTypes.string,
  studentsNum: PropTypes.string,
  dataSource: PropTypes.object,
  scheduleId: PropTypes.number,
  location: PropTypes.object,
};

export default connect(selectors)(historyDataDetailed);
