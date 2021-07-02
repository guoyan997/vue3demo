/**
 * @description 判断客户端是否iphone
 */
export default function isIPhone () {
  return window.navigator.appVersion.match(/iphone/gi)
}
