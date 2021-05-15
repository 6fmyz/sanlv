import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './Circle.less'
import { NumberMotion } from '../../../components/Motion'

class CircleSmall extends PureComponent {
  static propTypes = {
    value: PropTypes.number,
    text: PropTypes.string,
    foreground: PropTypes.string,
    bgColor: PropTypes.string,
    count: PropTypes.number,
    maskBgColor: PropTypes.string,
    unit: PropTypes.string,
  }
  static defaultProps = {
    value: 0,
    text: '',
    bgColor: '#BBEEEE',
    foreground: '#19C5C8',
    maskBgColor: '#fff',
    unit: '',
  }

  componentWillMount() {
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    const { value, text, foreground, bgColor, count, maskBgColor, unit } = this.props
    const deg = value * 3.6
    const leftT = deg > 180 ? {
      transform: `rotate(${180}deg)`,
      background: `${bgColor}`,
    } : {
      transform: `rotate(${deg}deg)`,
      background: `${bgColor}`,
    }
    const rightT = deg >= 180 ? {
      transform: `rotate(${deg - 180}deg)`,
      background: `${bgColor}`,
    } : {
      background: `${bgColor}`,
    }
    return (
      <div className={styles.circle} style={{ background: `${foreground}` }}>
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
        <div className={styles.mask} style={{ background: `${maskBgColor}` }}>
          <div className={styles.word}>{text}</div>
          <div className={styles.num}>
            <NumberMotion newNumber={count || 0} />
            <span className={styles.unit}>{unit}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default CircleSmall
