/**
 * @description echarts图表组件混入
 */
import _ from 'lodash'
import echarts from 'echarts'

let chartMixin = {
  props: {
    // 外部option
    option: {
      type: Object,
      default: () => ({})
    },
    // 图表数据
    chartData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      chartId: _.uniqueId('chart'),
      chartInstance: undefined,
      resizeTimer: null
    }
  },
  // 数据变化时重新渲染
  watch: {
    chartData: {
      handler: function (val, oldVal) {
        this.render()
      },
      deep: true,
      immediate: true
    }
    // chartData () {
    //   this.render()
    // }
  },
  methods: {
    // 渲染图表
    render () {
      // console.log('=== 渲染图表 ===', _.merge(this.getOption(), this.option))
      try {
        if (!this.chartInstance) {
          let chartDom = document.getElementById(this.chartId)
          if (chartDom) {
            this.chartInstance = echarts.init(chartDom)
            this.chartInstance.setOption(_.merge(this.getOption(), this.option), true)
          } else {
            console.log('=== 获取不到图表dom ===')
            return false
          }
        } else {
          this.chartInstance.setOption(_.merge(this.getOption(), this.option), true)
        }
      } catch (error) {
        console.error(error)
      }
    },
    resizeChart () {
      if (this.chartInstance) {
        if (this.resizeTimer) {
          clearTimeout(this.resizeTimer)
        }
        this.resizeTimer = setTimeout(() => {
          this.chartInstance.resize()
        }, 500)
      }
    }
  },
  // 挂载时渲染
  mounted () {
    this.render()
    // if (document.getElementById(this.chartId)) {
    //   document.getElementById(this.chartId).addEventListener('resize', this.resizeChart, false)
    // }
    const _this = this
    // window.onresize = function () {
    //   console.log('******************')
    //   _this.resizeChart()
    // }
    window.addEventListener('resize', _this.resizeChart, false)
    console.log('*****************mixin')
  },
  beforeDestroy () {
    const _this = this
    window.removeEventListener('resize', _this.resizeChart)
    // document.getElementById(this.chartId).removeEventListener('resize', this.resizeChart, false)
    if (this.chartInstance) {
      console.log('=== 释放图表实例 ===')
      this.chartInstance.dispose()
      echarts.dispose(this.chartInstance)
      this.chartInstance = null
      console.log(this.chartInstance)
    }
  }
}

export default chartMixin
export { chartMixin }
