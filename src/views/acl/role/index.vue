<template>
  <el-card>
    <el-from :inline="true" class="form">
      <el-form-item label="角色名称">
        <el-input placeholder="请输入角色名称" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="keyword?false:true" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-from>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" size="default" icon="Plus">添加职位</el-button>
    <el-table border style="margin: 10px 0" :data="allRole">
      <el-table-column label="#" type="index" align="center"></el-table-column>
      <el-table-column label="id" align="center" prop="id"></el-table-column>
      <el-table-column label="角色名称" align="center" show-overflow-tooltip prop="roleName"></el-table-column>
      <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
      <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
      <el-table-column label="操作" align="center" width="280px">
        <template #="{row, $index}">
          <el-button type="primary" size="small" icon="User">分配权限</el-button>
          <el-button type="primary" size="small" icon="Edit">编辑</el-button>
          <el-button type="primary" size="small" icon="Delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[100, 200, 300, 400]"
      :background="true" layout="prev, pager, next, jumper, ->,sizes, total" :total="total" @current-change="getHasRole" @size-change="sizeChange"/>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqAllRoleList } from '@/api/acl/role';
import type { RoleResponseData, Records } from '@/api/acl/role/type';
import useLayOutSettingStore from '@/store/modules/setting';

// 当前第几页
let pageNo = ref<number>(1)
// 一页显示多少数据
let pageSize = ref<number>(10)
// 搜索职位的关键字
let keyword = ref<string>('')
// 定义一个存放所有职位的数组
let allRole = ref<Records>([]);
// 将总数动态化
let total = ref<number>(0);
// 使用仓库
let settingStore = useLayOutSettingStore();



// 组件挂载完毕发请求
onMounted(() => {
  // 挂载完毕发送请求
  getHasRole();
})
// 将获取全部职位的请求方法封装成一个函数
const getHasRole = async (pager = 1) => {
  // 修改当前页码
  pageNo.value = pager;
  let result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value);
  // 如果请求发送成功
  if (result.code == 200) {
    // 存储数据
    total.value = result.data.total;
    allRole.value = result.data.records;
  }
}

// 当页码发生变化的时候
const sizeChange = () => {
  getHasRole();
}

// 搜索按钮回调并且搜索时, 清空关键字
const search = () => {
  getHasRole();
  keyword.value = '';
}

// 重置按钮的回调
const reset = () => {
  settingStore.refsh = !settingStore.refsh;
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>
