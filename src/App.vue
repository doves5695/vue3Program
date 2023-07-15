<template>
  <div class="box">
    <h1>我是App</h1>
    <h1>新增一个标题</h1>
  </div>
</template>

<script setup lang="ts">
const fun = () => {
  console.log('888')
}
fun()
</script>

<style scoped lang="scss">
.box {
  height: 100px;
}
</style>
