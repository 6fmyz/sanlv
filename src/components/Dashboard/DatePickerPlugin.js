
import React from 'react'
import PropTypes from 'prop-types'
import { DatePicker } from 'antd'
import moment from 'moment'
import styles from './DatePickerPlugin.less'

class DatePickerPlugin extends React.Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  }
  componentWillMount() {
    this.setState({
      startValue: moment(this.props.defaultStartDate),
      endValue: moment(this.props.defaultEndDate),
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      startValue: moment(nextProps.defaultStartDate),
      endValue: moment(nextProps.defaultEndDate),
    })
  }
  // 更换开始时间
  onStartChange = (date, dateString) => {
    const start = date ? date.format('YYYY-MM-DD') : ''
    this.props.handelStartChange(start, dateString)
    this.fieldDate('startValue', date)
  }

  // 更换结束时间
  onEndChange = (date, dateString) => {
    const end = date ? date.format('YYYY-MM-DD') : ''
    this.props.handelEndChange(end, dateString)
    this.fieldDate('endValue', date)
  }
  // 禁止选择的开始时间
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }
  // 禁止选择的结束时间
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }
  // 设置开始、结束时间
  fieldDate = (field, value) => {
    this.setState({
      [field]: value,
    })
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open })
  }

  render() {
    const { startValue, endValue, endOpen } = this.state
    return (
      <div className={styles.datePickerWrapper}>
        <DatePicker
          disabledDate={this.disabledStartDate}
          format="YYYY-MM-DD"
          value={startValue}
          placeholder="开始时间"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
          allowClear={false}
        />
        <DatePicker
          disabledDate={this.disabledEndDate}
          format="YYYY-MM-DD"
          value={endValue}
          placeholder="结束时间"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
          allowClear={false}
        />
      </div>
    )
  }
}

DatePickerPlugin.propTypes = {
  defaultStartDate: PropTypes.string,
  defaultEndDate: PropTypes.string,
  handelStartChange: PropTypes.func,
  handelEndChange: PropTypes.func,
  style: PropTypes.object,
}

export default DatePickerPlugin