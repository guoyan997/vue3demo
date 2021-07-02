<template>
  <div class="chart-content">
    <div class="chart-content__container"
         :id="chartId"></div>
  </div>
</template>

<script>
import baseChart from '../../assets/js/baseChart.js'
import { px2px } from '../../assets/js/core/rem'
export default {
  name: 'BaseChart',
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
    },
    needClick: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  setup (props) {
    const { chartId, chartInstance } = baseChart(props)
    return { chartId, chartInstance }
  },
  methods: {
    // 构建option
    getOption (chartInstance) {
      const option = {
        'legend': {
          show: true,
          itemWidth: px2px(8),
          itemHeight: px2px(8),
          itemGap: px2px(8),
          selectedMode: false,
          textStyle: {
            fontFamily: 'PingFangSC-Regular',
            color: '#666',
            fontSize: px2px(11)
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          textStyle: {
            color: '#fff',
            fontSize: px2px(12)
          },
          formatter: function (params) {
            let str = params[0].name + '<br/>'
            for (let i = 0; i < params.length; i++) {
              if (i < 2) {
                str = str + params[i].marker + '' + params[i].seriesName + '：' + params[i].value + '<br>'
              } else {
                str = str + params[i].marker + '' + params[i].seriesName + '：' + params[i].value + '%' + '<br>'
              }
            }
            return str
          }
        },
        grid: {
          show: false,
          left: px2px(40),
          right: px2px(40),
          bottom: px2px(40)
        },
        'xAxis': [
          {
            'type': 'category',
            'name': '',
            nameLocation: 'start',
            'nameTextStyle': {
              'color': '#71768C',
              fontSize: px2px(12),
              padding: [0, 0, px2px(-30), px2px(-80)]
            },
            'axisPointer': {
              'type': 'shadow'
            },
            'axisLabel': {
              'show': true,
              rotate: 0,
              interval: 0,
              'textStyle': {
                'color': '#71768C'
              },
              fontSize: px2px(12)
            },
            'axisLine': {
              'show': true,
              lineStyle: {
                color: '#ECEFF2'
              }
            },
            axisTick: {
              'show': true
            },
            splitLine: {
              show: true,
              'lineStyle': {
                'color': '#f5f5f5'
              }
            }
          }
        ],
        'yAxis': [
          {
            'type': 'value',
            'name': '',
            'nameTextStyle': {
              'color': '#71768C',
              fontSize: px2px(11)
            },
            'axisLabel': {
              'show': true,
              fontSize: px2px(11),
              'textStyle': {
                'color': '#71768C'
              },
              formatter: '{value}'
            },
            'axisLine': {
              show: true,
              lineStyle: {
                color: '#ECEFF2'
              }
            },
            'splitLine': {
              show: false,
              'lineStyle': {
                'color': '#7d838b'
              }
            },
            axisTick: {
              'show': false
            }
          },
          {
            'type': 'value',
            'name': '',
            'nameTextStyle': {
              'color': '#71768C',
              fontSize: px2px(11)
            },
            'axisLabel': {
              show: true,
              fontSize: px2px(11),
              'textStyle': {
                'color': '#71768C'
              },
              formatter: '{value}%'
            },
            'axisLine': {
              show: true,
              lineStyle: {
                color: '#ECEFF2'
              }
            },
            'splitLine': {
              show: false,
              lineStyle: {
                color: '#ffff00'
              }
            },
            axisTick: {
              'show': false
            }
          }
        ]
      }
      if (this.needClick) {
        chartInstance.off('click')
        // 点击事件,根据点击某个省份计算出这个省份的数据
        chartInstance.on('click', (params) => {
          params.event.event.preventDefault()
          params.event.event.stopPropagation()
          this.clickItem(params)
        })
      }
      return option
    },
    clickItem (params) {
      this.$emit('clickBarItem', params)
    }
  },
  mounted () {
    console.log('*****************baseChart')
  }
}
</script>

<style lang="scss" scoped>
.chart-content {
  position: relative;
  width: 100%;
  height: 100%;

  &__container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
