import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'

import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

import tdTheme from '../theme.json'
echarts.registerTheme('tdTheme', tdTheme)


class SmallBarChart extends PureComponent {
  static propTypes = {
    chart: PropTypes.array,
    chartId: PropTypes.string,
    style: PropTypes.object,
    isShowAverageLine: PropTypes.bool,
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
    const { chart, isShowAverageLine } = this.props
    const option = {
      calculable: true,
      xAxis: {
        show: false,
        type: 'category',
        data: chart.date,
      },
      yAxis: {
        show: false,
        type: 'value',
        max: isShowAverageLine ? function(value) {
          return value.max + 2
        } : 100,
        min: 0,
      },
      grid: {
        x: 0,
        y: 10,
        x2: 10,
        y2: 0,
      },
      series: [
        {
          name: '点头率',
          type: 'bar',
          data: chart.nod,
          color: '#eab60bf7', // '#2B821C',
          barMaxWidth: 2,
          animationDelay: function (idx) {
            return idx * 10
          },
        },
        {
          show: isShowAverageLine,
          name: '平均值',
          type: 'line',
          data: chart.date && chart.date.length ? '0'.repeat(chart.date.length).split('').map(item => 2) : [],
          symbol: 'none',
          lineStyle: {
            type: 'dashed',
            color: 'rgba(234, 182, 11, 0.8)',
            width: 0.6,
          }
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: function (idx) {
        return idx * 5
      },
    }
    const id = this.props.chartId
    const pie = echarts.init(document.getElementById(id), 'tdTheme')
    pie.setOption(option)
  }

  render() {
    return (<div id={this.props.chartId} style={this.props.style} />)
  }
}

export default SmallBarChart
