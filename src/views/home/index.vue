<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" alt="" />
      <div class="bottom">
        <h3 class="title">{{ getTime() }}{{ userStore.username }}!!!</h3>
        <p class="subtitle">荆瑞的运营平台</p>
      </div>
    </div>
  </el-card>
  <div class="bottoms">
    <svgIcon name="welcome" width="600px" height="300px"></svgIcon>
  </div>
</template>

<script setup lang="ts">
// 引入存储用户的仓库
import useUserStore from '@/store/modules/user'
// 引入时间工具
import { getTime } from '@/utils/time'
// 使用仓库的对象
let userStore = useUserStore()
</script>

<style scoped lang="scss">
.box {
  display: flex;

  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
  .bottom {
    margin-left: 20px;
  }
  .title {
    margin-bottom: 80px;
    font-size: 30px;
    font-weight: bolder;
  }
  .subtitle {
    font-style: italic;
    color: darkgrey;
  }
}
.bottoms {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
