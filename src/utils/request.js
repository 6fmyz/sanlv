import qs from 'qs'
import _ from 'lodash'
import Axios from 'axios'
import { baseURL } from '../config'
import { removeUserInfo } from '../utils'
import {
  message
} from 'antd'

import {
  getTimeStamp
} from './time.js'

const reqConfig = {
  withCredentials: true,
}

Axios.defaults.baseURL = baseURL
Axios.defaults.async = true
Axios.defaults.crossDomain = true

const Request = Axios.create(reqConfig)

const getConfig = () => {
  const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
  return {
    headers: {
      authorization: userInfo ? userInfo.token : '',
    }
  }
}

// const uploadConfig = {
//   onUploadProgress: function(progressEvent) {
//     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
//   }
//   const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
//   return {
//     headers: {
//       authorization: userInfo ? userInfo.token : '',
//     }
//   }
// }

function del(url, data) {
  return Request.delete(url, {
    params: data,
    ...getConfig(),
  })
}

function get(url, data) {
  return Request.get(url, {
    params: data,
    ...getConfig(),
  })
}

function post(url, data) {
  return Request.post(url, { ...data }, getConfig())
}

function put(url, data) {
  return Request.put(url, { ...data }, getConfig())
}

function postFile(url, data) {
  return Request.post(url, data, getConfig())
}

function throwSrvError(resp) {
  if (resp.data) {
    message.error(`[${resp.data.code}] Server error: ${resp.data.msg}`, 5)
  } else {
    message.error(`Server error: ${JSON.stringify(resp)}`, 10)
  }
  return resp
}

function procReqError(err) {
  const resp = err.response
  if (resp.status >= 500) {
    throwSrvError(resp)
  }
  // if (resp.status === 400) {
  //   if (window.location.pathname !== '/user/login') {
  //     throwSrvError(resp)
  //   }
  // }
  if (resp.status === 401) {
    removeUserInfo()
    if (window.location.pathname !== '/user/login') {
      window.location.href = '/user/login'
    }
  }
  const error = new Error(resp.statusText)
  error.resp = resp
  throw error
}

// function checkStatus(resp) {
//   if ((resp.status >= 200) && (resp.status < 300)) {
//     return resp
//   }
//   throwSrvError(resp)
// }

// function checkPermission(resp) {
//   if (resp.data && (resp.data.code === 403)) {
//     return throwSrvError(resp)
//   }
//   return resp
// }

// function checkRedirect(resp) {
//   if (resp.data && (resp.data.code === 302)) {
//     return throwSrvError(resp)
//   }
//   return resp
// }

// function checkCode(resp) {
//   if (resp.data && (resp.data.code !== 0)) {
//     return throwSrvError(resp)
//   }
//   return resp
// }

function procRequest(req) {
  return req
    // .then(checkStatus)
    // .then(checkPermission)
    // .then(checkRedirect)
    // .then(checkCode)
    .then(resp => resp.data)
    .catch(procReqError)
}

export function DelJson(url, data) {
  const _data = data ? _.cloneDeep(data) : {}
  _data._t_ = getTimeStamp()
  return procRequest(del(url, _data))
}

export function GetJson(url, data) {
  const _data = data ? _.cloneDeep(data) : {}
  _data._t_ = getTimeStamp()
  return procRequest(get(url, _data))
}

export function PostJson(url, data) {
  return procRequest(post(url, data))
}

export function PostForm(url, data) {
  return procRequest(post(url, qs.stringify(data)))
}

export function PutJson(url, data) {
  return procRequest(put(url, data))
}
// 导入文件
export function PostFile(url, data) {
  return procRequest(postFile(url, data))
}
