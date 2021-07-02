// 比较年月字符串的大小, newDate大返回true
export default function compareDate (newDate, oldDate) {
  const y = parseInt(newDate.substring(0, 4))
  const m = parseInt(newDate.substring(4, 6))
  const yInit = parseInt(oldDate.substring(0, 4))
  const mInit = parseInt(oldDate.substring(4, 6))
  if ((y > yInit) || (y === yInit && m > mInit)) {
    return true
  } else {
    return false
  }
}
