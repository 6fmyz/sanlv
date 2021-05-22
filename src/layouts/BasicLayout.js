import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { connect } from 'dva'
import { Route, Redirect, Switch, routerRedux } from 'dva/router'
import { Header, Bread, Footer, styles, Navigation } from '../components/Layout'
import { config, classnames, menu, getOrgIds } from '../utils'
import lodash from 'lodash'
import NProgress from 'nprogress'
import NotFound from '../routes/Exception/404'
import MainPage from  '../routes/v2/index'
import WithoutPermission from '../components/WithoutPermission'
import '../themes/index.less'
import './BasicLayout.less'
import menus from '../utils/menu'
import zipBigDataBackground from './images/zipBigDataBackground.png'

import {
  message
} from 'antd'

const { push } = routerRedux
const { prefix } = config

const noLoadingArray = [
  'v2_bigDataDashBoardIndex/updateRankCourseSing'
]

const scribeF10EventPathname = [
  'bigDataPlatform'
]

class BasicLayout extends React.PureComponent {

  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      isFullscreen: false,
      currentKey: '2'
    }
  }
  handleClickNavMenu = (key) => {
    console.log(11111)
    this.setState({
      currentKey: key
    })
    switch(key){
      case '1':
        this.props.history.push('/')
        break
      case '2':
        this.props.history.push('/v2-course-data-analysis/')
        break
      case '3':
        this.props.history.push('/')
    }
  }

  // 判断当前路由是否允许开启全屏预览
  judgeCurrentPath = (pathname) => {
    // const {
    //   location: {
    //     pathname
    //   }
    // } = this.props
    const pathSplit = pathname.split('/')
    let status = false
    if (pathSplit.length > 1) {
      scribeF10EventPathname.some(path => {
        if (path === pathSplit[1]) {
          status = true
          return true
        }
      })
    }
    return status
  }


  getChildContext() {
    const { location, navData, getRouteData } = this.props
    const routeData = getRouteData('BasicLayout')
    const firstMenuData = navData.reduce((arr, current) => arr.concat(current.children), [])
    const menuData = this.getMenuData(firstMenuData, '')
    const breadcrumbNameMap = {}

    routeData.concat(menuData).forEach((item) => {
      breadcrumbNameMap[item.path] = {
        name: item.name,
        component: item.component,
      }
    })
    return { location, breadcrumbNameMap }
  }


  componentWillMount() {
    if (this.props.app.user) {
      const paramIds = getOrgIds()
      if (paramIds.fstOrgId !== null || paramIds.secOrgId !== null) {
        lodash.remove(menu, (item) => item.level === 0)
      }
      this.props.dispatch({
        type: 'app/setCollegeIds',
        paramIds: paramIds,
      })
    }
    this.props.dispatch({ type: 'app/setCollapsedStatus', param: { collapsed: !this.props.app.collapsed } })
  }

  componentDidMount() {
    const {
      location: {
        pathname
      }
    } = this.props
    // 全屏状态发生变化时，修改状态
    const arr = ['', 'webkit', 'moz', 'MS']
    arr.forEach(item => {
      this.wrapper.addEventListener(`${item}fullscreenchange`, () => {
        this.setState({
          isFullscreen: !this.state.isFullscreen
        })
      })
    })
    this.isAllscreen = this.judgeCurrentPath(pathname)
    if (this.isAllscreen) {
      window.addEventListener('keydown', this.handleKeydownEvent)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.app.logoutSuccess !== nextProps.app.logoutSuccess
    && nextProps.app.logoutSuccess) {
      window.location.href = '/user/login'
    }
    if (!this.props.loading.global && nextProps.loading.global &&
      !this.setNoLoadingEffects(noLoadingArray, nextProps.loading)) {
      NProgress.start()
    } else if (this.props.loading.global && !nextProps.loading.global) {
      NProgress.done()
    }

    if (this.props.location.pathname !== nextProps.location.pathname) {
      const pathnameStatus = this.judgeCurrentPath(this.props.location.pathname)
      const nextPathnameStatus = this.judgeCurrentPath(nextProps.location.pathname)
      if (!pathnameStatus && nextPathnameStatus) { // 路由变化进入全屏状态
        this.isAllscreen = true
        window.addEventListener('keydown', this.handleKeydownEvent)
      }
      if (pathnameStatus && !nextPathnameStatus) {  // 路哟变化退出全屏状态
        this.isAllscreen && this.triggerExitFullScreen()
        this.isAllscreen = false
        window.removeEventListener('keydown', this.handleKeydownEvent)
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isFullscreen && !this.state.isFullscreen && this.judgeCurrentPath(this.props.location.pathname)) {
      message.info('按F10键进入全屏模式', 1)
    }
  }


  // 配置不需要接口loading的effects
  setNoLoadingEffects = (data, loading) => {
    const status = data && data.some(item => {
      return loading.effects[`${item}`]
    })
    return status
  }

  getMenuData = (data, parentPath) => {
    let arr = []
    data.forEach((item) => {
      if (item.children) {
        arr.push({ path: `${parentPath}/${item.path}`, name: item.name })
        arr = arr.concat(this.getMenuData(item.children, `${parentPath}/${item.path}`))
      }
    })
    return arr
  }

  getPageTitle() {
    const { location, getRouteData } = this.props
    const { pathname } = location
    let title = '教学效果评价课题集成演示系统'
    getRouteData('BasicLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - 教学效果评价课题集成演示系统`
      }
    })
    return title
  }

  /* 根据权限过滤路由 */
  getRolePermissionRoutes = () => {
    const { getRouteData, app } = this.props
    const resultRoutes = []
    const nodeList = getRouteData('BasicLayout')
    nodeList.forEach(item => {
      const rules = app.user ? app.user.role.rules : []
      const currentModules = menus.filter(menuItem => { // 当前路由对应的权限配置中的模块id，存在则检查模块的查看权限
        return menuItem.router === `/${item.path.split('/')[1]}`
      })
      const currentModuleId = (currentModules && currentModules.length) > 0 ? currentModules[0].id : null
      if (currentModuleId) {
        const reuleFilter = (rules && rules.length > 0) ? (rules.filter(rule => {
          return rule.moduleId === currentModuleId
        })[0] || { view: 0 }) : {
          view: 1,
        }
        if (reuleFilter.view) {
          resultRoutes.push(
            <Route
              exact={item.exact}
              key={item.path}
              path={item.path}
              // component={item.component}
              render={(props) => <item.component {...props} childrenRoutes={item.children}/>}
              // childrenRoutes={item.children}
            />
          )
        } else {
          resultRoutes.push(
            <Route
              exact={item.exact}
              key={item.path}
              path={item.path}
              component={WithoutPermission}
            />
          )
        }
      } else {
        resultRoutes.push(
          <Route
            exact={item.exact}
            key={item.path}
            path={item.path}
            component={item.component}
          />
        )
      }
    }
    )
    return resultRoutes
  }

  handleKeydownEvent = (e) => {
    // 121 F10键 ； 122 F11键
    if (e.keyCode === 121 && !this.state.isFullscreen) {
      this.toFullScreen()
    }
    if (e.keyCode === 122) {
      e.preventDefault()
    }
  }

  toggleCollapsed = () => {
    // this.setState({
    //   collapsed: !this.state.collapsed,
    // })
    this.props.dispatch({ type: 'app/setCollapsedStatus', param: { collapsed: !this.props.app.collapsed } })
  }

  // 进入首页的全屏状态
  toIndexFullScreen = () => {
    this.toFullScreen()
    this.props.dispatch(push('/bigDataPlatform/v2-bigDataDashBoard'))
  }

  // 触发全屏
  toFullScreen = () => {
    if (this.wrapper) {
      const element = this.wrapper || document.documentElement
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    }
  }

  // 退出全屏
  triggerExitFullScreen = () => {
    if (this.state.isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.mozExitFullscreen) {
        document.mozExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
  }


  render() {
    const { getRouteData, location, dispatch, app } = this.props
    const { user, siderFold, darkTheme, isNavbar, menuPopoverVisible, navOpenKeys } = app
    const {
      isFullscreen
    } = this.state
    const headerProps = {
      menu,
      user,
      siderFold,
      location,
      isNavbar,
      menuPopoverVisible,
      navOpenKeys,
      switchMenuPopover(active) {
        dispatch({ type: 'app/switchMenuPopver' })
      },
      logout() {
        dispatch({ type: 'app/logout' })
      },
      resetPsd() {
        dispatch(push('/user/resetPassword'))
      },
      switchSider() {
        dispatch({ type: 'app/switchSider' })
      },
      // changeOpenKeys(openKeys) {
      //   dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
      // },
      darkTheme,
      changeTheme() {
        dispatch({ type: 'app/switchTheme' })
      },
      changeOpenKeys(openKeys) {
        localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
        dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
      },
    }

    const siderProps = {
      menu,
      siderFold,
      darkTheme,
      location,
      navOpenKeys,
      changeTheme() {
        dispatch({ type: 'app/switchTheme' })
      },
      changeOpenKeys(openKeys) {
        localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
        dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
      },
    }

    const breadProps = {
      menu,
    }

    const { iconFontJS, iconFontCSS, logo } = config
    const isAllscreen = this.judgeCurrentPath(location.pathname)
    const navigationProps = {
      ...headerProps,
      collapsed: this.props.app.collapsed,
      toggleCollapsed: this.toggleCollapsed,
      role: user && user.role ? user.role : null,
      toFullScreen: this.toIndexFullScreen,
      isAllscreen,
      currentKey: this.state.currentKey,
      handleClickNavMenu: this.handleClickNavMenu,
    }
    return (
      <div>
        <Helmet>
          <title>{this.getPageTitle()}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href={logo} type="image/x-icon" />
          {iconFontJS && <script src={iconFontJS} />}
          {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
        </Helmet>
        <div
          className={
            classnames(styles.layout,
              { [styles.fold]: isNavbar ? false : siderFold },
              { [styles.withnavbar]: isNavbar })
          }
        >
          {
            /*
            !isNavbar ? <aside className={classnames(styles.sider, { [styles.light]: !darkTheme })}>
              <Sider {...siderProps} />
            </aside> : ''
            */
          }
          <div className={styles.main}>
            {
              // <LogoMotioin />
              <Header {...headerProps}>
                  <Bread {...breadProps} location={location} />
                </Header>
            }
            {
              user && !isAllscreen &&
                <Header {...headerProps}>
                  <Bread {...breadProps} location={location} />
                </Header>
            }
            {
              
              <Navigation {...navigationProps} />
              // `url(${bgStar}) top center no-repeat #111`
            }
            <div
              // style={{ background: `${!isAllscreen ? '#3A3C40' : ''}`, backgroundImage: `${isAllscreen ? `url(${zipBigDataBackground})` : ''}` }}
              className={
                classnames(
                  { [styles.container]: !this.props.app.collapsed && !isAllscreen },
                  { [styles.marginNarrow]: this.props.app.collapsed && !isAllscreen },
                  { [styles.insideAllScreen]: isAllscreen && this.props.app.collapsed },
                  {
                    [styles.insideAllScreenExpand]: isAllscreen && !this.props.app.collapsed
                  },
                  {
                    [styles.fullScreen]: isFullscreen
                  }
                  )
                }
              ref={(node) => { this.wrapper = node }}
            >
              {
                // <div
                //   style={this.state.collapsed ? {} : { width: 'calc(100vw - 255px)' }}
                //   className={styles.contentPlanetWapper}
                // >
                //   <div className={styles.contentPlanet}>
                //     <div className={styles.gxtBall}>
                //       <em><div className={styles.bgImg} style={{ background: `url(${planet}) left top no-repeat` }} /></em>
                //       <span><div className={styles.bgImg} style={{ background: `url(${planet}) left -125px no-repeat` }} /></span>
                //     </div>
                //     <div className={styles.pathway}>
                //       <div className={styles.contentPathway}>
                //         <div>
                //           <div className={styles.boxTransform} />
                //         </div>
                //         <div><div /></div>
                //         <div><div /></div>
                //       </div>
                //     </div>
                //   </div>
                // </div>
              }
              <div className={isAllscreen ? styles.allScreenContent : styles.content}>
                <Switch>
                  {
                    this.getRolePermissionRoutes()
                  }
                  <Redirect exact from="/" to="/v2-course-data-analysis/" />
                  {/* <Route component={NotFound} /> */}
                </Switch>
              </div>
            </div>
            {/* {!isAllscreen && <Footer />} */}
          </div>
        </div>
      </div>
    )
  }
}

BasicLayout.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
  getRouteData: PropTypes.func,
  navData: PropTypes.array,
}

export default connect(({ app, loading }) => ({ app, loading }))(BasicLayout)
