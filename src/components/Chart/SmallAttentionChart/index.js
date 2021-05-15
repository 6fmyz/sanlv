import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'

import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

import tdTheme from '../theme.json'
echarts.registerTheme('tdTheme', tdTheme)


class SmallAttentionChart extends PureComponent {
  static propTypes = {
    chart: PropTypes.array,
    color: PropTypes.array,
    chartId: PropTypes.string,
    style: PropTypes.object,
    type: PropTypes.string,
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
    const { chart, color, type, isShowAverageLine } = this.props
    const lookUp = {
      yAxisIndex: 0,
      name: '抬头率',
      type: 'line',
      data: chart.lookUp,
      symbol: 'none',
      color: 'red',
    }
    const nod = {
      yAxisIndex: 1,
      name: '点头率',
      type: 'bar',
      data: chart.nod,
      color: '#888',
      barMaxWidth: 2,
      animationDelay: function (idx) {
        return idx * 10
      },
    }
    
    const average = {
      yAxisIndex: type === 'lookUp' ? 0 : 1,
      name: '平均值',
      type: 'line',
      data: chart.date && chart.date.length ? '0'.repeat(chart.date.length).split('').map(item => type === 'lookUp' ? 50 : 2) : [],
      symbol: 'none',
      lineStyle: {
        type: 'dashed',
        width: 0.6,
        color: 'rgba(255, 0, 0, 0.8)',
      }
    }
    const series = []
    if (type === 'lookUp') {
      series.push(lookUp)
    } else if (type === 'nod') {
      series.push(nod)
    } else {
      series.push(lookUp)
      series.push(nod)
    }
    if (isShowAverageLine) {
      series.push(average)
    }
    const option = {
      calculable: true,
      xAxis: {
        show: false,
        type: 'category',
        data: chart.date,
      },
      yAxis: [
        {
          show: false,
          type: 'value',
          min: 0,
          max: isShowAverageLine ? 100 : 'dataMax',
        },
        {
          show: false,
          type: 'value',
          min: 0,
          max: function (value) {
            return value.max + 1
          },
        }
      ],
      grid: {
        x: 0,
        y: 10,
        x2: 10,
        y2: 0,
      },
      series: series,
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

export default SmallAttentionChart
