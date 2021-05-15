import config from '../config'
import menu from './menu'
import request from './request'
import time from './time'
import classnames from 'classnames'
import { color } from './theme'
import lodash from 'lodash'
import Cookies from 'js-cookie'
import md5 from 'md5'
import JSSHA from 'jssha'
import noSourceIcon from '../images/no-source-icon.png'

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) =>
    args[1].toUpperCase())
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}


/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  const data = lodash.cloneDeep(array)
  const result = []
  const hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    const hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

const authCookieKeys = ['id', 'avatar', 'username', 'email', 'orgId', 'token', 'CIAuthorization', 'userOrgList', 'isAutoLogin']

const setCookie = (userInfo) =>
  lodash(authCookieKeys).forEach((value) => Cookies.set(value, userInfo[value], { path: '/' }))

const removeUserInfo = () => {
  window.localStorage.removeItem('userInfo')
  lodash(authCookieKeys).forEach((value) => Cookies.remove(value, { path: '/' }))
}

const getOrgIds = () => {
  const user = JSON.parse(window.localStorage.getItem('userInfo'))
  const param = {
    collegeOrgId: user ? user.college : null,
    fstOrgId: user ? user.departmentId : null,
    secOrgId: null,
  }
  // if (user) {
  //   console.log('----user----', user)
  //   const orgId = user.college
  //   const { userOrgList } = user
  //   param.collegeOrgId = orgId
  //   const { college } = userOrgList
  //   lodash.forEach(college, (val) => {
  //     if (val.orgId === orgId) {
  //       if (val.level === 0) {
  //         param.collegeOrgId = orgId
  //       }
  //       if (val.level === 1) {
  //         param.collegeOrgId = val.pid
  //         param.fstOrgId = user.departmentId // val.orgId
  //       }
  //       if (val.level === 2) {
  //         param.collegeOrgId = orgId
  //         param.fstOrgId = val.pid
  //         param.secOrgId = val.orgId
  //       }
  //     }
  //   })
  // }
  return param
}

const getParamOrgId = (collegeOrgId, fstOrgId, secOrgId) => {
  let orgId = secOrgId !== null ? secOrgId : fstOrgId
  orgId = orgId !== null ? orgId : collegeOrgId
  return orgId
}

const encryptPassword = password => {
  const { passwordSalt } = config.auth
  return md5(md5(`${passwordSalt}_${password}_${passwordSalt}`))
}

const generateHMAC = (nonce, password) => {
  const shaObj = new JSSHA('SHA-1', 'TEXT')
  shaObj.setHMACKey(password, 'TEXT')
  shaObj.update(nonce)
  return shaObj.getHMAC('HEX')
}

/**
 * @description 绑定事件 on(element, event, handler)
 */
const on = () => {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
}

/**
 * @description 解绑事件 off(element, event, handler)
 */
const off = () => {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
}

const emptyData = () => (
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'Center',
    color: '#ccc',
    marginTop: '-98px',
    marginLeft: '-80px',
    width: '160px',
    height: '200px',
  }}>
    <div>
      <img alt="" src={noSourceIcon} />
      <p>没有数据哟~</p>
    </div>
  </div>
)

const getOrgInfoById = (id, data) => {
  let orgInfo = null
  lodash.forEach(data, item => {
    if (item.id === id) {
      orgInfo = item
    }
  })
  return orgInfo
}

/* 根据包含的请求参数的对象得到包含请求参数的地址 */
const getRequestUrlByObject = (data) => {
  const {
    college,
    campus,
    status,
    isSolved,
    page,
    pageSize,
  } = data
  const items = [
    `${college ? `collegeId=${college}` : ''}`,
    `${campus ? `campusId=${campus}` : ''}`,
    `${status !== 3 ? `status=${status}` : ''}`,
    `${isSolved !== 3 ? `isSolved=${isSolved}` : ''}`,
    `${page - 1 ? `page=${page - 1}` : ''}`,
    `${pageSize !== 10 ? `pageSize=${pageSize}` : ''}`
  ]
  return items.filter((item) => {
    return item !== ''
  }).join('&')
}

/* 比较两个时间的大小 */
/* 时间格式：  hh: mm */
/* 返回值： 开始时间是否大于结束时间 */
const compareTime = (startTime, endTime) => {
  if (!startTime) {
    return true
  }
  if (!endTime) {
    return false
  }
  const [startMinu, startSec] = startTime.split(':')
  const [endMinu, endSec] = endTime.split(':')
  if (startMinu > endMinu) {
    return true
  } else if ((startMinu === endMinu) && (startSec > endSec)) {
    return true
  }
  return false
}

/* 权限管理中每个模块的操作权限名称数组 */
const permisionValue = ['view', 'add', 'edit', 'del', 'export']

module.exports = {
  config,
  menu,
  request,
  color,
  classnames,
  queryURL,
  queryArray,
  arrayToTree,
  time,
  setCookie,
  removeUserInfo,
  getOrgIds,
  getParamOrgId,
  encryptPassword,
  generateHMAC,
  on,
  off,
  emptyData,
  getOrgInfoById,
  getRequestUrlByObject,
  compareTime,
  permisionValue,
}
