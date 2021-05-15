import React from 'react'
import nationalEmblem from './images/nationalEmblem.png'

import styles from './index.less'

function Copyright() {
  return (
    <div className={styles.copyrightWrap}>
      Copyright ©2018-2021 · 金课坊 ·
      <a target="_blank" rel="noopener noreferrer" href="https://beian.miit.gov.cn">
        鄂ICP备16015292号-7
      </a>
      <img alt="ne" src={nationalEmblem} />
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=42018502000450"
        style={{ paddingLeft: 0 }}
      >
        鄂公网安备 42018502004069号
      </a>
    </div>
  )
}

export default Copyright
