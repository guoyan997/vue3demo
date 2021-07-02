// 自动注册全局组件
const requireComponent = require.context('../../../components/common', false, /\.vue$/)

console.log(requireComponent.keys())
const install = (Vue) => {
  requireComponent.keys().forEach((fileName) => {
    let config = requireComponent(fileName)
    let componentName = fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
    Vue.component(componentName.replace(/\//, '-'), config.default || config)
  })
}
export default {
  install
}
