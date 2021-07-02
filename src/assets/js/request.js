/**
 * @description 接口
 */
import axios from 'axios'
import qs from 'qs'
import { weapon } from './core/weapon/index.js'
import API from './api'
const { stringToDate } = weapon
const axiosConfig = {
  method: 'post',
  // 基础url前缀
  baseURL: '',
  // 请求头信息
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', // 接口平台默认使用表单格式数据提交参数
    'token': '123123', // 接口平台需要的token值，有的需要写死，有的需要是动态值，根据项目情况而定
    'IdentifyingCode': window.localStorage.getItem('IdentifyingCode') // 时间戳，接口平台验证信息，需要动态获取，定时刷新
  },
  // 参数
  data: {},
  // 设置超时时间
  timeout: 10000,
  // 携带凭证
  withCredentials: true,
  // 返回数据类型
  responseType: 'json'
}
// 利用时间戳查询接口平台，并判断时间戳过期时间，进行重新查询
axios.interceptors.request.use(
  config => {
    const url = config.url
    if (url.indexOf('getIdentifyingCode') > -1) {
      // 以上接口直接放过，不需要添加时间戳
      return config
    } else {
      // 判断时间戳是否过期
      const idCode = window.localStorage.getItem('IdentifyingCode')
      const outTimer = window.localStorage.getItem('ExpiryTime')
      const nowTimer = new Date()
      if (outTimer) {
        // const beyonedTime = stringToDate(outTimer) - nowTimer
        // 如果时间戳过期时间大于现在的时间，那么发送请求，
        if (stringToDate(outTimer) > nowTimer) {
          if (idCode) {
            // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
            config.headers.IdentifyingCode = idCode
          }
          return config
        } else {
          // 如果时间戳过期了，那么就要从新获取时间戳
          return new Promise((resolve, reject) => {
            axios.post(API.getIdentifyingCode).then(res => {
              const data = res.data.data
              window.localStorage.setItem('IdentifyingCode', data.IdentifyingCode)
              window.localStorage.setItem('ExpiryTime', data.ExpiryTime)
              resolve(config)
            }).catch(err => { reject(err) })
          })
        }
      } else {
        // 如果时间戳的过期时间丢失，那么要重新获取时间戳信息
        return new Promise((resolve, reject) => {
          axios.post(API.getIdentifyingCode).then(res => {
            const data = res.data.data
            window.localStorage.setItem('IdentifyingCode', data.IdentifyingCode)
            window.localStorage.setItem('ExpiryTime', data.ExpiryTime)
            resolve(config)
          }).catch(err => { reject(err) })
        })
      }
    }
  },
  err => {
    return Promise.reject(err)
  })

// 响应拦截，重查
axios.defaults.retry = 1 // 重新请求次数
axios.defaults.retryDelay = 1000 // 请求时间间隔

// 当返回结果，提示时间戳过期，就重新查询，重新查询回触发request拦截器，添加最新的时间戳
axios.interceptors.response.use((response) => {
  const config = response ? response.config : null
  if (response && response.data && response.data.hasOwnProperty('code') && response.data.code === '空指针异常') {
    if (!config || !config.retry) {
      return Promise.reject(response).catch(function (err) {
        console.log('catch:', err)
      })
    }
    // 说明接口出了问题，需要重新查询
    config.__retryCount = config.__retryCount || 0
    if (config.__retryCount >= config.retry) {
      // Reject with the error
      return Promise.reject(response).catch(function (err) {
        console.log('catch:', err)
      })
    }
    config.__retryCount += 1
    const backoff = new Promise(function (resolve) {
      setTimeout(() => {
        resolve()
      }, config.retryDelay || 1)
    })
    return backoff.then(function () {
      return axios(config)
    })
  }
  // 请求返回时
  if (response && response.data && response.data.hasOwnProperty('__statusCode')) {
    const status = response.data.__statusCode
    const errorMessage = response.data.__errorMessage
    const config = response.config
    if (status === '0' && (errorMessage.indexOf('IDENTIFYING_CODE过期') > -1)) {
      // 说明时间戳已经过期
      window.localStorage.removeItem('IdentifyingCode')
      window.localStorage.removeItem('ExpiryTime')
      return new Promise((resolve, reject) => {
        axios(config).then(res => {
          resolve(res)
          // return res
        }).catch(err => {
          reject(err)
        })
      })
    } else if (status === '0' && (errorMessage.indexOf('空指针异常') > -1)) {
      // 说明有问题，需要从新查询
      if (!config || !config.retry) {
        return Promise.reject(response).catch(function (err) {
          console.log('catch:', err)
        })
      }
      // 说明接口出了问题，需要重新查询
      config.__retryCount = config.__retryCount || 0
      if (config.__retryCount >= config.retry) {
        return Promise.reject(response).catch(function (err) {
          console.log('catch:', err)
        })
      }
      config.__retryCount += 1
      const backoff = new Promise(function (resolve) {
        setTimeout(() => {
          resolve()
        }, config.retryDelay || 1)
      })
      return backoff.then(function () {
        return axios(config)
      })
    } else if (status === '1') {
      // 说明一切正常
      return response
    }
  } else {
    return response
  }
}, function axiosRetryInterceptor (err) {
  // 当请求发生错误时，进行重新请求
  var config = err.config
  // If config does not exist or the retry option is not set, reject
  if (!config || !config.retry) return Promise.reject(err)
  // Set the variable for keeping track of the retry count
  config.__retryCount = config.__retryCount || 0
  // Check if we've maxed out the total number of retries
  if (config.__retryCount >= config.retry) {
    // Reject with the error
    return Promise.reject(err)
  }
  // Increase the retry count
  config.__retryCount += 1
  // Create new promise to handle exponential backoff
  var backoff = new Promise(function (resolve) {
    setTimeout(() => {
      resolve()
    }, config.retryDelay || 1)
  })
  // Return the promise in which recalls axios to retry the request
  return backoff.then(function () {
    return axios(config)
  })
})
// 示例
function request (url, params = {}, options = {}) {
  const configs = {
    ...axiosConfig,
    url,
    data: qs.stringify(params),
    ...options
  }
  return new Promise((resolve, reject) => {
    axios(configs)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
        this.$throw(err)
      })
  })
}

export default request
