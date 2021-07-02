/**
 * @description 通过时间201808获取月份
 * @param {String} str
 */
export default function getMon (str) {
  let dateInt = parseInt(str.substring(4, 6))
  return dateInt
}
