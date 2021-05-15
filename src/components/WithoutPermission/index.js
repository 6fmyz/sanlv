import React from 'react'
import style from './index.less'
import { Button } from 'antd'


function handleGoBack() {
  window.history.back()
}

function WithoutPermission() {
  return (
    <div className={style.wrapper}>
      抱歉，您没有访问此页面的权限!
      <Button type="primary" onClick={handleGoBack}>返回</Button>
    </div>
  )
}


export default WithoutPermission