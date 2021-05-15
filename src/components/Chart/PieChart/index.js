import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts'
import 'echarts/lib/chart/pie'
import tdTheme from '../theme.json'
echarts.registerTheme('tdTheme', tdTheme)
import styles from './index.less'

class PieChart extends PureComponent {
  static propTypes = {
    value: PropTypes.array,
    text: PropTypes.string,
    subtext: PropTypes.string,
  }
  static defaultProps = {
    value: [],
    text: '',
    subtext: '',
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.initChart()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.initChart()
    }
  }

  initChart() {
    const { value, text, subtext } = this.props
    const legend = value.map(_ => _.name)
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: legend,
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: value,
        }
      ]
    }
    const pie = echarts.init(document.getElementById('chart-pie'), 'tdTheme')
    pie.setOption(option)
  }

  render() {
    return (<div id="chart-pie" className={styles.chartPie}>大西瓜</div>)
  }
}

export default PieChart
