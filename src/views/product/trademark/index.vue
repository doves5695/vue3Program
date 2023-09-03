<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部添加品牌按钮 -->
      <el-button type="primary" size="default" icon="Plus" @click="addTrademark" v-has="`btn.Trademark.add`">
        添加品牌
      </el-button>
      <!-- 表格组件用于展示已用的平台数据 -->
      <el-table style="margin: 10px 0px" border :data="trademarkArr">
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
        <el-table-column label="品牌名称" align="center">
          <!-- el-table-column内容除了prop可以解决还可以自定义插槽 -->
          <template #="{ row, $index }">
            <pre style="color: brown">{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO" align="center">
          <template #="{ row, $index }">
            <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作" align="center">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)"></el-button>
            <el-popconfirm :title="`您确定删除${row.tmName}品牌吗`" width="250px" icon="Delete"
              @confirm="removeTrademark(row.id)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器组件 -->
      <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :background="true"
        layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasTrademark"
        @size-change="sizeChange" />
    </el-card>
    <!-- 对话框组件 -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
      <el-form style="width: 80%" label-width="100px" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input placeholder="请输入你要添加的品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽 -->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-button type="primary" size="default" @click="confirm">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqADDOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark/index'
import type {
  Records,
  TrademarkResponseData,
  Trademark,
} from '@/api/product/trademark/type'
import { ElMessage, UploadProps } from 'element-plus'
// 默认页码
let pageNo = ref<number>(1)
// 每页展示多少数据
let limit = ref<number>(3)
// 存储已有品牌数据总数
let total = ref<number>(0)
// 存储已有品牌的数据
let trademarkArr = ref<Records>([])

// 控制对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)

// 定义收集新增品牌数据
let trademarkParams = reactive<Trademark>({
  tmName: '',
  logoUrl: '',
})

// 获取表单实例
let formRef = ref()

// 将获取品牌数据的接口请求封装为一个函数
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  let result: TrademarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  if (result.code === 200) {
    // 总数
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}

// 当组件当中挂载完毕就发一次请求去获取品牌数据
onMounted(() => {
  getHasTrademark()
})

// 分页器页面发送变化的时候会触发(会回传当前页码)
// const changePageNo = () => {
//   // 当页面发送变化再发请求
//   getHasTrademark();
// }

// 当下拉菜单发送变化时触发方法
const sizeChange = () => {
  // pageNo.value = 1;
  getHasTrademark()
}

// 添加品牌按钮的回调
const addTrademark = () => {
  dialogFormVisible.value = true
  // 清空收集数据
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  // 清空校验
  // formRef.value?.clearValidate('tmName');
  // formRef.value?.clearValidate('logoUrl');
  nextTick(() => {
    formRef.value?.clearValidate('tmName')
    formRef.value?.clearValidate('logoUrl')
  })
}

// 修改已有品牌的按钮的回掉
const updateTrademark = (row: Trademark) => {
  nextTick(() => {
    formRef.value?.clearValidate('tmName')
    formRef.value?.clearValidate('logoUrl')
  })
  dialogFormVisible.value = true
  // trademarkParams.id = row.id;
  // 展示已有品牌数据
  // trademarkParams.tmName = row.tmName;
  // trademarkParams.logoUrl = row.logoUrl;
  // 对象合并
  Object.assign(trademarkParams, row)
}

// 对话框底部取消按钮
const cancel = () => {
  dialogFormVisible.value = false
}

// 对话框底部确认按钮
const confirm = async () => {
  // 等表单全部校验完毕再执行后面的语句
  await formRef.value.validate()
  let result: any = await reqADDOrUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    // 再次发请求获取全部品牌总数
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '修改品牌成功',
    })
    dialogFormVisible.value = true
  }
}

// 上图图片成功之前的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 上传文件之前可以约束文件类型的大小
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传的文件已超过大小',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传的文件务必是PNG|JPG|GIF',
    })
    return false
  }
}

// 上传图片成功的钩子函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  trademarkParams.logoUrl = response.data
  formRef.value.clearValidate()
}

// 品牌自定义校验规则方法
const validatorTmName = (rule: any, value: any, callBack: any) => {
  // 自定义校验
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称应该大于两位'))
  }
}
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  if (value) {
    callBack()
  } else {
    callBack(new Error('logo的图片是必要的'))
  }
}

// 表单校验规则
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}

// 气泡框确定按钮的回调
const removeTrademark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除该品牌成功',
    })
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除该品牌失败',
    })
  }
}
</script>

<!-- <style scoped lang="scss"></style> -->
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
