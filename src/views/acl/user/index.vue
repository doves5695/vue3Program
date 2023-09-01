<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="keyword ? false : true" @click="search">
          搜索
        </el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" icon="Plus" @click="addUser">添加</el-button>
    <el-button type="danger" icon="Delete" :disabled="selectIdArr?.length ? false : true" @click="deleteSelectUser">
      批量删除
    </el-button>
    <el-table style="margin: 10px 0" border :data="userArr" @selection-change="selectChange">
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
          <el-button type="primary" size="small" icon="User" @click="setRole(row)">
            分配角色
          </el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">
            编辑
          </el-button>
          <el-popconfirm :title="`你确定要删除${row.username}吗?`" width="250px;" @confirm="deleteUser(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
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
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <!-- 抽屉身体部分 -->
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input placeholder="请填写用户姓名" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input placeholder="请填写用户昵称" v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input placeholder="请填写用户密码" v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 分配角色的抽屉结构 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色(职位)</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户名字">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAllChange">
            全选
          </el-checkbox>
          <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button @click="confirmClick" type="primary">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser,
} from '@/api/acl/user/index'
import type {
  UserResponseData,
  Records,
  User,
  AllRoleResponseData,
  AllRole,
  SetRoleData,
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
// 当前页码
let pageNo = ref<number>(1)
// 一页展示多少数据
let pageSize = ref<number>(5)
// 用户总数
let total = ref<number>(0)
// 存储用户数据的数组
let userArr = ref<Records>([])
// 控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
// 控制分配角色的抽屉
let drawer1 = ref<boolean>(false)
// 响应式收集用户信息
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
// 存储职位数据用于复选框
let allRole = ref<AllRole>([])
let userRole = ref<AllRole>([])
// 获取form表单实例
let formRef = ref<any>()
// 存放批量删除的数组
let selectIdArr = ref<User[]>()
// 定义响应式数据去数据要搜索的东西
let keyword = ref<string>('')
// 获取setting仓库
let settingStore = useLayOutSettingStore()

// 将获取用户信息的请求封装为一个函数
const getHasUser = async (pager = 1) => {
  // 收集当前的页码
  pageNo.value = pager
  // 发送请求
  let result: UserResponseData = await reqUserInfo(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    // 存储数据
    userArr.value = result.data.records
    // 存储总数
    total.value = result.data.total
  }
}

// 当挂载完毕的时候发送请求
onMounted(() => {
  getHasUser()
})

// 分页器下拉菜单的自定义回调
const handler = () => {
  getHasUser()
}

// 添加用户的回调
const addUser = () => {
  drawer.value = true
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  // 每次点击之前都要清除上一次表单验证的信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}

// 编辑用户的回调
// row 为已有的用户信息
const updateUser = (row: User) => {
  // 抽屉的开关
  drawer.value = true
  Object.assign(userParams, row)
  // 每次点击之前都要清除上一次表单验证的信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}

// 确定按钮的回调
const save = async () => {
  // 在保存之前必须要求form校验全部通过
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateUser(userParams)
  // 如果是200表示发送请求成功
  if (result.code == 200) {
    // 关闭抽屉
    drawer.value = false
    // 提示信息
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    // 成功之后立刻发起请求
    getHasUser(userParams.id ? pageNo.value : 1)
    // 浏览器自动刷新一次
    window.location.reload()
  } else {
    // 关闭抽屉
    drawer.value = false
    // 提示信息
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
  }
}

// 取消按钮的回调
const cancel = () => {
  drawer.value = false
}

// 校验username方法
const validatorUsername = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    return new Error('用户名至少5位')
  }
}

// 校验name方法
const validatorName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    return new Error('昵称至少5位')
  }
}

// 校验password方法
const validatorPassword = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 6) {
    callBack()
  } else {
    return new Error('密码至少6位')
  }
}

// 表单校验规则对象
const rules = {
  // 用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

// 分配角色按钮的回调
const setRole = async (row: User) => {
  Object.assign(userParams, row)
  let result: AllRoleResponseData = await reqAllRole(userParams.id as number)
  if (result.code == 200) {
    // 存储数据
    allRole.value = result.data.allRolesList
    userRole.value = result.data.assignRoles
    drawer1.value = true
  }
}

// // 测试复选框代码
// // 全选复选框收集数据
// let checkAll = ref<boolean>(false)
// // 全部职位
// let allRole = ref(['前端', '后端', '销售', '运营', '维护'])
// // 用户已有职位
// let userRole = ref(['前端', '后端'])
// let indeterminate = ref<boolean>(true)
// // 当全选复选框发生变化的时候触发的函数
// const handleCheckAllChange = (val: boolean) => {
//   userRole.value = val ? allRole.value : []
//   indeterminate.value = false
// }
// // 底部复选框变化事件
// const handleCheckedCitiesChange = (value: string[]) => {
//   const checkoutCount = value.length
//   checkAll.value = checkoutCount === allRole.value.length
//   indeterminate.value =
//     checkoutCount > 0 && checkoutCount < allRole.value.length
// }

// 全选收集
let checkAll = ref<boolean>(false)
// 不确定事件
let indeterminate = ref<boolean>(true)
// 全选事件
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  indeterminate.value = false
}
// 底部单选事件
const handleCheckedCitiesChange = (value: string[]) => {
  // 当底部的等于全部的那么全选
  checkAll.value = value.length === allRole.value.length
  // 当不相等的时候, 不确定性为真
  indeterminate.value = value.length !== allRole.value.length
}

// 分配职位按钮的回调
const confirmClick = async () => {
  // 先收集数据
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
  }
  // 分配用户的职位
  let result: any = await reqSetUserRole(data)
  if (result.code == 200) {
    // 提示信息
    ElMessage({ type: 'success', message: '分配职务成功' })
    // 关闭抽屉
    drawer1.value = false
    // 获取更新完毕的用户信息
    getHasUser(pageNo.value)
  }
}

// 删除某个员工
const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

// table组件的复选框事件
const selectChange = (value: any) => {
  selectIdArr.value = value
}
// 批量删除按钮的回调
const deleteSelectUser = async () => {
  // 整理一下数据
  let idList: any = selectIdArr.value?.map((item) => {
    return item.id
  })
  // 发起批量删除请求
  let result: any = await reqSelectUser(idList)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '批量删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

// 搜索按钮的回调
const search = () => {
  // 再捞一次数据
  getHasUser()
  // 捞到后清除input框
  keyword.value = ''
}

// 重置按钮的回调
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
