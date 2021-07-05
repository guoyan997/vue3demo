/**
 * @description 接口列表
 */
const HOST = process.env.VUE_APP_API_HOST || '' // 根据不同的环境，自动切换接口地址
const HostUrl = HOST + 'requerstInterface/queryInterface/'

const API = {
  // casUrl: HOST + 'validate/TestCall',
  getIdentifyingCode: HOST + 'validate/getIdentifyingCode',
  welcome: {
    getBarData: HostUrl + '31ffda8c2ff1455095e1d4230d3ec294'
  }
}

export default API
