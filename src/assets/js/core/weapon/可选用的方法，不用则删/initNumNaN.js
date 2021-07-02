// 处理为空的数据给0,返回不是千分位数据
export default function initNumNaN (val, precision) {
  return initNum(val).toFixed(precision)
}
function initNum (val, str = 0) {
  if (val === undefined || val === '' || isNaN(val) || isNaN(parseFloat(val))) {
    return str
  } else {
    return parseFloat(val)
  }
}
