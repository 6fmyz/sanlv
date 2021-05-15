import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts'
import 'echarts/lib/chart/pie'
import tdTheme from '../theme.json'
echarts.registerTheme('tdTheme', tdTheme)
import styles from './index.less'

class RoseChart extends PureComponent {
  static propTypes = {
    value: PropTypes.object,
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

  componentWillUnmount() {
  }

  initChart() {
    const { value, text, subtext } = this.props
    const option = {
      title: {
        text: `出勤率  (${value.percentage}%)`,
        subtext: '',
        x: 'center',
        y: 20,
        textStyle: {
          color: '#f5f5f5',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      calculable: true,
      // xAxis: {
      //   axisLabel: {
      //     formatter: function (val) {
      //       console.log('------------------', val)
      //     }
      //   }
      // },
      series: [
        {
          name: '出勤情况',
          type: 'pie',
          radius: '60%',
          center: ['25%', '50%'],
          color: [
            '#2575AF',
            '#20A690',
          ],
          data: value.sign,
        },
        {
          name: '缺勤情况',
          type: 'pie',
          radius: '60%',
          // radius: [30, 110],
          center: ['75%', '50%'],
          // roseType: 'area',
          // x: '50%',
          // min: 1,
          // max: 40,
          // sort: 'ascending',
          color: value.unSignColor,
          data: value.unSign,
        }
      ]
    }
    const pie = echarts.init(document.getElementById('rose-pie-chart'), 'tdTheme')
    window.onresize = pie.resize
    pie.setOption(option)
  }

  render() {
    return (<div id="rose-pie-chart" className={styles.rosePieChart} />)
  }
}

export default RoseChart
