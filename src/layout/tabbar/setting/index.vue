<template>
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="updateRefsh"
  ></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <el-button size="small" icon="Setting" circle></el-button>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0 12px; border-radius: 50%"
  />
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import useLayOutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'
let LayOutSettingStore = useLayOutSettingStore()
let userStore = useUserStore()
let $router = useRouter()
let $route = useRoute()
// main路由刷新
const updateRefsh = () => {
  LayOutSettingStore.refsh = !LayOutSettingStore.refsh
}
// 全屏展示
const fullScreen = () => {
  // Dom的全屏属性用来判断是不是全屏
  let full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const logout = async () => {
  await userStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
</script>

<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style scoped lang="scss"></style>
