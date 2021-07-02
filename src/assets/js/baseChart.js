/**
 * @description echarts图表组件混入
 */
import _ from 'lodash'
// eslint-disable-next-line
import echarts from 'echarts'
import { watch, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
export default function (props) {
  // 获取当前组件实例
  const { ctx } = getCurrentInstance() // 获取当前组件实例
  // const data = reactive({
  //   chartId: _.uniqueId('chart'),
  //   chartInstance: undefined,
  //   resizeTimer: null
  // })
  // const { chartId, chartInstance, resizeTimer } = toRefs(data)
  const chartId = _.uniqueId('chart')
  let chartInstance = null
  let resizeTimer = null
  const render = () => {
    try {
      if (!chartInstance) {
        const chartDom = document.getElementById(chartId)
        if (chartDom) {
          chartInstance = echarts.init(chartDom)
          chartInstance.setOption(_.merge(ctx.getOption(chartInstance), props.option), true)
        } else {
          console.log('=== 获取不到图表dom ===')
          return false
        }
      } else {
        chartInstance.setOption(_.merge(ctx.getOption(), props.option), true)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const resizeChart = () => {
    if (chartInstance || chartInstance !== {}) {
      if (resizeTimer) {
        clearTimeout(resizeTimer)
      }
      resizeTimer = setTimeout(() => {
        chartInstance.resize()
      }, 500)
    }
  }
  watch(() => props.chartData, (newData, oldData) => {
    render()
  }, {
    deep: true
  })
  onMounted(() => {
    render()
    window.addEventListener('resize', resizeChart, false)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeChart)
    if (chartInstance) {
      console.log('=== 释放图表实例 ===')
      chartInstance.dispose()
      echarts.dispose(chartInstance)
      chartInstance = null
      console.log(chartInstance)
    }
  })
  return { chartId, chartInstance }
}
