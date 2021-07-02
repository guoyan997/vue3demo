<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import { onMounted, getCurrentInstance } from 'vue'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  // 在created之前执行，setup中使用生命周期，是不包含beforeCreate 和 created方法的
  setup (props, context) {
    onMounted(() => {
      console.log('组件hello加载完成mounted111111')
      console.log('组件hello获得数据：' + props.msg)
      const { ctx } = getCurrentInstance() // 获取当前组件实例
      console.log('&&&&&&&&&&&&&&&&&&&&&&' + ctx.$router.currentRoute.value.path)
      setTimeout(() => {
        ctx.$eventBus.emit('helloOk')
      }, 5000)
    })
  },
  created () {
    console.log('组件hello创建完成created')
  },
  // 之前的加载完成时写法，现在要写到setup中去了
  mounted () {
    console.log('组件hello加载完成mounted22222')
  }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
