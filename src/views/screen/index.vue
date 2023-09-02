<template>
  <div class="container">
    <!-- 数据大屏内容展示区域 -->
    <div class="screen" ref="screen">
      <!-- 数据大屏顶部 -->
      <div class="top">
        <Top></Top>
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right">
          <Rank class="rank"></Rank>
          <Year class="year"></Year>
          <Couter class="couter"></Couter>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入组件
import Top from './components/top/index.vue'
// 将左侧三个子组件引入
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'
// 中间的两个组件
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'
// 引入右侧三个组件
import Rank from './components/rank/index.vue'
import Year from './components/year/index.vue'
import Couter from './components/couter/index.vue'
// 获取内容区域的dom元素
let screen = ref()

// 当挂载完毕就去把元素拽回来
onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})

// 控制大屏内容区域的缩放比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return ww < wh ? ww : wh
}

// 当视口发生变化的时候就会触发函数
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url('./images/bg.png') no-repeat;
  background-size: cover;
  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    transform-origin: left top;
    left: 50%;
    top: 50%;
  }
  .top {
    width: 100%;
    height: 40px;
  }
  .bottom {
    display: flex;
    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      .rank {
        flex: 1.5;
      }
      .year {
        flex: 1;
      }
      .couter {
        flex: 1;
      }
    }
    .left {
      display: flex;
      flex: 1;
      height: 1040px;
      flex-direction: column;
      .tourist {
        flex: 1.3;
        // background-color: red;
      }
      .sex {
        flex: 1;
        // background-color: violet;
      }
      .age {
        flex: 1;
        // background-color: aqua;
      }
    }
    .center {
      display: flex;
      flex: 2;
      flex-direction: column;
      .map {
        flex: 4;
      }
      .line {
        flex: 1;
        // background-color: blue;
      }
    }
  }
}
</style>
