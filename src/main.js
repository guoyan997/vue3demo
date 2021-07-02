import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/**
 * 引入样式
 */
import 'normalize.css' // 样式重置
import './assets/style/global.scss' // 全局样式
/**
 * 引入脚本
 */
// import './assets/js/api-dev' // mock模拟接口，生产环境需要注释掉
import request from './assets/js/request'
// import API from './assets/js/api'
import Mitt from 'mitt'

// 然后在main.js文件里进行引用
import '@/assets/js/core/index'
import common from '@/assets/js/core/config'

/**
 * 扩展Vue
 */
// 全局异常捕获
const errorHandler = (error, vm, info) => {
  // alert('全局异常' + vm + error)
  console.error('*****抛出全局异常******：' + info)
  console.error(vm)
  console.error(error)
}
// Vue.config.errorHandler = errorHandler
// // 用于手动抛出异常
// Vue.prototype.$throw = (error) => errorHandler(error, this, '')
// Vue.prototype.$eventBus = new Vue({}) // 全局事件总线
// Vue.prototype.$request = request

// Vue.config.productionTip = false
// 自动把components/common文件夹的公共组件注册到全局，可以在各个页面使用，不用再单独引入
// Vue.use(common)
let app = null
// const timeNum = 9 * 60 * 1000
// let timer = 0
function initPage () {
  /* eslint-disable no-new */
  app = createApp(App)
  app.use(store).use(router).mount('#app')
  // 自动把components/common文件夹的公共组件注册到全局，可以在各个页面使用，不用再单独引入
  app.use(common)
  app.config.globalProperties.errorHandler = errorHandler
  app.config.globalProperties.$throw = (error) => errorHandler(error, this, '')
  app.config.globalProperties.$eventBus = new Mitt() // 全局事件总线, 这里使用第三方事件总线库, 事务总线$eventBus的函数emit和on是来源于mitt,而不是vue,不需要使用$符号
  app.config.globalProperties.$request = request
  app.config.globalProperties.productionTip = false
}
// async function getIdentifyingCode () {
//   const { __statusCode, data } = await request(API.getIdentifyingCode)
//   if (Object.is(__statusCode, '1')) {
//     if (!app) {
//       initPage()
//     }
//     // 就把数据放到localStorage中，方便使用
//     window.localStorage.setItem('IdentifyingCode', data.IdentifyingCode)
//     window.localStorage.setItem('ExpiryTime', data.ExpiryTime)
//   }
// }
// if (timer) {
//   window.clearInterval(this.timer)
// }
// timer = window.setInterval(getIdentifyingCode, timeNum)
// getIdentifyingCode()
initPage()
