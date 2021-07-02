/**
 *
 * @param {Number,String} val
 * @param {String} showTxt
 * @param {Number} decimal
 */

export default function numberDropTail (val, showTxt, decimal) {
  let dec = decimal || 2
  let number = initNum(val)
  if (number < 10000 && number > -10000) {
    return formatNumber(number, 0)
  } else if (
    number === 10000 || number === -10000 || (number > 10000 && number < 100000000) || (number < -10000 && number > -100000000)
  ) {
    return formatNumber(number / 10000, dec) + (showTxt === 'hide' ? '' : '万')
  } else if (number === 100000000 || number > 100000000 || number < -100000000 || number === -100000000) {
    return formatNumber(number / 100000000, dec + 1) + (showTxt === 'hide' ? '' : '亿')
  } else {
    return '--'
  }
}
function formatNumber (num, precision, separator) {
  if (num === '--' || num === null) {
    return '--'
  }
  var parts
  // 判断是否为数字
  if (!isNaN(parseFloat(num)) && isFinite(num)) {
    // console.log('这时的numbber', num)
    // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
    // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
    // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
    // 的值变成了 12312312.123456713
    num = Number(num)
    // 处理小数点位数
    num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString() // 四舍五入处理
    // 分离数字的小数部分和整数部分
    parts = num.split('.')
    // console.log('这时的parts', parts)
    // 整数部分加[separator]分隔, 借用一个著名的正则表达式
    parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','))
    return parts.join('.')
  }
  // return NaN
  return ''
}

function initNum (val) {
  if (val === '--' || val === null) {
    return '--'
  }
  if (val === undefined || val === '' || isNaN(val) || isNaN(parseFloat(val))) {
    return 0
  } else {
    return parseFloat(val)
  }
}
