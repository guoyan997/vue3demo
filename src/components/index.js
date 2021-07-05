// // 自动注册全局组件, 第二个参数指是否扫描子目录
// import Vue from 'vue' // 全局导入3.0不能这样用了，要用app实例
// import upperFirst from 'lodash/upperFirst'
// import camelCase from 'lodash/camelCase'

// const requireComponent = require.context(
//   // 其组件目录的相对路径
//   '../components',
//   // 是否查询其子目录
//   true,
//   // 匹配基础组件文件名的正则表达式
//   /\.vue$/
// )

// requireComponent.keys().forEach(fileName => {
//   debugger
//   // 获取组件配置
//   const componentConfig = requireComponent(fileName)

//   // 获取组件的 PascalCase 命名
//   const componentName = upperFirst(
//     camelCase(
//       // 使用 组件 name 属性来确定标签名
//       componentConfig.default.name
//     )
//   )

//   // 全局注册组件
//   Vue.component(
//     componentName,
//     // 如果这个组件选项是通过 `export default` 导出的，
//     // 那么就会优先使用 `.default`，
//     // 否则回退到使用模块的根。
//     componentConfig.default || componentConfig
//   )
// })
