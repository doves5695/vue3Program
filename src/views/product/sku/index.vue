<template>
  <el-card>
    <el-table border style="margin: 10px 0" :data="skuArr">
      <el-table-column label="序号" align="center" type="index" width="80px"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="200px" align="center" prop="skuName"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip width="200px" align="center" prop="skuDesc"></el-table-column>
      <el-table-column label="图片" width="200px" align="center">
        <template #="{ row, $index }">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px; height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="重量(g)" width="200px" align="center" prop="weight"></el-table-column>
      <el-table-column label="价格(元)" width="200px" align="center" prop="price"></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right" align="center">
        <template #="{ row, $index }">
          <el-button :type="row.isSale == 1 ? 'info' : 'success'" size="small" :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateSale(row)"></el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateSku"></el-button>
          <el-button type="info" size="small" icon="InfoFilled" @click="findSku(row)"></el-button>
          <el-popconfirm :title="`你确定要删除${row.skuName}?`" width="200px" @confirm="removeSku(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
      :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasSku"
      @size-change="handler" />
    <!-- 抽屉组件展示详情 -->
    <el-drawer v-model="drawer">
      <!-- 抽屉的标题部分 -->
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px;">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <template #="{ row, $index }">
              <el-tag style="margin: 0 5px;" v-for="item in skuInfo.skuAttrValueList" :key="item.id">{{ item.valueName
              }}</el-tag>
            </template>
          </el-col>
        </el-row>
        <el-row style="margin: 10px;">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <template #="{ row, $index }">
              <el-tag style="margin: 0 5px;" v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id">{{
                item.saleAttrValueName }}</el-tag>
            </template>
          </el-col>
        </el-row>
        <el-row style="margin: 10px;">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <template #="{ row, $index }">
              <el-carousel :interval="4000" type="card" height="200px">
                <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                  <img :src="item.imgUrl" alt="" style="width: 100%; height: 100%;">
                </el-carousel-item>
              </el-carousel>
            </template>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqSkuList, reqSaleSku, reqCancelSale, reqSkuInfo, reqRemoveSku } from '@/api/product/sku/index'
import type { SkuResponseData, SkuData, SkuInfoData } from '@/api/product/sku/type';
import { ElMessage } from 'element-plus';
// 分页器当前页码
let pageNo = ref<number>(1)
// 每一页展示多少数据
let pageSize = ref<number>(10)
let total = ref<number>();
let skuArr = ref<SkuData[]>([]);
let skuInfo = ref<any>({});

// 控制抽屉的显示与隐藏
let drawer = ref<boolean>(false);
// 当前页面挂载完毕的时候
onMounted(() => {
  getHasSku();
})
// 将请求封装成一个函数
const getHasSku = async (pager = 1) => {
  pageNo.value = pager;
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value);
  if (result.code == 200) {
    total.value = result.data.total;
    skuArr.value = result.data.records;
  }
}
// 分页器变化的事件(该方法可省略因为有v-model可以收集数据, 分页器自定义事件也可以自动注入页码)
// const handler = (num: number) => {
//   pageNo.value = num;
//     getHasSku(pageNo.value);
// }

// 分页器下拉列表发生变化的时候, 会触发
const handler = () => {
  getHasSku();
}
// 商品上架下架操作
const updateSale = async (row: SkuData) => {
  // 如果isSale值为1的时候,说明该商品正在上架, 需要发请求下架
  // 否则相反刚好
  if (row.isSale == 1) {
    let result = await reqCancelSale((row.id as number));
    if (result.code == 200) {
      ElMessage({
        type: 'success',
        message: '下架成功!'
      });
      // 再发请求获取更新完毕的全部sku数据
      getHasSku(pageNo.value);
    } else {
      ElMessage({
        type: 'error',
        message: '下架失败!'
      });
    }
  } else {
    let result = await reqSaleSku((row.id as number));
    if (result.code == 200) {
      ElMessage({
        type: 'success',
        message: '上架成功!'
      });
      // 再发请求获取更新完毕的全部sku数据
      getHasSku(pageNo.value);
    } else {
      ElMessage({
        type: 'error',
        message: '上架失败!'
      });
    }
  }
}
// 更新已有的sku
const updateSku = () => {
  ElMessage({
    type: 'info',
    message: '该模块正在维护...!'
  });
}

// 查看sku
const findSku = async (row: SkuData) => {
  drawer.value = true;
  // 获取已有商品的详情数据
  let result: SkuInfoData = await reqSkuInfo((row.id as number));
  // 存储已有的sku
  skuInfo.value = result.data;
}

// 删除某一个已有的商品
const removeSku = async (id: number) => {
  let result: any = await reqRemoveSku(id);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功!'
    });
    // 再发请求获取更新完毕的全部sku数据
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败!'
    })
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
