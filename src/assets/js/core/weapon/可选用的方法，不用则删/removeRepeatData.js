// 根据某个属性，去重对象数组
export default function removeRepeatData (arr, prop) {
  let result = []
  let obj = {}
  for (let i = 0; i < arr.length; i++) {
    if (!obj[arr[i][prop]]) {
      result.push(arr[i])
      obj[arr[i][prop]] = true
    }
  }
  return result
}
