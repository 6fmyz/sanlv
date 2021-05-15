import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import TweenOne from 'rc-tween-one'
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin'
TweenOne.plugins.push(Children)

class NumberMotion extends PureComponent {
  static propTypes = {
    newNumber: PropTypes.number,
    formatMoney: PropTypes.bool,
    floatLength: PropTypes.number,
  }
  static defaultProps = {
    newNumber: 0,
    formatMoney: false,
    floatLength: 0,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: this.props.newNumber,
      animation: null,
      formatMoney: this.props.formatMoney,
      floatLength: this.props.floatLength,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.newNumber !== nextProps.newNumber) {
      this.setState({
        animation: {
          Children: {
            value: nextProps.newNumber,
            floatLength: nextProps.floatLength,
            formatMoney: nextProps.formatMoney,
          },
          duration: 1000,
        }
      })
    }
  }
  render() {
    return (
      <TweenOne
        animation={this.state.animation}>
        {this.state.value}
      </TweenOne>
    )
  }
}
export default NumberMotion