import React from 'react'
import { PropTypes } from 'prop-types'
import { Router, Route, Switch } from 'dva/router'
import { LocaleProvider, Spin } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import dynamic from 'dva/dynamic'
import cloneDeep from 'lodash/cloneDeep'
import { getNavData } from './common/nav'
import { getPlainNode } from './utils/utils'

import styles from './index.less'

dynamic.setDefaultLoadingComponent(() =>
  <Spin size="large" className={styles.globalSpin} />)

function getRouteData(navData, path) {
  if (!navData.some(item => item.layout === path) ||
    !(navData.filter(item => item.layout === path)[0].children)) {
    return null
  }
  const route = cloneDeep(navData.filter(item => item.layout === path)[0])
  const nodeList = getPlainNode(route.children)
  return nodeList
}

function getLayout(navData, path) {
  if (!navData.some(item => item.layout === path) ||
    !(navData.filter(item => item.layout === path)[0].children)) {
    return null
  }
  const route = navData.filter(item => item.layout === path)[0]
  return {
    component: route.component,
    layout: route.layout,
    name: route.name,
    path: route.path,
  }
}

function RouterConfig({ history, app }) {
  const navData = getNavData(app)
  const ClassicLayout = getLayout(navData, 'ClassicLayout').component
  const BasicLayout = getLayout(navData, 'BasicLayout').component
  const passProps = {
    app,
    navData,
    getRouteData: (path) =>
      getRouteData(navData, path)
    ,
  }
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/user" render={props => <ClassicLayout {...props} {...passProps} />} />
          <Route path="/" render={props => <BasicLayout {...props} {...passProps} />} />
        </Switch>
      </Router>
    </LocaleProvider>
  )
}

RouterConfig.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default RouterConfig
