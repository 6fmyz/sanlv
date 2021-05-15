import React from 'react'
import PropTypes from 'prop-types'
import { Select, Icon, Button } from 'antd'
import styles from './SelectCollege.less'
import _ from 'lodash'
const Option = Select.Option

const SelectCollege = ({
  universityData,
  fstOrgId,
  secOrgId,
  handleCollegeChange,
  handleProfessionChange,
  handelGoDashboard,
  isTeacher,
  isInAccount,
  userDepartmentId,
  style,
}) => {
  const propsStyle = !style ? { color: '#fff' } : style
  const icon = isTeacher ? '' : '/'
  const getSelect = (arr, func) => {
    let page = (null)
    const len = arr.length
    let defaultValue = null
    if (len >= 1) {
      defaultValue = secOrgId ? `${secOrgId}` : null
      const options = _.map(arr, (value, key) => {
        const val = `${value.orgId}`
        const pKey = `p-${key}`
        page = (<Option key={pKey} value={val} >{value.orgName}</Option>)
        return page
      })
      let defaultOption = (<Option key="p-00" value={null} >所有专业</Option>)
      if (len === 1) {
        defaultValue = `${arr[0].orgId}`
        defaultOption = (null)
      }
      page = (
        <Select
          key="0"
          value={defaultValue}
          style={{ minWidth: '160px', ...propsStyle }}
          onChange={value => func(value ? parseInt(value, 10) : value)}
        >
          {defaultOption}
          {options}
        </Select>
      )
    }
    return page
  }
  const getCollegeOption = (college) => {
    let page = (null)
    let defaultValue = null
    if (college.length === 1 && fstOrgId === college[0].orgId) {
      const val = `${college[0].orgId}`
      page = (
        <div className={styles.selectBox}>
          <Select
            defaultValue={college[0].orgName}
            style={{ minWidth: '160px', ...propsStyle }}
            onChange={value => handleCollegeChange(value ? parseInt(value, 10) : value)}
          >
            <Option key="c-01" value={val} >{college[0].orgName}</Option>
          </Select>
          <div className={styles.interval}>{icon}</div>
          {
            college[0].children && getSelect(college[0].children, handleProfessionChange)
          }
        </div>
      )
    } else {
      defaultValue = fstOrgId ? `${fstOrgId}` : null
      defaultValue = userDepartmentId ? `${userDepartmentId}` : defaultValue
      const isTrue = true
      const disabled = userDepartmentId ? isTrue : !isTrue
      const colleges = _.map(college, (value, key) => {
        const val = `${value.orgId}`
        const cKey = `c-${key}`
        const option = (<Option key={cKey} value={val}>{value.orgName}</Option>)
        const children = value.children ? getSelect(value.children, handleProfessionChange) : null
        return { option, children, pid: children ? value.children[0].pid : null }
      })
      const collegesOptions = _.map(colleges, (value) => (
        value.option
      ))
      const children = _.map(colleges, (value) => {
        let childrenSelect = (null)
        if (fstOrgId === value.pid) {
          childrenSelect = value.children
        }
        return childrenSelect
      })
      page = (
        <div className={styles.selectBox}>
          <Select
            disabled={disabled}
            value={defaultValue}
            style={{ minWidth: '160px', ...propsStyle }}
            onChange={value => handleCollegeChange(value ? parseInt(value, 10) : value)}
          >
            <Option key="c-00" value={null} >{isInAccount ? '' : '所有院系'}</Option>
            {collegesOptions}
          </Select>
          <div className={styles.interval}>{icon}</div>
          {
            children &&
              children
          }
        </div>
      )
    }
    return page
  }
  return (
    <div className={styles.selectWrapper} style={propsStyle}>
      <Button
        style={propsStyle}
        className={styles.backBtn}
        onClick={handelGoDashboard}
      >
        {/* {universityData.name} */}
      </Button>
      <div style={propsStyle} className={styles.interval}>{isTeacher ? (<Icon type="right" />) : '/'}</div>
      {/* {
        universityData.college &&
          getCollegeOption(universityData.college)
      } */}
    </div>
  )
}

SelectCollege.propTypes = {
  universityData: PropTypes.object,
  fstOrgId: PropTypes.number,
  secOrgId: PropTypes.number,
  handleCollegeChange: PropTypes.func,
  handleProfessionChange: PropTypes.func,
  handelGoDashboard: PropTypes.func,
  isTeacher: PropTypes.bool,
  isInAccount: PropTypes.bool,
  userDepartmentId: PropTypes.number,
  style: PropTypes.object,
}

export default SelectCollege
