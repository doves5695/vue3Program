<template>
  <div class="box">
    <img src="../../assets/images/error_images/401.png" alt="">
    <button @click="goHome">返回首页</button>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
let $router = useRouter();
const goHome = () => {
  $router.push('/home')
}
</script>

<style scoped lang="scss">
.box {
  width: 100vw;
  height: 100vh;
  background-color: skyblue;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 800px;
    height: 600px;
  }
}
</style>
