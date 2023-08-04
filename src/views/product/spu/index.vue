<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene" />
    <!-- 下边背景 -->
    <el-card style="margin: 10px 0">
      <el-button type="primary" size="default" icon="Plus" :disabled="categoryStore.c3Id?false:true">添加SPU</el-button>
      <!-- 用来展示已有的spu数据 -->
      <el-table style="margin: 10px 0" border :data="records">
        <el-table-column label="序号" align="center" width="80px" type="index"></el-table-column>
        <el-table-column label="SPU名称" align="center" prop="spuName"></el-table-column>
        <el-table-column label="SPU描述" align="center" prop="description" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center">
          <template #="{row, $index}">
            <el-button type="primary" size="small" icon="Plus" title="添加sku"></el-button>
            <el-button type="primary" size="small" icon="Edit" title="修改商品的spu"></el-button>
            <el-button type="primary" size="small" icon="view" title="查看sku列表"></el-button>
            <el-button type="primary" size="small" icon="Delete" title="删除spu"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
        :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="getHasSpu" @size-change="changSize"/>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
// 引入仓库用来获取三级分类id
import useCategoryStore from '@/store/modules/category';
import { reqHasSpu } from '@/api/product/spu';
// 引入请求的数据类型
import type { HasSpuResponseData, Records } from '@/api/product/spu/type'

// 使用仓库
let categoryStore = useCategoryStore();

// 场景开关
let scene = ref<number>(0)

// 分页器默认页码
let pageNo = ref<number>(1)
// 每一页显示几条数据
let pageSize = ref<number>(3)
// 数据总数
let total = ref<number>();

// 当拿到数据的时候立刻存储起来
let records = ref<Records>([]);





// 用此方法监听c3Id的变化
watch(() => categoryStore.c3Id, () => {
  // 如果没有c3Id那么就不执行下面语句
  if (!categoryStore.c3Id) return;
  getHasSpu();
});

// 定义一个方法用于发起请求获取某一c3Id下的所有数据
const getHasSpu = async (pager = 1) => {
  // 修改当前页面
  pageNo.value = pager;
  let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id);
  if (result.code == 200) {
    records.value = result.data.records;
    total.value = result.data.total
  }
}

// 当每页数据条数变化时再发一次请求
const changSize = () => {
  getHasSpu();
}
</script>

<style scoped lang="scss"></style>
