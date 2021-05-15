import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'dva/router'
import DocumentTitle from 'react-document-title'
import styles from './ClassicLayout.less'

class ClassicLayout extends React.PureComponent {
  static propTypes = {
    location: PropTypes.object,
    getRouteData: PropTypes.func,
  }

  static childContextTypes = {
    location: PropTypes.object,
  }

  getChildContext() {
    const { location } = this.props
    return { location }
  }

  getPageTitle() {
    const { getRouteData, location } = this.props
    const { pathname } = location
    let title = '金课坊'
    getRouteData('ClassicLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - 金课坊`
      }
    })
    return title
  }
  render() {
    const { getRouteData } = this.props
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          {
            getRouteData('ClassicLayout').map(item =>
              (
                <Route
                  exact={item.exact}
                  key={item.path}
                  path={item.path}
                  component={item.component}
                />
              ))
          }
        </div>
      </DocumentTitle>
    )
  }
}

export default ClassicLayout
