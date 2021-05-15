import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
const Option = Select.Option
let _this
class SearchSelect extends Component {
  static propTypes = {
    dataSource: PropTypes.array,
    placeholder: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    dataSource: [],
    placeholder: '',
    style: { width: 200 },
  }

  handleChange(value) {
    _this.props.onChange(!value ? null : parseInt(value, 10))
  }

  render() {
    _this = this
    const { style, placeholder, dataSource } = this.props
    const options = dataSource.map(d => <Option key={d.id}>{d.name}</Option>)
    return (
      <Select
        showSearch
        allowClear
        style={style}
        placeholder={placeholder}
        optionFilterProp="children"
        onChange={this.handleChange}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {options}
      </Select>
    )
  }
}
export default SearchSelect