import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import echarts from 'echarts'
import 'echarts/lib/chart/pie'
import tdTheme from '../theme.json'
echarts.registerTheme('tdTheme', tdTheme)
import styles from './index.less'
import { NumberMotion } from '../../Motion'

class Circle extends PureComponent {
  static propTypes = {
    value: PropTypes.number,
    text: PropTypes.string,
    foreground: PropTypes.string,
    bgColor: PropTypes.string,
    width: PropTypes.number,
    count: PropTypes.number,
    maskStyle: PropTypes.object,
  }
  static defaultProps = {
    value: 0,
    text: '',
    bgColor: '#BBEEEE',
    foreground: '#19C5C8',
    width: 200,
  }

  render() {
    const { value, text, foreground, bgColor, width, maskStyle } = this.props
    const deg = value * 3.6
    const leftT = deg > 180 ? {
      transform: `rotate(${180}deg)`,
      background: `${bgColor}`,
      width: `${width}px`,
      height: `${width}px`,
    } : {
      transform: `rotate(${deg}deg)`,
      background: `${bgColor}`,
      width: `${width}px`,
      height: `${width}px`,
    }
    const rightT = deg >= 180 ? {
      transform: `rotate(${deg - 180}deg)`,
      background: `${bgColor}`,
      width: `${width}px`,
      height: `${width}px`,
    } : {
      background: `${bgColor}`,
      width: `${width}px`,
      height: `${width}px`,
    }
    const p = {
      width: `${width - 50}px`,
      height: `${width - 50}px`,
      left: `${25}px`,
      top: `${25}px`,
    }
    return (
      <div className={styles.circle} style={{ background: `${foreground}`, width: `${width}px` }}>
        <div className={styles.circle_left}>
          <div
            style={leftT}
            className={styles.left}
          />
        </div>
        <div className={styles.circle_right}>
          <div
            style={rightT}
            className={styles.right}
          />
        </div>
        <div className={styles.mask} style={maskStyle}>
          <div className={styles.word}>{text}</div>
          <div className={styles.num}>
            <NumberMotion newNumber={value || 0} />
            <span className={styles.unit}>%</span>
          </div>
        </div>
      </div>
    )
  }
}

export default Circle
