<template>
  <div>
    <!-- 三级分类组件 -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="120px"
            align="center"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template #="{ row, index }">
              <el-tag
                style="margin: 5px"
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px" align="center">
            <template #="{ row, index }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <!-- <el-button type="primary" size="small" icon="Delete" @click="deleteAttr(row.id)"></el-button> -->
              <el-popconfirm
                :title="`你确定要删除${row.attrName}的值吗?`"
                width="200px"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 展示添加与修改下方解构的内容 -->
      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请你输入属性的名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="attrParams.attrName ? false : true"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button size="default" @click="cancel">取消</el-button>
        <el-table
          border
          style="margin: 10px 0"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template #="{ row, $index }">
              <el-input
                v-if="row.flag"
                placeholder="请输入对应属性值名字"
                v-model="row.valueName"
                @blur="toLook(row, $index)"
                :ref="(vc: any) => (inputArr[$index] = vc)"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #="{ row, index }">
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice(index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category'
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import {
  reqAttr,
  reqAddOrUpdateAttr,
  reqRemoveAttr,
} from '@/api/product/attr/index'
import { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'
let categoryStore = useCategoryStore()

// 存储已有的属性和属性值
let attrArr = ref<Attr[]>([])

// 控制下放场景切换
let scene = ref<number>(0)

// 收集新增属性的数据
let attrParams = reactive<Attr>({
  attrName: '', // 新增的属性的名字
  attrValueList: [], // 新增的属性值数组
  categoryId: '', // 三级分类的ID
  categoryLevel: 3, // 代表的是三级分类
})

// 准备一个数组:将来存储对应的组件实例el-input
let inputArr = ref<any>([])

// 监听三级分类的id
watch(
  () => categoryStore.c3Id,
  () => {
    // 在下一次测试之前清空数据
    attrArr.value = []
    // 保证有三级分类的id
    if (!categoryStore.c3Id) return
    getAttr()
  },
)

// 获取数据的函数
const getAttr = async () => {
  // 解构三个分类栏的id
  const { c1Id, c2Id, c3Id } = categoryStore
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}

// 下方显示与隐藏事件
const addAttr = () => {
  scene.value = 1
  // 点击按钮的时候收集三级分类的id
  // attrParams.categoryId = categoryStore.c3Id;
  // 每次点击的时候都清空一次数据
  Object.assign(attrParams, {
    attrName: '', // 新增的属性的名字
    attrValueList: [], // 新增的属性值数组
    categoryId: categoryStore.c3Id, // 三级分类的ID
    categoryLevel: 3, // 代表的是三级分类
  })
}

// 修改改变下方显示
const updateAttr = (row: Attr) => {
  scene.value = 1
  // 将已有的属性对象赋值给attrParams对象即可
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

// 取消的回调函数
const cancel = () => {
  scene.value = 0
}

// 添加属性值按钮的回调
const addAttrValue = () => {
  // 点击添加属性值按钮的时候, 向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, // 控制编辑与观察模式的标识
  })
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

// 在保存按钮的回调
const save = async () => {
  // 发请求
  let result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改属性成功' : '添加属性成功',
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改属性失败' : '添加属性失败',
    })
  }
}

// 当input框失焦就变成观察模式
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况判断
  if (row.valueName.trim() == '') {
    // 删除对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值名称不能为空',
    })
    return
  }
  // 属性值不能有相同的
  let repeat = attrParams.attrValueList.find((item) => {
    // 判断是否相等的时候切记把自己扣出去不然相当于自己找自己
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值名称不能重复',
    })
    return
  }

  row.flag = false
}

// 点击div切换为编辑模式
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  // 响应式数据发生变化,获取更新后的DOM(组件实例)
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

// 删除某一个已有属性的方法
const deleteAttr = async (attrId: number) => {
  let result: any = await reqRemoveAttr(attrId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 如果删除成功还需要再获取一下所有的数据
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

// 路由组件跳转的时候把仓库相关分类的数据清空
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped lang="scss"></style>
