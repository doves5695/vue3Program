<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
        <el-button type="primary">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" icon="Plus" @click="addUser">添加</el-button>
    <el-button type="danger" icon="Delete">批量删除</el-button>
    <el-table style="margin: 10px 0;" border :data="userArr">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="id" align="center" prop="id"></el-table-column>
      <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" width="270px">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="User">分配角色</el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
          <el-button type="primary" size="small" icon="Delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
      :background="true" layout="prev, pager, next, jumper,->,sizes, total" :total="total" @current-change="getHasUser"
      @size-change="handler" />
  </el-card>
  <!-- 抽屉结构 -->
  <el-drawer v-model="drawer">
    <!-- 抽屉的标题将来应该是动态显示的 -->
    <template #header>
      <h4>添加用户</h4>
    </template>
    <!-- 抽屉身体部分 -->
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input placeholder="请填写用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input placeholder="请填写用户昵称"></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input placeholder="请填写用户密码"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button>取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { reqUserInfo } from '@/api/acl/user/index';
import type { UserResponseData, Records, User } from '@/api/acl/user/type'
// 当前页码 
let pageNo = ref<number>(1);
// 一页展示多少数据
let pageSize = ref<number>(5);
// 用户总数
let total = ref<number>(0);
// 存储用户数据的数组
let userArr = ref<Records>([]);
// 控制抽屉的显示与隐藏
let drawer = ref<boolean>(false);


// 将获取用户信息的请求封装为一个函数
const getHasUser = async (pager = 1) => {
  // 收集当前的页码
  pageNo.value = pager;
  // 发送请求
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value);
  if (result.code == 200) {
    // 存储数据
    userArr.value = result.data.records;
    // 存储总数
    total.value = result.data.total;
  }
}

// 当挂载完毕的时候发送请求
onMounted(() => {
  getHasUser();
})

// 分页器下拉菜单的自定义回调
const handler = () => {
  getHasUser();
}

// 添加用户的回调
const addUser = () => {
  drawer.value = true;
}

// 编辑用户的回调
// row 为已有的用户信息
const updateUser = (row: User) => {
  drawer.value = true;
}

</script>



<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
