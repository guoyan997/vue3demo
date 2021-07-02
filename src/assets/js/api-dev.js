/**
 * @description 模拟接口
 */

import Mock from 'mockjs'
import API from './api'

// 被拦截的 Ajax 请求的响应时间，默认值是'10-100'
Mock.setup({
  timeout: '10-100'
})

// 示例
Mock.mock(new RegExp(API.getIdentifyingCode), 'get', options => {
  // 请求参数
  const requestBody = JSON.parse(options.body || '{}')
  return {
    __statusCode: '1',
    msg: 'Mock测试get请求',
    data: requestBody
  }
})
Mock.mock(API.getIdentifyingCode, 'post', options => {
  // 请求参数
  // const requestBody = JSON.parse(options.body || '{}')
  return {
    __statusCode: '1',
    msg: 'Mock测试post请求',
    data: { IdentifyingCode: '3811587875201136928240', ExpiryTime: '2020-04-26 11:28:56' }
  }
})
