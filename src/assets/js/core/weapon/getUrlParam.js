/**
 * @descript 获取URL参数
 * @param {String} name
 * @returns {String} value
 * @example
 */
export default function getUrlParam (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg) // 匹配目标参数
  if (r != null) {
    console.log('getUrlParam decodeURI(r[2]) =', decodeURI(r[2]))
    return decodeURI(r[2]) // 返回参数值，转码中文使中文参数不乱码
    // return unescape(r[2]) // 返回参数值，中文出现乱码
  }
}
