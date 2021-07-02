// 根据传入的数量返回随机rgb的颜色数组列表，相邻之间颜色不会相近
export default function getRandomColor (num) {
  let HSLArr = getHslArray(num)
  let rgbArr = []
  HSLArr.forEach(item => {
    let rgbNumArr = hslToRgb(item[0], item[1], item[2])
    rgbArr.push('rgb(' + rgbNumArr[0] + ',' + rgbNumArr[1] + ',' + rgbNumArr[2] + ')')
  })
  return rgbArr
}
function getHslArray (num) {
  var HSL = []
  var hslLength = num // 获取数量
  for (var i = 0; i < hslLength; i++) {
    var ret = randomHsl()

    // 颜色相邻颜色差异须大于 0.25
    if (i > 0 && Math.abs(ret[0] - HSL[i - 1][0]) < 0.25) {
      i--
      continue // 重新获取随机色
    }
    ret[1] = 0.7 + (ret[1] * 0.2) // [0.7 - 0.9] 排除过灰颜色
    ret[2] = 0.4 + (ret[2] * 0.4) // [0.4 - 0.8] 排除过亮过暗色

    // 数据转化到小数点后两位
    ret = ret.map(function (item) {
      return parseFloat(item.toFixed(2))
    })

    HSL.push(ret)
  }
  return HSL
}
function hslToRgb (H, S, L) {
  var R, G, B
  if (+S === 0) {
    R = G = B = L // 饱和度为0 为灰色
  } else {
    var hue2Rgb = function (p, q, t) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    var Q = L < 0.5 ? L * (1 + S) : L + S - L * S
    var P = 2 * L - Q
    R = hue2Rgb(P, Q, H + 1 / 3)
    G = hue2Rgb(P, Q, H)
    B = hue2Rgb(P, Q, H - 1 / 3)
  }

  return [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)]
}
function randomHsl () {
  var H = Math.random()
  var S = Math.random()
  var L = Math.random()
  return [H, S, L]
}
