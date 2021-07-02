
/**
 * 建议引入对应工具类方法前先找下开源的更优秀的插件再决定要不要引进来，有开源的就优先用开源的。
 * 如：loadsh.js(数组，排序，类型判断)或 moment.js(时间处理),
 * 本js用于处理工具类的方法集合到weapon对象，建议全局引用例： $lib.weapon.getUrlParams()
 * 将平级文件夹里所有包含子文件夹的js注册到一个对象，对象中的属性是js的文件名（小驼峰），值对应js里输出的方法中再输出
 */
import camelCase from 'lodash/camelCase'
const requireComponent = require.context(
  // 其组件目录的相对路径
  './',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /js$/
)
let weapon = {}
requireComponent.keys().forEach(fileName => {
  // 获取文件配置
  const componentConfig = requireComponent(fileName)

  // 获取文件的 PascalCase 命名
  const jsFileName = camelCase(
    // 获取和目录深度无关的文件名
    fileName.split('/').pop().replace(/\.\w+$/, '')
  )

  weapon[jsFileName] = componentConfig.default || componentConfig
})
export default weapon
export {weapon}
