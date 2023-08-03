<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene" />
    <!-- 下边背景 -->
    <el-card style="margin: 10px 0;">
      <el-button type="primary" size="default" icon="Plus">添加SPU</el-button>
      <el-table style="margin: 10px 0;" border>
        <el-table-column label="序号" align="center" width="80px" type="index"></el-table-column>
        <el-table-column label="SPU名称" align="center"></el-table-column>
        <el-table-column label="SPU描述" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template>
            <el-button type="primary" size="small" icon="Plus"></el-button>
            <el-button type="primary" size="small" icon="Edit"></el-button>
            <el-button type="primary" size="small" icon="info"></el-button>
            <el-button type="primary" size="small" icon="Delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
        :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="400" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 场景开关
let scene = ref<number>(0);

// 分页器默认页码
let pageNo = ref<number>(1);
// 每一页显示几条数据
let pageSize = ref<number>(3);
</script>

<style scoped lang="scss"></style>
