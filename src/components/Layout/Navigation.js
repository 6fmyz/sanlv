import React from 'react'
import PropTypes from 'prop-types'
import Menus from './Menu'
import { Icon, Button } from 'antd'
import styles from './Navigation.less'
import clsx from 'classnames'
const cssStyle = {
  width: {
    width: '200px'
  },
  narrow: {
    width: '80px',
  }
}
class Navigation extends React.Component {

  

  render() {
    const {
      menu,
      darkTheme,
      isNavbar,
      location,
      navOpenKeys,
      changeOpenKeys,
      toggleCollapsed,
      collapsed,
      switchMenuPopover,
      role,
      toFullScreen,
      isAllscreen,
      currentKey,
      handleClickNavMenu,
    } = this.props

    

    // const menusProps = {
    //   menu,
    //   siderFold: false,
    //   darkTheme,
    //   isNavbar,
    //   location,
    //   navOpenKeys,
    //   changeOpenKeys,
    //   inlineCollapsed: collapsed,
    //   toggleCollapsed,
    //   handleClickNavMenu: ,//: switchMenuPopover,
    //   role,
    //   toFullScreen,
    // }
    // , height: 'calc(100% - 96px)'
    return (
      <div id="navigation" className={clsx(styles.navigation, isAllscreen && styles.noHeaderstyle)}>
        {
          <Menus currentKey={currentKey} handleClickNavMenu={handleClickNavMenu} />
        }
        {/* {
          <Button style={collapsed ? cssStyle.narrow : cssStyle.width} onClick={toggleCollapsed} >
            {
            // <span>{collapsed ? '展开' : '收起'}</span>
            // <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
              <Icon type={collapsed ? 'double-right' : 'double-left'} />
            }
          </Button>
        } */}
      </div>
    )
  }
}

Navigation.propTypes = {
  isNavbar: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  menu: PropTypes.array,
  darkTheme: PropTypes.bool,
  changeOpenKeys: PropTypes.func,
  toggleCollapsed: PropTypes.func,
  collapsed: PropTypes.bool,
  role: PropTypes.number,
  toFullScreen: PropTypes.func,
  isAllscreen: PropTypes.bool,
  currentKey: PropTypes.string,
  handleClickNavMenu: PropTypes.func,
}
export default Navigation
