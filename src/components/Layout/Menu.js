import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Button } from 'antd'
import { Link } from 'dva/router'
import { arrayToTree, queryArray } from '../../utils'
import pathToRegexp from 'path-to-regexp'
import lodash from 'lodash'
const departmentId = window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')).departmentId : null

const Menus = ({
  siderFold,
  darkTheme,
  location,
  handleClickNavMenu,
  navOpenKeys,
  changeOpenKeys,
  menu,
  inlineCollapsed,
  role,
  toFullScreen,
}) => {
  // 权限结构
  const menuTree = []
  if (role && role.rules) {
    const {
      rules
    } = role
    const rulesIds = []
    rules && rules.length !== 0 && rules.forEach(item => { // 所有的可访问的二级模块ids
      if (item.view) {
        rulesIds.push(item.moduleId)
      }
    })
    const firstModuleIds = new Set()
    const secondModules = {}
    menu.forEach(item => {
      let status = true
      if (role) {
        status = rulesIds.indexOf(item.id) > -1
      }
      if (status) {
        if (item.mpid) {
          firstModuleIds.add(item.mpid)
          if (Array.isArray(secondModules[`${item.mpid}`])) {
            secondModules[`${item.mpid}`].push(item)
          } else {
            secondModules[`${item.mpid}`] = [item]
          }
        } else {
          firstModuleIds.add(item.id)
        }
      }
    })
    menu.forEach(item => {
      if (Array.from(firstModuleIds).indexOf(item.id) > -1) {
        menuTree.push({
          ...item,
          children: secondModules[`${item.id}`] || null
        })
      }
    })
  }

  // const roleTree = menu.filter(item => {
  //   return Array.from(firstModuleIds).indexOf(item.id) > -1
  // }).concat(result)
  // 生成树状
  // const menuTree = arrayToTree(roleTree.filter(_ => _.mpid !== -1), 'id', 'mpid')
  // console.log(menuTree)
  const levelMap = {}

  // 递归生成菜单
  const getMenus = (menuTreeN, siderFoldN) =>
    menuTreeN.map(item => {
      if (item.children) {
        if (item.mpid) {
          levelMap[item.id] = item.mpid
        }
        return (
          <Menu.SubMenu
            key={item.id}
            title={
              <span>
                {item.icon && <Icon type={item.icon} />}
                <span>{(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}</span>
              </span>
            }
          >
            {getMenus(item.children, siderFoldN)}
          </Menu.SubMenu>
        )
      }
      if (item.id === 22) {
        return (
          <Menu.Item key={item.id}>
            <div onClick={toFullScreen}>
              {item.icon && <Icon type={item.icon} />}
              <span>{(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}</span>
            </div>
          </Menu.Item>
        )
      }
      if (item.id === 28 && departmentId) {
        return (
          <Menu.Item key={item.id}>
            <Link to={`${item.departmentRouter}${departmentId}`}>
              {item.icon && <Icon type={item.icon} />}
              <span>{(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}</span>
            </Link>
          </Menu.Item>
        )
      }
      return (
        <Menu.Item key={item.id}>
          <Link to={item.router}>
            {item.icon && <Icon type={item.icon} />}
            <span>{(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}</span>
          </Link>
        </Menu.Item>
      )
    })
  const menuItems = getMenus(menuTree, false)

  // 保持选中
  const getAncestorKeys = (key) => {
    const map = {}
    const getParent = (index) => {
      const result = [String(levelMap[index])]
      if (levelMap[result[0]]) {
        result.unshift(getParent(result[0])[0])
      }
      return result
    }
    for (const index in levelMap) {
      if ({}.hasOwnProperty.call(levelMap, index)) {
        map[index] = getParent(index)
      }
    }
    return map[key] || []
  }

  const onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => !(navOpenKeys.indexOf(key) > -1))
    const latestCloseKey = navOpenKeys.find(key => !(openKeys.indexOf(key) > -1))
    let nextOpenKeys = []
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey)
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey)
    }
    changeOpenKeys(nextOpenKeys)
  }

  const menuProps = !siderFold ? {
    onOpenChange,
    openKeys: navOpenKeys,
  } : {}


  // 寻找选中路由
  let currentMenu
  let defaultSelectedKeys
  for (const item of menu) {
    if (item.router && pathToRegexp(item.router).exec(location.pathname)) {
      currentMenu = item
      break
    }
  }
  const getPathArray = (array, current, pid, id) => {
    const result = [String(current[id])]
    const getPath = (item) => {
      if (item && item[pid]) {
        result.unshift(String(item[pid]))
        getPath(queryArray(array, item[pid], id))
      }
    }
    getPath(current)
    return result
  }
  if (currentMenu) {
    defaultSelectedKeys = getPathArray(menu, currentMenu, 'mpid', 'id')
  }
  if (!defaultSelectedKeys) {
    lodash.forEach(menu, (val) => {
      const url = location.pathname
      if (location.pathname.indexOf('dashboard') > -1) {
        defaultSelectedKeys = ['1']
      } else if (location.pathname.indexOf('v2-courseInfo') > -1) {
        defaultSelectedKeys = ['13']
      } else if (location.pathname.indexOf('v2-student-management') > -1) {
        defaultSelectedKeys = ['12']
      } else if (url.indexOf('v2-teaching-analysis') > -1) {
        defaultSelectedKeys = ['2']
      } else if (url.indexOf('v2-attendance-analysis') > -1) {
        defaultSelectedKeys = ['4']
      } else if (url.indexOf('v2-history-data-query') > -1) {
        defaultSelectedKeys = ['8']
      }
    })
  }
  // mode={'horizontal' /*siderFold ? 'vertical' : 'inline'*/}
  return (
    <Menu
      {...menuProps}
      selectedKeys={defaultSelectedKeys}
      mode="inline"
      theme={darkTheme ? 'dark' : 'light'}
      onClick={handleClickNavMenu}
      onSelect={handleClickNavMenu}
      defaultSelectedKeys={defaultSelectedKeys}
      inlineCollapsed={inlineCollapsed}
    >
      {menuItems}
    </Menu>
  )
}

Menus.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  location: PropTypes.object,
  isNavbar: PropTypes.bool,
  handleClickNavMenu: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
  inlineCollapsed: PropTypes.bool,
  role: PropTypes.number,
  toFullScreen: PropTypes.func,
}

export default Menus
