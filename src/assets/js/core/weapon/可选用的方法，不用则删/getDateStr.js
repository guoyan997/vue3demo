/**
 * @description 获取日期字符串
 * @param {string} str
 */
export default function getDateStr (str, index) {
  var myDate = new Date()
  if (index === 1) {
    myDate = new Date(new Date() - 24 * 60 * 60 * 1000)
  }
  if (index === 2) {
    myDate.setMonth(myDate.getMonth() - 1)
  }
  if (str === 'year') {
    return myDate.getFullYear()
  } else if (str === 'month') {
    let month = myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1
    return myDate.getFullYear() + month.toString()
  } else if (str === 'monthFull') {
    return myDate.getMonth() + 1
  } else {
    let month = myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1
    let day = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate()
    return myDate.getFullYear().toString() + month.toString() + day
  }
}
