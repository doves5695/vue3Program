<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select v-model="categoryStore.c1Id" @change="handler" :disabled="scene == 0 ? false : true">
          <el-option v-for="(c1, index) in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="categoryStore.c2Id" @change="handler1" :disabled="scene == 0 ? false : true">
          <el-option v-for="(c2, index) in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryStore.c3Id" :disabled="scene == 0 ? false : true">
          <el-option v-for="(c3, index) in categoryStore.c3Arr" :key="c3.id" :value="c3.id" :label="c3.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useCategoryStore from '@/store/modules/category'

let categoryStore = useCategoryStore()

// 组件挂载完毕
onMounted(() => {
  getC1()
})

// 告诉仓库获取一级数据
const getC1 = () => {
  categoryStore.getC1()
}

// 选择框的触发事件, 当值有变化的时候会触发事件
const handler = () => {
  categoryStore.getC2()
    // 当一级分类改变时候, 需要将二级三级的清除
    ; (categoryStore.c2Id = ''),
      (categoryStore.c3Id = ''),
      (categoryStore.c3Arr = [])
}
const handler1 = () => {
  categoryStore.getC3()
    // 当二级分类改变时候, 需要将三级的清除
    ; (categoryStore.c3Id = ''), (categoryStore.c3Arr = [])
}

// 接收场景数值
defineProps(['scene'])
</script>

<style scoped lang="scss"></style>
