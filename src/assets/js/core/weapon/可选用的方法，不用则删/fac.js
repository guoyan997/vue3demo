/**
 * @description n 10的阶乘
 * @param {Integer} n
 */
export default function fac (n) {
  return n > 0 ? 10 * fac(n - 1) : 1
}
