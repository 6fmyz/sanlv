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


class EAreaChart extends PureComponent {
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
    const { chart, color } = this.props
    const option = {
      calculable: true,
      xAxis: {
        show: false,
        type: 'category',
        boundaryGap: false,
      },
      yAxis: {
        show: false,
        type: 'value',
        boundaryGap: [0, '100%'],
      },
      grid: {
        x: 0,
        y: 0,
        x2: 0,
        y2: 0,
      },
      series: [
        {
          name: '',
          type: 'line',
          smooth: false,
          symbol: 'none',
          sampling: 'average',
          lineStyle: {
            width: 0
          },
          itemStyle: {
            color: color ? color[1] : 'rgba(237, 150, 134)',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: color ? color[0] : 'rgb(255, 70, 131)'
            }, {
              offset: 1,
              color: color[1],
            }])
          },
          data: chart,
        },
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
    return (<div id={this.props.chartId} className={styles.chartWrapper} />)
  }
}

export default EAreaChart
