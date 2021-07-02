module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'object-curly-spacing': [0, "never"], // 大括号内是否允许不必要的空格,never标识不允许
    'prefer-const ': [0, "never"],
    'no-prototype-builtins': 0,
    'quote-props': 0
  }
}
