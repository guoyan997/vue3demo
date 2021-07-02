<template>
  <div class='about'>
    测试页面
    <img :src="imgSrc">
  </div>
</template>

<script>
export default {
  name: '',
  setup () {
    const imgSrc = './img/test.jpg'
    return { imgSrc }
  }
}
</script>
<style lang='scss' scoped>
</style>
