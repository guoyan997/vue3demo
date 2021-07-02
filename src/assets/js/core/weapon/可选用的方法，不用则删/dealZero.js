// 处理为0的数据
export default function dealZero (val, str, flag = '-') {
  if (Number(val) === 0) {
    return flag
  } else {
    return str
  }
}
