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

const echartOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  color: [
    '#2575AF',
    '#20A690',
    '#9EB150',
    '#E89722',
    '#BE3A2B',
    '#593549',
    '#888',
  ],
  legend: {
    data: ['签到', '答题', '点答', '课件', '互评', '讨论', '作业'],
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
  series: [
    {
      name: '签到',
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
      //         { offset: 0, color: '#20A690' },
      //         { offset: 1, color: '#2575AF' },
      //       ]
      //     )
      //   }
      // },
    },
    {
      name: '答题',
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
      //         { offset: 1, color: '#20A690' },
      //       ]
      //     )
      //   }
      // },
    },
    {
      name: '点答',
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
      //         { offset: 1, color: '#9EB150' },
      //       ]
      //     )
      //   }
      // },
    },
    {
      name: '课件',
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
      //         { offset: 1, color: '#E89722' },
      //       ]
      //     )
      //   }
      // },
    },
    {
      name: '互评',
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
      //         { offset: 0, color: '#593549' },
      //         { offset: 1, color: '#BE3A2B' },
      //       ]
      //     )
      //   }
      // },
    },
    {
      name: '讨论',
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
      //         { offset: 0, color: '#593549' },
      //       ]
      //     )
      //   }
      // },
    },
    {
      name: '作业',
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
      //         { offset: 0, color: '#593549' },
      //       ]
      //     )
      //   }
      // },
    },
  ]
}
let _this
class StackedBarChart extends Component {
  static propTypes = {
    data: PropTypes.array,
  }

  static defaultProps = {
    data: [],
  }
  componentDidMount() {
    this.initChartData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.initChartData(nextProps)
    }
  }

  initChartData(props) {
    const { data } = props
    const name = data.map(_ => _.name)
    const sign = data.map(_ => _.sign)
    const answer = data.map(_ => _.answer)
    const dianda = data.map(_ => _.dianda)
    const courseware = data.map(_ => _.courseware)
    const assessment = data.map(_ => _.assessment)
    const discussion = data.map(_ => _.discussion)
    const homework = data.map(_ => _.homework)
    const option = echartOption
    option.xAxis.data = name
    option.series[0].data = sign
    option.series[1].data = answer
    option.series[2].data = dianda
    option.series[3].data = courseware
    option.series[4].data = assessment
    option.series[5].data = discussion
    option.series[6].data = homework
    _this.refs.stackedBarChart.getEchartsInstance().setOption(option)
  }

  render() {
    _this = this
    return (
      <div id="stackedBarChart" style={{ width: '100%', height: 400 }}>
        <ReactEcharts
          ref="stackedBarChart"
          option={echartOption}
          style={{ height: 400 }}
        />
      </div>
    )
  }
}

export default StackedBarChart