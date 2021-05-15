import {
  gaodeKey
} from '../config'

function xmlHttpGetRequest(url, resolve, inject, data) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = 'json'
  xhr.onload = () => {
    resolve && resolve(data ? { loactionCity: data, weather: xhr.response } : xhr.response)
  }
  xhr.onerror = () => {
    inject && inject(xhr.response)
  }
  xhr.send()
}

export default function () {
  return new Promise((resolve, inject) => {
    xmlHttpGetRequest(`https://restapi.amap.com/v3/ip?key=${gaodeKey}`, resolve, inject)
  }).then((data) => {
    const {
      adcode
    } = data
    return new Promise((resolve, inject) => {
      xmlHttpGetRequest(`https://restapi.amap.com/v3/weather/weatherInfo?key=${gaodeKey}&city=${adcode}`, resolve, inject, data)
    })
  })
}

