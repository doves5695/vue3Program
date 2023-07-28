<template>
  <el-card class="box-card">
    <!-- 卡片顶部添加品牌按钮 -->
    <el-button type="primary" size="default" icon="Plus">添加品牌</el-button>
    <!-- 表格组件用于展示已用的平台数据 -->
    <el-table style="margin:10px 0px" border>
      <el-table-column label="序号" width="80px" align="center"></el-table-column>
      <el-table-column label="品牌名称"></el-table-column>
      <el-table-column label="品牌LOGO"></el-table-column>
      <el-table-column label="品牌操作"></el-table-column>
    </el-table>
    <!-- 分页器组件 -->
    <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :background="true"
      layout="prev, pager, next, jumper,->,sizes,total" :total="400"/>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 默认页码
let pageNo = ref<number>(1);
// 每页展示多少数据
let limit = ref<number>(3);
</script>

<style scoped lang="scss"></style>
