/**
 *  @description 保留小数几位
 *  @param arguments 1、value 2 保留几位小数 3 乘以10的阶乘
 */
function fac (n) {
  return n > 0 ? 10 * fac(n - 1) : 1
}
export default function formatPrecent () {
  let num = 0
  let args1 = arguments[0]
  let args2 = arguments[1]
  let args3 = arguments[2] || 0
  if (args1) {
    num = args1
    if (args3 !== undefined) {
      num = num * fac(parseInt(args3))
    }
    if (args2 !== undefined) {
      num = num.toFixed(args2)
    }
  } else {
    num = num.toFixed(args2)
  }
  return num
}
