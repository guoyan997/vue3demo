/**
 * @descript 接收数字，输出单位，（万，亿）
 * @param {Number} val
 * @return {String} unit
 * @example let string=numberToUnit(120000,'元');console.log(string);'万元'
 */
export default function numberToUnit (val, unit) {
  if (val < 10000 && val > -10000) {
    return '' + unit
  } else if (
    val === 10000 ||
      (val > 10000 && val < 100000000) ||
      (val < -10000 && val > -100000000)
  ) {
    return '万' + unit
  } else if (
    val === 100000000 ||
      val > 100000000 ||
      val < -100000000
  ) {
    return '亿' + unit
  } else {
    console.err('numberToUnit接到的参数为', val, unit)
    return ''
  }
}
