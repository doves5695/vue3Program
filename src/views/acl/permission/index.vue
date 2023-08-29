<template>
  <el-table :data="PermissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
    <el-table-column label="名称" prop="name" align="center" />
    <el-table-column label="权限值" prop="code" align="center" />
    <el-table-column label="修改时间" prop="updateTime" align="center" />
    <el-table-column label="操作" align="center">
      <template #="{ row, $index }">
        <el-button type="primary" size="small" :disabled="row.level == 4 ? true : false" @click="addPermisstion(row)">{{
          row.level == 3 ? '添加功能' : '添加菜单'
        }}</el-button>
        <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false"
          @click="updatePermisstion(row)">编辑</el-button>
        <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 对话框组件 -->
  <el-dialog v-model="dialogVisible" :title="menuData.id?'更新菜单':'添加菜单'">
    <el-form label-width="80px">
      <el-form-item label="名称">
        <el-input placeholder="请输入名称" v-model="menuData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限值">
        <el-input placeholder="请输入权限值" v-model="menuData.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// 从vue引入方法
import { ref, onMounted, reactive } from 'vue'
import { reqAllPermisstion, reqAddOrUpdatePermisstion } from '@/api/acl/menu';
import type { PermissionList, PermissionResponseData, MenuParams, Permission } from '@/api/acl/menu/type';
import { ElMessage } from 'element-plus';


// 当当前页面挂载完毕的时候拿到全部数据
onMounted(() => {
  getHasPermisstion();
})
// 拿到全部的方法的回调
const getHasPermisstion = async () => {
  // 发请求
  let result: PermissionResponseData = await reqAllPermisstion();
  if (result.code == 200) {
    // 拿到数据就存储
    PermissionArr.value = result.data
  }
}

// 存储全部的数组
let PermissionArr = ref<PermissionList>([]);
// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false);
// 动态获取的对象
let menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  pid: 0,
  name: ''
})


// 添加菜单按钮的回调
const addPermisstion = (row: Permission) => {
  // 每次点击添加之前清理上一次的数据
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    pid: 0,
    name: ''
  })
  dialogVisible.value = true;
  // 收集pid和level
  menuData.level = row.level + 1;
  menuData.pid = row.id;
}
// 编辑菜单按钮的回调
const updatePermisstion = (row: Permission) => {
  dialogVisible.value = true;
  Object.assign(menuData, row);
}

// 对话框确定按钮的回调
const save = async () => {
  let result: any = await reqAddOrUpdatePermisstion(menuData);
  // 当你添加和成功之后去控制对话框隐藏
  dialogVisible.value = false;
  // 在获取一次所有数据
  getHasPermisstion();
  ElMessage({type: 'success', message: menuData.id?'更新成功': '添加成功'});

}

</script>

<style scoped lang="scss"></style>
