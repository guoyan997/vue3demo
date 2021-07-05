// 初始判断，大于25号就取上个月，小月25号就取上上个月
export default function getPreDoubleMonth (initDate = 25) {
  const dateStr = new Date()
  const year = dateStr.getFullYear()
  let month
  if (dateStr.getDate() >= initDate) {
    month = dateStr.getMonth() // 获取上个月份
  } else {
    month = parseInt(dateStr.getMonth()) - 1 // 获取当前日期的前月份
  }
  let year2 = year + ''
  if (month === 0 || month === -1) {
    year2 = (parseInt(year) - 1) + ''
    if (month === 0) {
      month = '12'
    } else {
      month = '11'
    }
  }
  if (month < 10) {
    month = '0' + month
  }
  const rq = year2 + '' + month
  return rq
}
