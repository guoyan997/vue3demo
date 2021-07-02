<template>
  <div class="home">
    <img alt="Vue logo"
         src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <span ref="title"
          class="title"
          @click="getTitleDom">{{mydata}}</span>
    <br />
    <div v-for="(item, index) in stateArr"
         :key="index">{{item.name}}</div>
    <button class="btn"
            @click="add">+</button>
    {{count}}
    <button class="btn"
            @click="reduce">-</button>

    <p>{{ state1 }}</p>
    <button @click="add1">增加ref</button>

    <p>{{ state2 }}</p>
    <button @click="add2">增加toRef</button>

    <p>{{state3.count}}</p>
    <button @click="add3">增加reactive</button>

    <p>当前的myCount值为：{{myCount}}</p>
    <button @click="addData">点击+1</button>
    <div class="chart-div">
      <BaseChart :chartData="data"
                 :option="chartOption"></BaseChart>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import API from '../assets/js/api'
import request from '../assets/js/request'
import { getCurrentInstance, onMounted, computed, watch, ref, toRef, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import HelloWorld from '@/components/HelloWorld.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
export default {
  name: 'Home',
  components: {
    HelloWorld,
    BaseChart
  },
  /**
   * 这个函数传入两个参数，分别为 props 和 context
    props 为 父组件传递的参数，而 context 为 attrs, emit, slots
    props 是响应式的，但是不可以 使用 解构或者展开，这样会 导致响应式 失败（原因会在第二点讲）
    context 可以使用解构，slots 相当于以前的 $slots ，emit 相当于以前的 $emit，attrs 则是在 组件标签上的内容
   */
  setup (props, context) {
    /**
     *用 reactive() 创建的响应式对象，整个对象是响应式的，而对象里的每一项都是普通的值。当你把它用展开运算符展开后，整个对象的普通值都不是响应式的；
      ref() 创建的响应式是将某个对象中的属性变成响应式数据，修改响应式数据是不会影响到原始数据。ref的本质是拷贝，与原始数据没有引用关系，ui视图会改变
      toRef() 创建的响应式是将某个对象中的属性变成响应式数据，修改响应式数据是会影响到原始数据的。toRef的本质是引用，与原始数据有关联，ui视图不会改变
     */
    /**
     * 如上面所示，在使用 ref 定义的值之后，必须使用 xxx.value 才能获得对应的值，而 reactive 则不需要
      reactive 响应化的数据不能使用解构或者展开，要不然会失去响应
     **/
    /**
     * 那么为什么 props 和 reactive不能解构或者展开，而 ref 之后的数据又必须使用 .value 访问 呢？
      无论是 Object.defineProperty 还是 proxy，只能对 对象数据保持 响应式
      如果是一个 基本属性的话，那改变了就是改变了，vue 内部是不能监听到他的变化的
      所以 在 ref 中，一个 基本类型 变成了对象，而且使用 value 来获取
      当 ref 作为 reactive 对象的 property 被访问或修改时，也将自动解套 value 值，其行为类似普通属性

      当reactive props 结构的结果为 基本类型 ，那么同样 也是失去了 监听的效果
      但是当 reactive 内部的值 是一个对象的话，那么 解构或者展开 依旧保持 响应，这是内部处理了 深度响应的结果
     */
    console.log('setup执行，相当于optionApi的created的生命周期方法')
    const obj = { count: 3 }
    const arr = [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }]
    const state1 = ref(obj.count) // 拷贝生成响应式对象，不改变原始数据
    const state2 = toRef(obj, 'count')
    const state3 = reactive({ count: 1 })
    const stateArr = ref(arr)
    const add1 = () => {
      state1.value++
      console.log('原始值：', obj) // count为3不变
      console.log('响应式数据对象：', state1)
    }

    const add2 = () => {
      state2.value++
      console.log('原始值：', obj)
      console.log('响应式数据对象：', state2)
    }

    const add3 = () => {
      state3.count++
      console.log('原始值：', state3)
      console.log('响应式数据对象：', state3.count)
    }
    /**
     * toRefs() 可以将 reactive() 创建出来的响应式对象转换成内容为 ref 响应式的值的普通对象
      当你需要展开 reactive() 创建的响应式对象，又不想让他们失去响应式特点的时候，就需要用 toRefs() 将它进行转
    */
    const state = reactive({
      myCount: 0
    })
    const addData = () => {
      state.myCount++
    }
    // 获取dom节点
    const title = ref(null)

    const mydata = ref('测试数据')
    const store = useStore()
    console.log(store)
    const { ctx } = getCurrentInstance() // 获取当前组件实例
    const myChartData = {
      data: [{ name: 'aaa', value: 111 }, { name: 'bbb', value: 222 }, { name: 'ccc', value: 333 }]
    }
    const chartData = reactive(myChartData)
    onMounted(() => {
      console.log('$$$$$$$$$$$$$$$$$' + 'setup里的mounted')
      // setup函数中无法使用this,所以通过getCurrentInstance()获取当前组件的实例
      console.log('&&&&&&&&&&&&&&&&&&&&&&' + ctx.$router.currentRoute.value.path)
      // eslint-disable-next-line
      console.log('获取dom节点' + title)
      ctx.$eventBus.on('helloOk', () => {
        console.log('监听hello组件事件的回调')
      })
      setTimeout(() => {
        debugger
        chartData.data = [{ name: 'aaa', value: 111 }, { name: 'bbb', value: 222 }, { name: 'ccc', value: 333 }, { name: 'ddd', value: 333 }]
      }, 5000)
    })

    /**
   * computed 返回的值 就和 ref 一样，都是 需要使用 .value 获取，理由同上
      watch 可以监听一个值，也可以同时监听多个值
      readonly 返回一个只读代理，即使是对象里面的对象，也是 readonly 的
   */
    // 计算属性的使用
    const count = computed(() => store.state.count) // 如果是用modules中的user就 return store.state.user.xxx
    // vuex的使用
    const add = () => {
      ctx.$store.dispatch('add')
      mydata.value = 'bbb'
      stateArr.value = [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }, { name: 'ddd' }]
    }
    const reduce = () => {
      ctx.$store.dispatch('reduce')
      mydata.value = 'ccc'
      stateArr.value = [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }]
    }
    // watch 监听，watchEffect是立即执行
    watch(mydata, (newl, old) => {
      console.log('watch监听到数据变化' + newl)
    }, { immediate: true, deep: true })
    const getBarData = async (index) => {
      const { __statusCode, data } = await request(API.welcome.getBarData, { date: '123' })
      if (__statusCode === '1') {
        console.log('获取返回的数据：' + data)
      }
    }
    const chartOption = computed(() => {
      debugger
      const option = {
        xAxis: [{ data: [] }],
        series: [{
          data: [],
          type: 'bar'
        }]
      }
      const labelList = []
      const dataList = []
      for (const item of chartData.data) {
        labelList.push(item.name)
        dataList.push(item.value)
      }
      option.xAxis[0].data = labelList
      option.series[0].data = dataList
      return option
    })
    /**
 * toRefs 它将把每一个属性在可响应对象上转换成一个对应的 ref
*/
    return { mydata, count, add, reduce, state1, state2, state3, stateArr, add1, add2, add3, addData, ...toRefs(state), title, getBarData, chartOption, ...toRefs(chartData) }
  },
  created () {
    console.log('optionApi的created的生命周期方法执行，可以与setup共存')
    this.getBarData()
    this.getTitleDom()
  },
  mounted () {
    console.log('$$$$$$$$#################$$$$$$$$' + 'optionApi里的mounted')
  },
  methods: {
    // 两种方法都可以获取标签元素
    getTitleDom () {
      console.log('获取dom节点' + this.$refs.title)
      console.log('获取dom节点' + this.title)
    }
  }
}
</script>
<style scoped lang="scss">
.home {
  .title {
    font-size: 20px;
    color: #fff000;
  }
  .btn {
    width: 100px;
    height: 40px;
  }
  .chart-div {
    margin: 0 auto;
    width: 500px;
    height: 400px;
    background-color: #fff000;
  }
}
</style>
