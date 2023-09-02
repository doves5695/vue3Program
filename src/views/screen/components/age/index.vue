<template>
  <div class="box2">
    <div class="title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 放置图片的位置 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
// 获取dom
let charts = ref()

onMounted(() => {
  let option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: 40,
      right: '10',
      orient: 'vertical', // 设置图例的方向
      textStyle: {
        color: 'white',
        fontSize: 14,
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '80%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 25,
          borderColor: '#fff',
          borderWidth: 3,
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
        },
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: 30,
        //     fontWeight: 'bold'
        //   }
        // },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: '上海' },
          { value: 735, name: '北京' },
          { value: 580, name: '成都' },
          { value: 484, name: '杭州' },
          { value: 300, name: '深圳' },
        ],
        gird: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        },
      },
    ],
  }
  let mycharts = echarts.init(charts.value)
  mycharts.setOption(option)
})
</script>

<style scoped lang="scss">
.box2 {
  width: 100%;
  height: 100%;
  // background-color: red;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  .title {
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: 260px;
    // background-color: red;
  }
}
</style>
