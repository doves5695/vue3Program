<template>
  <el-card>
    <el-from :inline="true" class="form">
      <el-form-item label="角色名称">
        <el-input placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-from>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" size="default" icon="Plus">添加职位</el-button>
    <el-table border style="margin: 10px 0">
      <el-table-column label="#" type="index" align="center"></el-table-column>
      <el-table-column label="id" align="center"></el-table-column>
      <el-table-column label="角色名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" width="260px"></el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[100, 200, 300, 400]"
    :background="true" layout="prev, pager, next, jumper, ->,sizes, total"
    :total="400"/>
  </el-card>
  
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 当前第几页
let pageNo = ref<number>(1);
// 一页显示多少数据
let pageSize = ref<number>(10);
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>
