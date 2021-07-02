/**
 * @description 几位分隔添加逗号
 * @param {Integer} num  index
 */

export default function formatNumberToStr () {
  let str = '0'
  let args1 = arguments[0]
  let args2 = arguments[1] || 3
  if (args1) {
    let parts = args1.toString().split('.')
    let re = new RegExp('\\B(?=(\\d{' + args2 + '})+(?!\\d))', 'g')
    parts[0] = parts[0].replace(re, ',')
    str = parts.join('.')
  }
  return str
}
