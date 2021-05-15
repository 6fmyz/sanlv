import React, { Component } from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'

import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

import tdTheme from '../theme.json'
echarts.registerTheme('tdTheme', tdTheme)

class EchartsTest extends Component {
  static propTypes = {
    dataSource: PropTypes.array,
  }

  static defaultProps = {
    dataSource: [],
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataSource !== nextProps.dataSource) {
      this.initLineAndBar()
    }
  }

  initLineAndBar() {
    const { dataSource } = this.props
    const xAxisData = dataSource.map(_ => _.name)
    const series0 = dataSource.map(_ => _.value)
    const series1 = dataSource.map(_ => _.rate)
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['数量', '占比']
      },
      grid: {
        y: 50,
        x: 40,
        y2: 40,
        x2: 50,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisPointer: {
            type: 'shadow'
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: ['#ddd'],
              width: 1,
              type: 'solid'
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          axisLabel: {
            formatter: '{value}'
          },
          axisLine: {
            lineStyle: {
              color: '#188df0',
              width: 2,
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: ['#188df0'],
              width: 1,
              type: 'solid'
            }
          }
        },
        {
          type: 'value',
          min: 0,
          axisLabel: {
            formatter: '{value} %'
          },
          axisLine: {
            lineStyle: {
              color: '#E64D47',
              width: 2,
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: ['#E64D47'],
              width: 1,
              type: 'solid'
            }
          }
        }
      ],
      series: [
        {
          name: '数量',
          type: 'bar',
          barMaxWidth: 50,
          data: series0,
          animationDelay: function (idx) {
            return idx * 10
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: 'rgba(62, 128, 245, 0.5)' },
                ]
              )
            }
            // emphasis: {
            //   color: new echarts.graphic.LinearGradient(
            //     0, 0, 0, 1,
            //     [
            //       { offset: 0, color: '#2378f7' },
            //       { offset: 0.7, color: '#2378f7' },
            //       { offset: 1, color: '#83bff6' }
            //     ]
            //   )
            // }
          },
        },
        {
          name: '占比',
          type: 'line',
          yAxisIndex: 1,
          data: series1,
          animationDelay: function (idx) {
            return idx * 10 + 100
          },
          color: '#E64D47',
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: function (idx) {
        return idx * 5
      }
    }
    const myChart = echarts.init(document.getElementById('lineBarChart'), 'tdTheme')
    window.onresize = myChart.resize
    myChart.setOption(option)
  }

  render() {
    return (
      <div id="lineBarChart" style={{ width: '100%', height: 360 }} />
    )
  }
}

export default EchartsTest