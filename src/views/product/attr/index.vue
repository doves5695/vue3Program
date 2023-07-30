<template>
  <div>
    <!-- 三级分类组件 -->
    <Category :scene="scene"/>
    <el-card style="margin:10px 0">
      <div v-show="scene == 0">
        <el-button type="primary" size="default" icon="Plus"
          :disabled="categoryStore.c3Id ? false : true" @click="addAttr">添加属性</el-button>
        <el-table border style="margin:10px 0" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" width="120px" align="center" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template #="{ row, index }">
              <el-tag style="margin:5px" v-for="(item, index) in row.attrValueList" :key="item.id">{{ item.valueName
              }}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px" align="center">
            <template #="{ row, index }">
              <el-button type="primary" size="small" icon="Edit" @click="updateAttr"></el-button>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 展示添加与修改下方解构的内容 -->
      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请你输入属性的名称"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="default" icon="Plus">添加属性值</el-button>
        <el-button size="default" @click="cancel">取消</el-button>
        <el-table border style="margin:10px 0">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性值" align="center"></el-table-column>
          <el-table-column label="操作" align="center"></el-table-column>
        </el-table>
        <el-button type="primary" size="default" disabled>保存</el-button>
        <el-button size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category';
import { watch, ref, reactive } from 'vue';
import { reqAttr, reqC1 } from '@/api/product/attr/index'
import { AttrResponseData, Attr } from '@/api/product/attr/type';
let categoryStore = useCategoryStore();

// 存储已有的属性和属性值
let attrArr = ref<Attr[]>([]);

// 控制下放场景切换
let scene = ref<number>(0);

// 收集新增属性的数据
let attrParams = reactive<Attr>({
    attrName: "", // 新增的属性的名字 
    attrValueList:[], // 新增的属性值数组
    categoryId: '', // 三级分类的ID
    categoryLevel: 3 // 代表的是三级分类
})


// 监听三级分类的id
watch(() => categoryStore.c3Id, () => {
  // 在下一次测试之前清空数据
  attrArr.value = [];
  // 保证有三级分类的id
  if (!categoryStore.c3Id) return;
  getAttr();
});


// 获取数据的函数
const getAttr = async () => {
  // 解构三个分类栏的id
  const { c1Id, c2Id, c3Id } = categoryStore;
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id);
  if (result.code == 200) {
    attrArr.value = result.data;
  }
}


// 下方显示与隐藏事件
const addAttr = () => {
  scene.value = 1;
}

// 修改改变下方显示
const updateAttr = () => {
  scene.value = 1;
}

// 取消的回调函数
const cancel = () => {
  scene.value = 0;
}
</script>

<style scoped lang="scss"></style>
