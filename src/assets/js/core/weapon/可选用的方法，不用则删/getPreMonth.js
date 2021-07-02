export default function getPreMonth () {
  const dateStr = new Date()
  let year = dateStr.getFullYear()
  let month = dateStr.getMonth() // 获取当前日期的月份
  let year2 = year + ''
  if (month === 0) {
    year2 = (parseInt(year) - 1) + ''
    month = '12'
  }
  if (month < 10) {
    month = '0' + month
  }
  let rq = year2 + '' + month
  return rq
}
