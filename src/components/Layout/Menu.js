import React, {useEffect, useState} from 'react'
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types'
import { Menu, Icon, Button } from 'antd'
import { Link } from 'dva/router'
import { arrayToTree, queryArray } from '../../utils'
import pathToRegexp from 'path-to-regexp'
import lodash from 'lodash'
import styles from './Menu.less'
const departmentId = window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')).departmentId : null
 
class  Menus extends React.Component {

  render () {
    const {path} = this.props;

    return (
      <Menu
        mode="inline"
        onClick={({key})=>this.props.handleClickNavMenu(key)}
        selectedKeys={[ (path.indexOf('v2')!=-1) ? "/v2-course-data-analysis/" : path]}
        // defaultSelectedKeys={'2'}
        className={styles.menu}
      >
        <Menu.Item className={styles.item} key='/'>学科能力与信息素养</Menu.Item>
        <Menu.Item className={styles.item} key="/v2-course-data-analysis/">教学效能评价</Menu.Item>
        <Menu.Item className={styles.item} key='/cognition'>认知负荷检测</Menu.Item>
        <Menu.Item className={styles.item} key='/teachingEnv'>教学环境评测</Menu.Item>
        <Menu.Item className={styles.item} key='/studyProcess'>学习过程评价</Menu.Item>
        
      </Menu>
    )
  }
 


  
}

Menus.propTypes = {
  handleClickNavMenu: PropTypes.func,
  path: PropTypes.string,
  // menu: PropTypes.array,
  // siderFold: PropTypes.bool,
  // darkTheme: PropTypes.bool,
  // location: PropTypes.object,
  // isNavbar: PropTypes.bool,
  // // handleClickNavMenu: PropTypes.func,
  // navOpenKeys: PropTypes.array,
  // changeOpenKeys: PropTypes.func,
  // inlineCollapsed: PropTypes.bool,
  // role: PropTypes.number,
  // toFullScreen: PropTypes.func,
}
export default Menus;
