import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactEcharts from 'echarts-for-react'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 引入柱状图
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

import tdTheme from '../theme.json'
echarts.registerTheme('tdTheme', tdTheme)

const chartOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  // color: [
  //   '#147DFF',
  //   '#E64D47',
  //   '#00AF7D',
  //   '#8478EA',
  //   '#E7BBF3',
  //   '#FEAC02',
  // ],
  color: [
    // '#4db553',
    // '#f4333c',
    // '#f6a623',
    // '#E7BBF3',
    '#2575AF',
    '#E89722',
    '#9EB150',
    '#BE3A2B',
    '#9A66E4',
  ],
  legend: {
    data: ['出勤', '请假', '迟到', '缺勤'],
    textStyle: {
      color: '#ccc',
    },
    itemGap: 10,
  },
  grid: {
    y: 50,
    x: 40,
    y2: 40,
    x2: 50,
    containLabel: true,
  },
  yAxis: {
    type: 'value',
    axisTick: {
      show: true,
      lineStyle: {
        color: ['#ddd'],
        width: 1,
        type: 'solid'
      },
    },
    axisLine: {
      lineStyle: {
        color: '#ccc',
      }
    },
    splitLine: {
      lineStyle: {
        color: '#4A5271',
        type: 'dotted',
        width: 1,
      }
    },
  },
  xAxis: {
    type: 'category',
    axisLabel: {
      interval: 0,
      rotate: 40
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: ['#ddd'],
        width: 1,
        type: 'solid'
      }
    },
    axisLine: {
      lineStyle: {
        color: '#ccc',
      }
    },
  },
  series: [
    {
      name: '出勤',
      type: 'bar',
      barMaxWidth: 50,
      stack: '总量',
      label: {
        normal: {
          show: false,
          position: 'insideRight'
        }
      },
      // itemStyle: {
      //   normal: {
      //     color: new echarts.graphic.LinearGradient(
      //       0, 0, 0, 1,
      //       [
      //         { offset: 0, color: '#E89722' },
      //         { offset: 1, color: '#2575AF' },
      //       ]
      //     )
      //   }
      // },
    },
    {
      name: '请假',
      type: 'bar',
      barMaxWidth: 50,
      stack: '总量',
      label: {
        normal: {
          show: false,
          position: 'insideRight'
        }
      },
      // itemStyle: {
      //   normal: {
      //     color: new echarts.graphic.LinearGradient(
      //       0, 0, 0, 1,
      //       [
      //         { offset: 0, color: '#9EB150' },
      //         { offset: 1, color: '#E89722' },
      //       ]
      //     )
      //   }
      // },
    },
    {
      name: '迟到',
      type: 'bar',
      barMaxWidth: 50,
      stack: '总量',
      label: {
        normal: {
          show: false,
          position: 'insideRight'
        }
      },
      // itemStyle: {
      //   normal: {
      //     color: new echarts.graphic.LinearGradient(
      //       0, 0, 0, 1,
      //       [
      //         { offset: 0, color: '#BE3A2B' },
      //         { offset: 1, color: '#9EB150' },
      //       ]
      //     )
      //   }
      // },
    },
    {
      name: '缺勤',
      type: 'bar',
      barMaxWidth: 50,
      stack: '总量',
      label: {
        normal: {
          show: false,
          position: 'insideRight'
        }
      },
      // itemStyle: {
      //   normal: {
      //     color: new echarts.graphic.LinearGradient(
      //       0, 0, 0, 1,
      //       [
      //         { offset: 0, color: '#9A66E4' },
      //         { offset: 1, color: '#BE3A2B' },
      //       ]
      //     )
      //   }
      // },
    },
  ]
}
let _this
class StackedBarChartSign extends Component {
  static propTypes = {
    data: PropTypes.array,
  }

  static defaultProps = {
    data: [],
  }
  componentDidMount() {
    this.initStackedBarChartSign(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.initStackedBarChartSign(nextProps)
    }
  }

  initStackedBarChartSign(props) {
    const { data } = props
    const name = data.map(_ => _.name)
    const attendance = data.map(_ => _.attendance)
    const vacate = data.map(_ => _.vacate)
    const late = data.map(_ => _.late)
    const absenteeism = data.map(_ => _.absenteeism)
    const option = chartOption
    option.xAxis.data = name
    option.series[0].data = attendance
    option.series[1].data = vacate
    option.series[2].data = late
    option.series[3].data = absenteeism
    _this.refs.stackedBarChartSign.getEchartsInstance().setOption(option)
  }

  render() {
    _this = this
    return (
      <div
        id="stackedBarChartSign"
        style={{
          width: 'calc(100% - 36px)',
          height: 400,
          zIndex: 2,
          position: 'absolute'
        }}
      >
        <ReactEcharts
          ref="stackedBarChartSign"
          option={chartOption}
          style={{ height: 400 }}
        />
      </div>
    )
  }
}

export default StackedBarChartSign