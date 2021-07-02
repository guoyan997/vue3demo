const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const path = require('path')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all')

const resolve = dir => path.join(__dirname, dir)
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
const needAnalyz = process.env.VUE_APP_IS_ANALYZ

module.exports = {
  publicPath: IS_PROD ? '' : '/', // 默认''，部署应用包时的基本 URL
  outputDir: 'dist', // 'dist', 生产环境构建文件的目录
  assetsDir: '', // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: true,
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: false, // 生产环境的 source map

  configureWebpack: config => {
    // cdn引用时配置externals
    // config.externals = {
    //     'vue': 'Vue',
    //     'element-ui': 'ELEMENT',
    //     'vue-router': 'VueRouter',
    //     'vuex': 'Vuex',
    //     'axios': 'axios'
    // }
    if (IS_PROD) {
      // 如果是生产环境，就打包时去掉日志输出和debugger
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true // 关闭日志
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true // 关闭断点标志
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']

      const plugins = []

      // 去除多余css
      plugins.push(
        new PurgecssPlugin({
          paths: glob.sync([path.join(__dirname, './**/*.vue')]),
          extractors: [
            {
              extractor: class Extractor {
                static extract (content) {
                  const validSection = content.replace(
                    /<style([\s\S]*?)<\/style>+/gim,
                    ''
                  )
                  return validSection.match(/[A-Za-z0-9-_:/]+/g) || []
                }
              },
              extensions: ['html', 'vue']
            }
          ],
          whitelist: ['html', 'body'],
          whitelistPatterns: [/el-.*/], // 白名单，引入第三方库的时候需要注意，不然打包会丢失样式
          whitelistPatternsChildren: [/^token/, /^pre/, /^code/]
        })
      )
      plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        })
      )
      config.plugins = [...config.plugins, ...plugins]
    }
  },
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true)
    // 修复Lazy loading routes Error： Cyclic dependency  [https://github.com/vuejs/vue-cli/issues/1669]
    config.plugin('html').tap(args => {
      args[0].chunksSortMode = 'none'
      return args
    })

    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))

    // 打包分析
    if (!needAnalyz) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ])
    }

    // 压缩图片
    // config.module
    //   .rule('images')
    //   .use('image-webpack-loader')
    //   .loader('image-webpack-loader')
    //   .options({
    //     mozjpeg: { progressive: true, quality: 65 },
    //     optipng: { enabled: false },
    //     pngquant: { quality: [0.65, 0.9], speed: 4 },
    //     gifsicle: { interlaced: false },
    //     webp: { quality: 75 }
    //   })

    // 多页面配置，为js添加hash
    config.output.chunkFilename('js/[name].[chunkhash:8].js')

    // 修改图片输出路径
    // config.module
    //   .rule('images')
    //   .test(/\.(png|jpe?g|gif|ico)(\?.*)?$/)
    //   .use('url-loader')
    //   .loader('url-loader')
    //   .options({
    //       name: path.join('../assets/', 'img/[name].[ext]')
    //   })
  },
  css: {
    requireModuleExtension: false,
    // extract: true,
    // 为css后缀添加hash
    // extract: {
    //   filename: 'css/[name].[hash:8].css',
    //   chunkFilename: 'css/[name].[hash:8].css'
    // },
    sourceMap: false,
    loaderOptions: {
      sass: {
        // 向全局sass样式传入共享的全局变量
        prependData: '@import "./src/assets/style/_varieties.scss";@import "./src/assets/style/rem.scss";'
      },
      // px转换为rem
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 75, // 换算的基数, 对应的是rem.js中windth/10 的值，这一步是转化style标签里的px为rem，但是如果代码中用到了rem单位，需要用rem.js中的转化方法
            selectorBlackList: ['weui', 'el'], // 忽略转换正则匹配项
            exclude: /node_modules/,
            propList: ['*'],
            mediaQuery: false, // （布尔值）允许在媒体查询中转换px。
            minPixelValue: 2 // 设置要替换的最小像素值(3px会被转rem)。 默认 0
          })
        ]
      }
    }
  },
  pluginOptions: {
    // 安装vue-cli-plugin-style-resources-loader插件
    // 添加全局样式global.scss
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        resolve(__dirname, './src/assets/style/rem.scss')
      ]
    }
  },
  parallel: require('os').cpus().length > 1,
  pwa: {},
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    open: IS_PROD,
    host: '0.0.0.0',
    // port: 8000,
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_HOST || 'http://127.0.0.1:8080',
        changeOrigin: true
      }
    }
  }
}
