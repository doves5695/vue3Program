<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量
        <span>99999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!-- 放置人数水球图的位置 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入echarts
import * as echarts from 'echarts'
// 引入水球图
import 'echarts-liquidfill'

// 人数
let people = ref('216980人')

// 获取charts实例
let charts = ref()
// 当挂载完毕的时候去获取
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  // 设置一下配置项
  mycharts.setOption({
    // 标题
    title: {
      text: '水球图',
    },
    // x|y轴组件
    // xAxis: {},
    // yAxis: {},
    // 系列: 用来定义你要什么样子的图像
    series: {
      // 数据图的样子
      type: 'liquidFill',
      // echarts里面的数据
      data: [0.6, 0.4, 0.2],
      // 水球图半径
      radius: '90%',
      // 水球图外面的线
      outline: {
        show: true,
        borderDistance: 8,
        itemStyle: {
          color: 'none',
          borderColor: '#294D99',
          borderWidth: 8,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.25)',
        },
      },
      // 水球图内部的内容
      label: {
        show: false,
        color: '#294D99',
        insideColor: '#fff',
        fontSize: 50,
        fontWeight: 'bold',
        align: 'center',
        baseline: 'middle',
      },
    },
  })
})
</script>

<style scoped lang="scss">
.box {
  background: url('../../images/dataScreen-main-lb.png') no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;

  .top {
    margin-left: 20px;

    .title {
      color: white;
      font-size: 24px;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url('../../images/dataScreen-title.png') no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }

    .right {
      float: right;
      color: white;
      font-size: 24px;

      span {
        color: rgb(228, 172, 16);
      }
    }
  }

  .number {
    display: flex;
    margin-top: 30px;
    padding: 15px;

    span {
      flex: 1;
      height: 60px;
      text-align: center;
      line-height: 60px;
      background: url('../../images/total.png') no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
      font-size: 20px;
      font-weight: bolder;
    }
  }

  .charts {
    width: 100%;
    height: 250px;
    // background-color: hotpink;
  }
}
</style>
