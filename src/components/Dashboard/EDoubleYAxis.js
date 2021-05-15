import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { NumberMotion } from '../Motion'
import styles from './AreaChart.less'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'

import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

import tdTheme from '../Chart/theme.json'
echarts.registerTheme('tdTheme', tdTheme)


class EDoubleYAxis extends PureComponent {
  static propTypes = {
    chart: PropTypes.array,
    color: PropTypes.array,
    chartId: PropTypes.string,
  }

  componentDidMount() {
    this.initChart()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.chartId) {
      this.initChart()
    }
  }

  initChart() {
    const { chart, chartId } = this.props
    const date = []
    const newResources = []
    const courseInteractions = []
    chart.forEach(val => {
      date.push(val.date)
      newResources.push(val.newResources)
      courseInteractions.push(val.courseInteractions)
    })
    const option = {
      calculable: true,
      grid: {
        x: 40,
        // y: 100,
        x2: 40,
        y2: 60,
      },
      legend: {
        show: true,
        data: ['新增课程资源数（个）', '课堂互动数（次）'],
        x: 'center',
        y: 'top',
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: date,
          axisLabel: {
            rotate: 60,
            margin: 10,
            textStyle: {
              color: '#999',
            }
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
          axisLine: {
            lineStyle: {
              color: '#ade1ff',
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: ['#ade1ff'],
              width: 1,
              type: 'solid'
            }
          },
          animationDelay: function (idx) {
            return idx * 10
          },
        },
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#FF4520',
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: ['#FF4520'],
              width: 1,
              type: 'solid'
            }
          },
          animationDelay: function (idx) {
            return idx * 10 + 100
          },
        }
      ],
      series: [
        {
          color: '#afe3ff',
          name: '新增课程资源数（个）',
          type: 'line',
          // animation: false,
          symbol: 'none',
          areaStyle: {
            color: '#afe3ff',
            // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //   offset: 0,
            //   color: 'rgb(74, 144, 226)'
            // }, {
            //   offset: 1,
            //   color: 'rgba(74, 144, 226, 0.2)',
            // }])
          },
          lineStyle: {
            width: 0
          },
          data: newResources
        },
        {
          color: '#FF4520',
          name: '课堂互动数（次）',
          type: 'line',
          yAxisIndex: 1,
          // animation: false,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: '#FF4520',
          },
          data: courseInteractions,
        }
      ],
      // animationEasing: 'elasticOut',
      // animationDelayUpdate: function (idx) {
      //   return idx * 5
      // }
    }
    const pie = echarts.init(document.getElementById(chartId), 'tdTheme')
    pie.setOption(option)
  }

  render() {
    return (<div
      id={this.props.chartId}
      style={{
        position: 'absolute',
        top: 30,
        left: 30,
        right: 30,
        bottom: 30,
      }}
    />)
  }
}

export default EDoubleYAxis
