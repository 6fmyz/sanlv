import React from 'react'
import { Icon } from 'antd'
import styles from './index.less'

const Error = () => <div className="content-inner">
  <div className={styles.error}>
    <Icon type="frown-o" />
    <h1>资源未找到</h1>
    <h2>404</h2>
  </div>
</div>

export default Error
