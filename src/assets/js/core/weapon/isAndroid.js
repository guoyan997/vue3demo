
/**
 * @description 判断客户端是否android
 */
export default function isAndroid () {
  return window.navigator.appVersion.match(/android/gi)
}
