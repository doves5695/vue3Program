<template>
  <el-form label-width="100px">
    <el-form-item label="spu名称">
      <el-input placeholder="请输入spu名称" v-model="SpuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="spu品牌">
      <el-select v-model="SpuParams.tmId">
        <el-option :label="item.tmName" v-for="(item, index) in AllTrademark" :key="item.id" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="spu描述">
      <el-input type="textarea" placeholder="请你输入spu描述" v-model="SpuParams.description"></el-input>
    </el-form-item>
    <el-form-item label="spu照片">
      <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
        :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handleUpload">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="spu销售属性">
      <el-select :placeholder="unSelectSaleAttr.length
        ? `你还有${unSelectSaleAttr.length}个可以添加`
        : '无'
        " v-model="SaleAttrIdAndValue">
        <el-option :value="`${item.id}:${item.name}`" v-for="(item, index) in unSelectSaleAttr" :label="item.name"
          :key="item.id"></el-option>
      </el-select>
      <el-button style="margin-left: 10px" type="primary" size="default" icon="Plus"
        :disabled="SaleAttrIdAndValue ? false : true" @click="addSaleAttr">
        添加属性
      </el-button>
      <el-table border style="margin: 10px 0" :data="saleAttr">
        <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
        <el-table-column label="销售属性名" width="120px" align="center" prop="saleAttrName"></el-table-column>
        <el-table-column label="销售属性值">
          <template #="{ row, $index }">
            <el-tag v-for="(item, index) in row.spuSaleAttrValueList" :key="row.id" class="mx-1" closable
              style="margin: 0 5px" @close="row.spuSaleAttrValueList.splice(index, 1)">
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input v-model="row.saleAttrValue" v-if="row.flag == true" placeholder="请你输入属性值" size="small"
              style="width: 100px" @blur="toLook(row)"></el-input>
            <el-button v-else type="success" size="small" icon="Plus" @click="toEdit(row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px" align="center">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="Delete" @click="saleAttr.splice($index, 1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save" :disabled="saleAttr.length>0?false:true">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SpuData } from '@/api/product/spu/type'
// 引入请求接口
import {
  reqAllTrademark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu
} from '@/api/product/spu/index'

// 引入数据类型
import type {
  SaleAttrValue,
  HasSaleAttr,
  SaleAttr,
  SpuImg,
  Trademark,
  AllTrademark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
} from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

// 设置一个自定义事件来与父组件传递信息控制场景变化
let $emits = defineEmits(['changScene'])
const cancel = () => {
  $emits('changScene', 0)
}

// 存储已有的SPU这些数据
let AllTrademark = ref<Trademark[]>([])
// 全部图片的数据
let imgList = ref<SpuImg[]>([])
// 已有的商品的销售属性
let saleAttr = ref<SaleAttr[]>([])
// 全部的销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])
// 存储已经存在的spu对象
let SpuParams = ref<SpuData>({
  category3Id: '', //收集三级分类的ID
  spuName: '', //SPU的名字
  description: '', //SPU的描述
  tmId: '', //品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
})

// 控制图片下的对话框显示与隐藏
let dialogVisible = ref<boolean>(false)
// 用于存储图片的url地址
let dialogImageUrl = ref<string>('')

// 将来用来收集还未选择的销售属性的ID与属性的名字
let SaleAttrIdAndValue = ref<string>('')

// 给子组件一个方法并且对外暴露
const initHasSpuData = async (spu: SpuData) => {
  // 当父组件把参数spu传过来的时候立刻存储进SpuParams便于在页面展示
  SpuParams.value = spu

  // spu 即为父组件传递过来的已经有了的SPU对象数据(但是不完整, 没有图片列表等)
  // 取全部品牌数据用于第一个下拉列表
  let result: AllTrademark = await reqAllTrademark()
  // 获取某一品牌下的图片列表
  let result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  // 获取已经有了的商品的销售属性
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  // 获取当前全部的销售属性用于table上面的下拉列表
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()

  // 全部品牌的数据
  AllTrademark.value = result.data
  // 全部图片的数据
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  // 已有的商品的销售属性
  saleAttr.value = result2.data
  // 全部的销售属性
  allSaleAttr.value = result3.data
}

// 点击图片上的放大镜的时候触发的钩子函数
const handlePictureCardPreview = (file: any) => {
  dialogVisible.value = true
  dialogImageUrl.value = file.url
}

// 照片墙删除照片时候触发的钩子函数
const handleRemove = () => { }

// 照片墙上传照片之前的限制条件
const handleUpload = (file: any) => {
  if (
    file.type == 'image/jpeg' ||
    file.type == 'image/gif' ||
    file.type == 'image/png'
  ) {
    if (file.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '长传图片的大小超过最大限度',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '长传图片的格式不正确',
    })
  }
}

// 通过计算属性来过滤出还有哪个没有使用
let unSelectSaleAttr = computed(() => {
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})

// 添加一个销售属性
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = SaleAttrIdAndValue.value.split(':')
  // 准备一个新的销售属性对象, 用于将来传个服务器
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  // 追加到销售属性当中
  saleAttr.value.push(newSaleAttr)
  // 添加成功后清空下拉列表当中的值
  SaleAttrIdAndValue.value = ''
}

// 属性按钮的点击事件
const toEdit = (row: SaleAttr) => {
  row.flag = true
  // 定义一个新的属性用于存储我们新增的属性值
  row.saleAttrValue = ''
}

// 表单元素失去焦点的事件回调
const toLook = (row: SaleAttr) => {
  // 收集属性的ID和属性的名字
  const { baseSaleAttrId, saleAttrValue } = row
  // 整理成为服务器需要的数据
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }
  // 在追加之前进行非法判断
  if ((saleAttrValue as string).trim() == '') {
    ElMessage({
      type: 'error',
      message: '添加的销售类型值不能为空',
    })
    return
  }
  // 判断是否重复
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '添加的属性值重复',
    })
    return
  }
  // 追加一个新的服务器认识的属性值
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  // 追加结束后切换为观察模式
  row.flag = false
}

// 
const save = async () => {
  // 整理照片墙和销售属性的参数
  // 1.整理照片墙(通过map方法来修改参数)
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  });
  // 2.整理销售属性数据
  SpuParams.value.spuSaleAttrList = saleAttr.value;
  // 发送请求: 有两种可能可能是修改可能是新增
  let result = await reqAddOrUpdateSpu(SpuParams.value);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功'
    });
    // 如果成功通过自定义事件来通知父组件切换场景
    $emits('changScene', 0);
  } else {
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '更新失败' : '添加失败'
    });
  }
}

defineExpose({ initHasSpuData })
</script>

<style scoped lang="scss"></style>
