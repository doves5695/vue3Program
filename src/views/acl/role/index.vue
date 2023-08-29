<template>
  <el-card>
    <el-from :inline="true" class="form">
      <el-form-item label="角色名称">
        <el-input placeholder="请输入角色名称" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="keyword ? false : true" @click="search">
          搜索
        </el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-from>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" size="default" icon="Plus" @click="addRole">
      添加职位
    </el-button>
    <el-table border style="margin: 10px 0" :data="allRole">
      <el-table-column label="#" type="index" align="center"></el-table-column>
      <el-table-column label="id" align="center" prop="id"></el-table-column>
      <el-table-column label="角色名称" align="center" show-overflow-tooltip prop="roleName"></el-table-column>
      <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
      <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
      <el-table-column label="操作" align="center" width="280px">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="User" @click="setPermisstion(row)">
            分配权限
          </el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">
            编辑
          </el-button>
          <el-button type="primary" size="small" icon="Delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[100, 200, 300, 400]"
      :background="true" layout="prev, pager, next, jumper, ->,sizes, total" :total="total" @current-change="getHasRole"
      @size-change="sizeChange" />
  </el-card>
  <el-dialog v-model="dialogVisite" :title="RoleParams.id ? '更新职位' : '添加职位'">
    <el-form :model="RoleParams" :rules="rules" ref="form">
      <el-form-item label="职位名称" prop="roleName">
        <el-input placeholder="请输入添加的职位" v-model="RoleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="default" @click="dialogVisite = false">取消</el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-dialog>
  <!-- 抽屉组件用来显示与隐藏分配权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" default-expand-all :default-checked-keys="selectArr"
        :props="defaultProps" />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermission } from '@/api/acl/role'
import type { RoleResponseData, Records, RoleData, MenuResponseData, MenuList } from '@/api/acl/role/type'
import useLayOutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus'

// 当前第几页
let pageNo = ref<number>(1)
// 一页显示多少数据
let pageSize = ref<number>(10)
// 搜索职位的关键字
let keyword = ref<string>('')
// 定义一个存放所有职位的数组
let allRole = ref<Records>([])
// 将总数动态化
let total = ref<number>(0)
// 使用仓库
let settingStore = useLayOutSettingStore()
// 控制新增和编辑对话框的开关
let dialogVisite = ref<boolean>(false)
// 收集职位变化的数据
let RoleParams = reactive({
  roleName: '',
  id: 0,
})
// 获取表单校验的表单的实例
let form = ref<any>()
// 控制抽屉显示与隐藏
let drawer = ref<boolean>(false)
// 存储权限数据的数组
let menuArr = ref<MenuList>([]);
// 用于存储四级权限的id
let selectArr = ref<any>([]);
// 获取树形结构的实例
let tree = ref<any>();

// 组件挂载完毕发请求
onMounted(() => {
  // 挂载完毕发送请求
  getHasRole()
})
// 将获取全部职位的请求方法封装成一个函数
const getHasRole = async (pager = 1) => {
  // 修改当前页码
  pageNo.value = pager
  let result: RoleResponseData = await reqAllRoleList(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  // 如果请求发送成功
  if (result.code == 200) {
    // 存储数据
    total.value = result.data.total
    allRole.value = result.data.records
  }
}

// 当页码发生变化的时候
const sizeChange = () => {
  getHasRole()
}

// 搜索按钮回调并且搜索时, 清空关键字
const search = () => {
  getHasRole()
  keyword.value = ''
}

// 重置按钮的回调
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}

// 添加职位的回调
const addRole = () => {
  dialogVisite.value = true
  // 当再次点击添加的时候清空上一次数据
  Object.assign(RoleParams, {
    roleName: '',
    id: 0,
  })
  // 还要清空表单的报错
  nextTick(() => {
    form.value.clearValidate()
  })
}

// 编辑职位的回调
const updateRole = (row: RoleData) => {
  dialogVisite.value = true
  // 存储已有的职位
  Object.assign(RoleParams, row)
  // // 当再次点击编辑的时候清空上一次数据
  // Object.assign(RoleParams, {
  //   roleName: '',
  //   id: 0
  // });
  // // 还要清空表单的报错
  nextTick(() => {
    form.value.clearValidate()
  })
}

// 表单校验事件
const validatorRoleName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位最少两个字符'))
  }
}
// 表单校验
const rules = {
  roleName: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorRoleName,
    },
  ],
}

// 确定的回调
const save = async () => {
  // 等待表单校验如果是一个成功的promise那么就继续
  await form.value.validate()
  let result: any = await reqAddOrUpdateRole(RoleParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '更新成功' : '添加成功',
    })
    dialogVisite.value = false
    getHasRole(RoleParams.id ? pageNo.value : 1)
  }
}

// 分配权限按钮的回调
const setPermisstion =async (row: RoleData) => {
  drawer.value = true;
  // 把id存储一下
  Object.assign(RoleParams, row);
  // 发请求拿数据动态展示
  let result: MenuResponseData = await reqAllMenuList(RoleParams.id);
  // console.log(result);
  // 如果请求成功立刻存储
  if (result.code == 200) {
    menuArr.value = result.data;
    selectArr.value = filterSelectArr(menuArr.value, []);
  }
}

// 树形控件
const defaultProps = {
  children: 'children',
  label: 'name',
}

// 用来筛选四级的递归
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length>0) {
      filterSelectArr(item.children, initArr);
    }
  })
  return initArr;
}

// 抽屉确定按钮的回调
const handler = async () => {
  // 将职位的id赋值
  const roleId = RoleParams.id;
  let arr = tree.value.getCheckedKeys();
  // console.log(arr)
  let arr1 = tree.value.getHalfCheckedKeys();
  // 收集permissionId
  let permissionId = arr.concat(arr1);
  // 下发权限的请求
  let result: any = await reqSetPermission(roleId, permissionId);
  if (result.code == 200) {
    ElMessage({type: 'success', message:'添加权限成功'});
    drawer.value = false;
    // 分配成功之后刷新页面
    window.location.reload();
  } else {
    ElMessage({type: 'error', message:'添加权限失败'});
  }
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
