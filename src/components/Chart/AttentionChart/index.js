import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactEcharts from 'echarts-for-react'
import { isEmpty, isObject } from 'lodash'
import {
  Slider,
} from 'antd'
import styles from './index.less'

import sliderStick from './images/slider_stick.png'
import sliderBlock from './images/slider_block.png'
class AttentionChart extends Component {
  static propTypes = {
    isMark: PropTypes.bool,
    dataSource: PropTypes.object,
    style: PropTypes.object,
    onClickFun: PropTypes.func,
    chartId: PropTypes.number,
    // activeMarkId: PropTypes.number,
    activeTime: PropTypes.string,
    handleChangeActiveTime: PropTypes.func,
  };

  static defaultProps = {
    dataSource: {},
    isMark: false,
    style: {
      height: 460
    }
  };

  getOption = (props) => {
    const source = props.dataSource
    const echartOption = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['抬头率', '点头数'],
        textStyle: {
          color: '#ccc'
        },
        itemGap: 50
      },
      calculable: true,
      grid: {
        y: 50,
        x: 40,
        y2: 40,
        x2: 50
      },
      xAxis: [
        {
          data: source.date,
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: '#8E8E8F',
              type: 'solid'
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: 'dataMax',
          axisLabel: {
            formatter: function (value) {
              const v = parseInt(value, 10)
              return `${v}%`
            }
          },
          axisLine: {
            lineStyle: {
              color: 'red',
              width: 2
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: ['red'],
              width: 1,
              type: 'solid'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#4A5271',
              type: 'dotted',
              width: 1
            }
          }
        },
        {
          type: 'value',
          min: 0,
          max: function (value) {
            return value.max + 1
          },
          silent: true,
          axisLabel: {
            formatter: '{value}',
            showMaxLabel: false,
          },
          axisLine: {
            lineStyle: {
              color: '#888',
              width: 2,
            },
            symbolSize: [60, 35]
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: '#888',
              width: 1,
              type: 'solid'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#4A5271',
              type: 'dotted',
              width: 1
            }
          }
        }
      ],
      series: [
        {
          data: source.lookUp,
          yAxisIndex: 0,
          name: '抬头率',
          type: 'line',
          symbol: 'none',
          color: 'red',
        },
        {
          data: source.nodeNum,
          yAxisIndex: 1,
          name: '点头数',
          type: 'bar',
          color: '#888',
          barMaxWidth: 3,
          animationDelay: function (idx) {
            return idx * 10
          }
        }
      ]
    }
    if (!isEmpty(source)) {
      const lookUpMarkData = source.lookUpMark.map(val => {
        const text = val.type === 1 || val.type === 3 ? '峰' : '谷'
        let color = val.type === 1 ? '#54c341' : 'red'
        color = val.type === 3 ? '#1890ff' : color
        const textName = val.type === 3 ? '出勤人数' : '抬头率'
        return {
          symbol: val.type === 3 ? 'circle' : null,
          symbolSize: val.type === 3 ? [30, 30] : null,
          name: textName,
          unit: `${text}值`,
          unitText: val.type === 3 ? '人' : '%',
          value: val.type === 3 ? val.attendanceCount : val.rate,
          xAxis: val.time,
          yAxis: val.type === 3 ? 0 : val.rate,
          url: val.url,
          id: val.id,
          bbox: val.bbox,
          itemStyle: {
            normal: {
              color: color
            }
          }
        }
      })
      echartOption.series[0].markPoint = {
        data: lookUpMarkData
      }
    }
    return echartOption
  }

  // getBoxVal() {
  //   const mark = this.props.dataSource.lookUpMark
  //   const lowValue = []
  //   let peak = null
  //   let maxStudents = null
  //   mark.forEach(val => {
  //     if (val.type === 2) {
  //       lowValue.push({
  //         name: '抬头率',
  //         unit: '谷值',
  //         unitText: '%',
  //         url: val.url,
  //         value: val.rate,
  //         time: val.time,
  //         id: val.id,
  //       })
  //     }
  //     if (val.type === 1) {
  //       peak = {
  //         name: '抬头率',
  //         unit: '峰值',
  //         unitText: '%',
  //         url: val.url,
  //         value: val.rate,
  //         time: val.time,
  //         id: val.id,
  //       }
  //     }
  //     if (val.type === 3) {
  //       maxStudents = {
  //         name: '出勤人数',
  //         unit: '峰值',
  //         unitText: '人',
  //         url: val.url,
  //         value: val.attendanceCount,
  //         time: val.time,
  //         id: val.id,
  //       }
  //     }
  //   })
  //   return {
  //     lowValue,
  //     peak,
  //     maxStudents,
  //   }
  // }

  createResize() {
    const e = document.createEvent('Event')
    e.initEvent('resize', true, true)
    window.dispatchEvent(e)
  }

  markPointClick = (markInfo) => {
    if (!isObject(markInfo.data)) {
      return
    }
    this.props.onClickFun(markInfo.data)
  }

  getNumWrapperData = (lookUpMark) => {
    let attendanceCountInfo = {}
    let lookUpMaxInfo = {}
    let avgNodeInfo = {}
    let avgLookUpInfo = {}
    lookUpMark.forEach(mark => {
      if (mark.type === 1) { // 抬头率峰值
        lookUpMaxInfo = mark
      } else if (mark.type === 3) {
        attendanceCountInfo = mark
      } else if (mark.type === 4) {
        avgLookUpInfo = mark
      } else if (mark.type === 5) {
        avgNodeInfo = mark
      }
    })
    return {
      attendanceCountInfo,
      lookUpMaxInfo,
      avgNodeInfo,
      avgLookUpInfo,
    }
  }

  render() {
    // const {
    //   sliderValue,
    // } = this.state
    const onEvents = {
      click: this.markPointClick
    }
    const {
      style,
      dataSource: {
        lookUpMark,
        date,
      },
      activeTime,
    } = this.props
    // const boxVal = this.getBoxVal()
    let sliderValue
    date.some((item, index) => {
      if (item === activeTime) {
        sliderValue = index
        return true
      }
    })
    const {
      attendanceCountInfo,
      lookUpMaxInfo,
      avgNodeInfo,
      avgLookUpInfo,
    } = this.getNumWrapperData(lookUpMark)
    const sliderStickLeft = `${date.length ? `${100 * sliderValue / (date.length - 1)}` : 0}%`
    return (
      <React.Fragment>
        <div id="linesChart" style={isEmpty(lookUpMark) ? style : { width: '100%', height: 285, padding: '20px 20px 0 20px'}}>
          <ReactEcharts
            option={this.getOption(this.props)}
            onEvents={onEvents}
            style={style}
          />
          <div className={styles.sliderWrapper}>
            <Slider
              value={sliderValue}
              onChange={(value) => {
                this.props.handleChangeActiveTime(date[value])
              }}
              min={0}
              max={(date && date.length) ? date.length -1 : 100}
              tipFormatter={(value) => {
                if (date && date.length) {
                  return date[value]
                }
                return value
              }}
              handleStyle={{
                height: '48px',
                width: '48px',
                border: 'none',
                backgroundColor: 'transparent',
                backgroundImage: `url(${sliderBlock})`,
                backgroundSize:'cover',
                top: '-10px'
              }}
            />
            <div
              className={styles.sliderLines}
              style={{
                left: `calc(${sliderStickLeft} - 12px)`
              }}
            >
              <img src={sliderStick} alt="" height={200} />
            </div>
          </div>
        </div>
        <div className={styles.numberViewWrapper}>
          <button
            className={styles.btnWrapper}
            style={{
              background: 'rgba(0, 148, 247, 0.49)',
              boxShadow: (attendanceCountInfo.time && activeTime === attendanceCountInfo.time) ? '0 0 4px #fff': 'none'
            }}
            onClick={() => {
              if (!isEmpty(attendanceCountInfo)) {
                this.props.handleChangeActiveTime(attendanceCountInfo.time, 'attendanceTag')
              }
            }}
          >
            <span>出勤人数</span>
            <span><span>{attendanceCountInfo ? attendanceCountInfo.attendanceCount : '-'}</span>人</span>
          </button>
          <button
            className={styles.btnWrapper}
            style={{
              background: 'rgba(70, 197, 89, 0.5)',
              boxShadow: (lookUpMaxInfo.time && activeTime === lookUpMaxInfo.time) ? '0 0 4px #fff': 'none'
            }}
            onClick={() => {
              if (!isEmpty(lookUpMaxInfo)) {
                this.props.handleChangeActiveTime(lookUpMaxInfo.time, 'lookUpTag')
              }
            }}
          >
            <span>抬头率峰值</span>
            <span><span>{lookUpMaxInfo ? lookUpMaxInfo.rate : '-'}</span>%</span>
          </button>
          <button className={styles.notClickBtnWrapper} style={{
            background: 'rgba(255, 92, 0, 0.5)'
          }}>
            <span>活跃度</span>
            <span><span>{avgNodeInfo ? avgNodeInfo.avgNod : '-'}</span></span>
          </button>
          <button className={styles.notClickBtnWrapper} style={{
            background: 'rgba(252, 59, 59, 0.5)'
          }}>
            <span>注意力</span>
            <span><span>{avgLookUpInfo ? avgLookUpInfo.avgLookUp: ''}</span>%</span>
          </button>
        </div>
      </React.Fragment>

    )
  }
}

export default AttentionChart
