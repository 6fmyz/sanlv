import React from 'react'
import PropTypes from 'prop-types'
import styles from './AreaChart.less'
import createG2 from 'g2-react'
import { Stat } from 'g2'
import _ from 'lodash'
import { NumberMotion } from '../Motion'
const Area = createG2(chart => {
  const data = chart._attrs.data.data
  const color = data[0].color
  chart.source(data, {
    name: {
      range: [0, 1]
    }
  })
  chart.area().position('key*value').color(color)
  chart.tooltip(false)
  chart.axis('value', {
    grid: null
  })
  chart.render()
})

const AreaChart = ({ title, num, unit, chart, color }) => {
  const getCharts = () => {
    const arr = []
    _.map(chart, (value, key) => {
      const obj = {
        key,
        value: parseInt(value, 10),
        color,
      }
      arr.push(obj)
    })
    return arr
  }

  const chartDate = {
    data: getCharts(),
    width: 144,
    height: 48,
    plotCfg: {
      margin: [0, 0, 0, 0],
      border: {
        lineWidth: 0,
      },
      background: {
        lineWidth: 0,
      }
    },
  }
  const lineHeight = { lineHeight: '50px' }
  // if (!chart) {
  //   lineHeight = { lineHeight: '50px' }
  // }
  const width = document.body.client // Width window.screen.width
  const style = () => {
    let s = {
      borderColor: color
    }
    if (width === 1366) {
      s = {
        borderColor: color,
        margin: '10px 15px 10px',
      }
    }
    return s
  }

  return (
    <div className={styles.wrapper} style={width === '1366' ? { borderColor: color, margin: '10px 15px 10px' } : { borderColor: color }}>
      <div className={styles.title}>{title}</div>
      {
        chart &&
          <div className={styles.chartWrapper}>
            <Area
              data={chartDate.data}
              width={chartDate.width}
              height={chartDate.height}
              plotCfg={chartDate.plotCfg}
            />
          </div>
      }
      <div style={lineHeight} className={styles.num}>
        <span>{num}</span>
        {
          unit &&
            <span className={styles.unit}>{unit}</span>
        }
        {
          !unit &&
            <span>%</span>
        }
      </div>
    </div>
  )
}

AreaChart.propTypes = {
  title: PropTypes.string,
  num: PropTypes.number,
  unit: PropTypes.string,
  chart: PropTypes.array,
  color: PropTypes.string,
}

export default AreaChart
