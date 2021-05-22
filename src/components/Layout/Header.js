import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Popover, Avatar, Layout } from 'antd'
import styles from './Header.less'
import Menus from './Menu'
import { config } from '../../utils'

const Header = () => {
  return (
    <div  className={styles.title}>教学效果评价课题集成演示系统</div>
  )
}
// const SubMenu = Menu.SubMenu
// const { Sider } = Layout
// const cssStyle = {
//   dark: {
//     color: '#fff',
//     backgroundColor: '#3e3e3e',
//   },
// }
// const Header = ({
//   user,
//   logout,
//   resetPsd,
//   switchSider,
//   siderFold,
//   isNavbar,
//   menuPopoverVisible,
//   location,
//   switchMenuPopover,
//   navOpenKeys,
//   changeOpenKeys,
//   menu,
//   children,
//   changeTheme,
//   darkTheme,
// }) => {
//   const handleClickMenu = e => {
//     if (e.key === 'resetPsd') {
//       resetPsd()
//     }
//     if (e.key === 'logout') {
//       logout()
//     }
//   }
//   const menusProps = {
//     menu,
//     siderFold: false,
//     darkTheme,
//     isNavbar,
//     handleClickNavMenu: switchMenuPopover,
//     location,
//     navOpenKeys,
//     changeOpenKeys,
//   }
//   const avatar = {
//     size: 'small'
//   }
//   if (user.avatar) {
//     avatar.src = user.avatar
//   } else {
//     avatar.children = user.username[0]
//   }
//   return (
//     // <div className={styles.header} style={darkTheme ? cssStyle.dark : {}}>
//     <div
//       className={styles.header}
//       style={{ background: '#111', color: '#fff' }}>
//       <div className={styles.leftWrapper}>
//         <div className={styles.logo}>
//           <img alt="logo" src={config.logo} />
//           {
//             siderFold ? '' : <span>{config.name}</span>
//           }
//         </div>
//         {
//           // <Menus {...menusProps} />
//         }
//         {
//           // <div className={styles.switchtheme} style={{ lineHeight: '45px' }}>
//           //   <span style={{ marginRight: '10px' }}>
//           //     <Icon type="bulb" />切换主题
//           //   </span>
//           //   <Switch onChange={changeTheme} defaultChecked={darkTheme}
//           // checkedChildren="暗色" unCheckedChildren="亮色" />
//           // </div>
//         }
//       </div>
//       {
//         // <div className={styles.pageTitle}>教务视窗</div>
//       }
//       <div className={styles.rightWrapper}>
//         {
//           <div className={styles.button}>
//             <Icon type="question-circle-o" />
//             帮助
//           </div>
//           // <Icon style={{ marginLeft: '10px', fontSize: '10px' }} type="caret-down" />
//         }
//         <Menu
//           mode="inline"
//           theme={darkTheme ? 'dark' : 'light'}
//           // theme="light"
//           onClick={handleClickMenu}
//         >
//           <SubMenu
//             style={{
//               float: 'right',
//             }}
//             title={
//               <div className={styles.userBox}>
//                 <Avatar {...avatar} />
//                 {user.username}
//               </div>
//             }
//           >
//             <Menu.Item key="resetPsd">
//               <Icon type="key" /> 修改密码
//             </Menu.Item>
//             <Menu.Item key="logout">
//               <Icon type="logout" /> 退出系统
//             </Menu.Item>
//           </SubMenu>
//         </Menu>
//       </div>
//     </div>
//   )
// }

// Header.propTypes = {
//   menu: PropTypes.array,
//   user: PropTypes.object,
//   logout: PropTypes.func,
//   resetPsd: PropTypes.func,
//   switchSider: PropTypes.func,
//   siderFold: PropTypes.bool,
//   isNavbar: PropTypes.bool,
//   menuPopoverVisible: PropTypes.bool,
//   location: PropTypes.object,
//   switchMenuPopover: PropTypes.func,
//   navOpenKeys: PropTypes.array,
//   changeOpenKeys: PropTypes.func,
//   children: PropTypes.element,
//   changeTheme: PropTypes.func,
//   darkTheme: PropTypes.bool,
// }

export default Header
