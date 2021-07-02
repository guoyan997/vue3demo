/**
 * @description 接口平台$axiosApi配置，全局调用并
 * 放在JS的文件夹中，在Main.js里引入后全局注册给Vue的原型，
 * Vue.prototype.$axiosApi = axiosApi
 * @examle this.$axiosApi('74ff8f3fds82fsf94fda3',params) 调用
 * @报错处理 处理token过期的处理跟请求报错的处理，其它后端抛出的错误还没处理，
 */
import axios from 'axios'
import qs from 'qs'
let HOST = process.env.VUE_APP_API_HOST || ''
const BASEURL = '/InterfacePlatform/requerstInterface/queryInterface/'
const axiosConfig = {
  method: 'POST',
  // 基础url前缀
  baseURL: '',
  // 请求头信息
  headers: {
    // 'Content-Type': 'application/json;charset=UTF-8',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', // 接口平台的参数接收方式
    'token': 'H22M2IbC24', // 项目上写死的token
    'IdentifyingCode': window.localStorage.getItem('IdentifyingCode') || ''
  },
  // 参数
  // data: {},
  // 设置超时时间
  timeout: 50000,
  // 携带凭证
  withCredentials: true,
  // 返回数据类型
  responseType: 'json'
}
axios.interceptors.request.use(function (config) {
  return config
})
// 响应拦截，重查
axios.defaults.retry = 1 // 重新请求次数
axios.defaults.retryDelay = 1000 // 请求时间间隔
/** 处理时间过期及无token时 始 */
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
      const lateMinute = function (min) { // 返回当前时间min分钟前的时间
        let num = nowTimer.getTime() - (min * 60 * 1000)// 获取min分钟前的总毫秒数
        return new Date(num)
      }
      if (outTimer && idCode && (new Date(outTimer) > lateMinute(-3))) {
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        config.headers.IdentifyingCode = idCode
        return config
      } else {
        // 如果时间戳过期了或者时间戳的过期时间丢失，那么要重新获取时间戳信息
        // console.log('如果时间戳过期或者没取到token，那么就要从新获取时间戳', new Date())
        return axios.post(HOST + '/InterfacePlatform/validate/getIdentifyingCode').then(res => {
          const data = res.data.data
          window.localStorage.setItem('IdentifyingCode', data.IdentifyingCode)
          window.localStorage.setItem('ExpiryTime', data.ExpiryTime)
          config.headers.IdentifyingCode = data.IdentifyingCode
          return config
        })
      }
    }
  },
  err => {
    return Promise.reject(err)
  })
axios.interceptors.response.use(function (res) {
  const URL = res.config.url
  // console.log('res', res)
  const config = res.config
  if (Number(res.data.__statusCode) === 0) {
    let err = res.data.__errorMessage
    let urlArr = URL.split('/')
    let urlSnail = urlArr[urlArr.length - 1]
    if (res.data.__errorMessage.indexOf('当前请求方式为token调用,IDENTIFYING_CODE过期') > -1) {
      localStorage.removeItem('IdentifyingCode')
      localStorage.removeItem('ExpiryTime')
      // console.log('说明了过期', urlSnail, 'res', res)
      return new Promise((resolve, reject) => {
        axios(config).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    } else {
      // vue.prototype.$notify({ type: 'warning', message: err })// 弹出除了token过期的其它后端报错信息
      console.error('报错:' + urlSnail, err)
      // alert(err)
      return res
    }
  }
  return res
}, function axiosRetryInterceptor (err) { // 请求出错时再发送一次请求
  var config = err.config
  if (!config || !config.retry) return Promise.reject(err)
  config.__retryCount = config.__retryCount || 0
  if (config.__retryCount >= config.retry) {
    return Promise.reject(err)
  }
  config.__retryCount += 1
  var backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, config.retryDelay || 1)
  })
  return backoff.then(function () {
    return axios(config)
  })
})
/** 处理时间过期 终 */
const API = {
  // 示例
  axiosApi (url, params = {}, options) {
    const configs = {
      ...axiosConfig,
      url: HOST + BASEURL + url,
      // data: params,
      data: qs.stringify(params), // 接口平台的参数接收方式
      ...options
    }
    if (process.env.VUE_APP_ISMOCK === 'true') { // 如果是mock,根据mock数据与实际数据差异作格式转换
      configs.transformResponse = [function (data) {
        // 对 data 进行转换处理
        let obj = JSON.parse(data)
        obj.data = '{"data":' + JSON.stringify(obj.data) + '}'
        data = obj
        return data
      }]
    }
    return new Promise((resolve, reject) => {
      axios(configs)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
export default API.axiosApi
