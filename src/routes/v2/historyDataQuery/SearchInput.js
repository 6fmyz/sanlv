import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
const Option = Select.Option

let timeout
class SearchInput extends Component {
  static propTypes = {
    dataSource: PropTypes.array,
    placeholder: PropTypes.string,
    style: PropTypes.object,
    defaultValue: PropTypes.string,
    onSearch: PropTypes.func,
    onChange: PropTypes.func,
  }
  static defaultProps = {
    dataSource: [],
    placeholder: '',
    style: { width: 200 },
  }

  handleSearch = (value) => {
    if (value !== '') {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      timeout = setTimeout(() => {
        this.props.onSearch(value)
      }, 500)
    }
  }

  handleChange = (value, option) => {
    const v = option ? option.key : null
    this.props.onChange(v)
  }

  render() {
    const { dataSource, placeholder, style, defaultValue } = this.props
    const options = dataSource.map(d => <Option key={d.name}>{d.name}</Option>)
    return (
      <Select
        showSearch
        allowClear
        placeholder={placeholder}
        style={style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={null}
        value={defaultValue}
      >
        {options}
      </Select>
    )
  }
}

export default SearchInput