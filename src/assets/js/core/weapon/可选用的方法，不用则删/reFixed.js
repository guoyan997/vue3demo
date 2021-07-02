
export default function reFixed (value, len) {
  let tempNum = 0
  let s
  let s1 = value + ''
  let start = s1.indexOf('.')
  // 截取小数点后,0之后的数字，判断是否大于5，如果大于5这入为1
  if (s1.substr(start + len + 1, 1) >= 5) {
    tempNum = 1
  }
  // 计算10的len次方,把原数字扩大它要保留的小数位数的倍数
  let temp = Math.pow(10, len)
  // 求最接近this * temp的最小数字
  // floor() 方法执行的是向下取整计算，它返回的是小于或等于函数参数，并且与之最接近的整数
  s = Math.floor(value * temp) + tempNum
  return (s / temp).toFixed(len)
}
