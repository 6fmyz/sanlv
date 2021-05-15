import React from 'react'
import { Spin } from 'antd'
const cssStyle = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0,0,0,0.65)',
    zIndex: '2',
  }
}
const MyLoading = () => (<div style={cssStyle.wrapper}><Spin /></div>)

export default MyLoading
