import React, { Component } from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'

import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

import tdTheme from '../theme.json'
echarts.registerTheme('tdTheme', tdTheme)

class AttentionChart extends Component {
  static propTypes = {
    dataSource: PropTypes.object,
    style: PropTypes.object,
  }

  static defaultProps = {
    dataSource: {},
    style: {
      height: 460,
    }
  }

  componentDidMount() {
    this.initLinesChart()
    this.createResize()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataSource !== nextProps.dataSource) {
      this.initLinesChart()
      this.createResize()
    }
  }

  createResize() {
    const e = document.createEvent('Event')
    e.initEvent('resize', true, true)
    window.dispatchEvent(e)
  }

  initLinesChart() {
    const { dataSource } = this.props
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['抬头率/秒', '抬头率/分', '点头频次']
      },
      calculable: true,
      grid: {
        y: 40,
        x: 40,
        y2: 40,
        x2: 50,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: dataSource.date,
        }
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: 100,
          axisLabel: {
            formatter: '{value}%'
          },
          axisLine: {
            lineStyle: {
              color: 'red', // '#C12E33',
              width: 2,
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: ['red'], // ['#C12E33'],
              width: 1,
              type: 'solid'
            }
          }
        },
        {
          type: 'value',
          min: 0,
          max: 6,
          // axisLabel: {
          //   formatter: '{value}%'
          // },
          axisLine: {
            lineStyle: {
              color: '#eab60bf7', // '#2B821C',
              width: 2,
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: ['#eab60bf7'], // ['#2B821C'],
              width: 1,
              type: 'solid'
            }
          }
        }
      ],
      series: [
        {
          yAxisIndex: 0,
          name: '抬头率/秒',
          type: 'line',
          symbol: 'none',
          color: 'red', // '#C12E33',
          data: dataSource.lookUp,
        },
        {
          yAxisIndex: 0,
          name: '抬头率/分',
          type: 'bar',
          barMaxWidth: 5,
          symbol: 'none',
          data: dataSource.nod,
          color: 'red', // '#2B821C',
        },
        {
          yAxisIndex: 1,
          name: '点头频次',
          type: 'bar',
          barMaxWidth: 5,
          symbol: 'none',
          data: dataSource.nodNum,
          color: '#eab60bf7', // '#2B821C',
        }
      ]
    }
    const myChart = echarts.init(document.getElementById('linesChart'), 'tdTheme')
    window.onresize = myChart.resize
    myChart.setOption(option)
  }

  render() {
    return (
      <div id="linesChart" style={this.props.style} />
    )
  }
}

export default AttentionChart