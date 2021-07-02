// 处理小数乘以正数精确度丢失的问题，如0.5075* 100

export default function accMul (arg1, arg2, fix) {
  if (!parseInt(fix) === fix) {
    return
  }
  let m = 0
  let s1 = arg1.toString()
  let s2 = arg2.toString()
  try { m += s1.split('.')[1].length } catch (e) {}
  try { m += s2.split('.')[1].length } catch (e) {}
  if (m > fix) {
    return (Math.round(Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m - fix)) / Math.pow(10, fix))
  } else if (m <= fix) {
    return (Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)).toFixed(fix)
  } else {
    return (arg1 * arg2).toFixed(fix)
  }
}
