
import rem from './rem'
import { weapon } from './weapon/index'

const core = {
  rem,
  weapon
}

// 挂载全局功能服务
if (!window.$lib) {
  window.$lib = {
    ...rem,
    ...weapon
  }
} else {
  console.warn('$lib全局对象已存在！')
}

export {
  rem,
  weapon
}

export default core
