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
            <el-upload v-model:file-list="fileList" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
        </el-form-item>
        <el-form-item label="spu销售属性">
            <el-select>
                <el-option label="苹果"></el-option>
                <el-option label="华为"></el-option>
                <el-option label="三星"></el-option>
            </el-select>
            <el-button style="margin-left: 10px;" type="primary" size="default" icon="Plus">添加属性值</el-button>
            <el-table border style="margin: 10px 0">
                <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
                <el-table-column label="属性名" width="120px"></el-table-column>
                <el-table-column label="属性值"></el-table-column>
                <el-table-column label="操作" width="120px"></el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="default">保存</el-button>
            <el-button type="primary" size="default" @click="cancel">取消</el-button>
        </el-form-item>

    </el-form>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import type { SpuData } from '@/api/product/spu/type';
// 引入请求接口
import { reqAllTrademark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr } from '@/api/product/spu/index'

// 引入数据类型
import type { HasSaleAttr, SaleAttr, SpuImg, Trademark, AllTrademark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData } from '@/api/product/spu/type'

// 设置一个自定义事件来与父组件传递信息控制场景变化
let $emits = defineEmits(['changScene']);
const cancel = () => {
    $emits('changScene', 0);
}

// 存储已有的SPU这些数据
let AllTrademark = ref<Trademark[]>([]);
// 全部图片的数据
let imgList = ref<SpuImg[]>([]);
// 已有的商品的销售属性
let saleAttr = ref<SaleAttr[]>([]);
// 全部的销售属性
let allSaleAttr = ref<HasSaleAttr[]>([]);
// 存储已经存在的spu对象
let SpuParams = ref<SpuData>({
    category3Id: "",//收集三级分类的ID
    spuName: "",//SPU的名字
    description: "",//SPU的描述
    tmId: '',//品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
});



// 给子组件一个方法并且对外暴露
const initHasSpuData = async (spu: SpuData) => {
    // 当父组件把参数spu传过来的时候立刻存储进SpuParams便于在页面展示
    SpuParams.value = spu;


    // spu 即为父组件传递过来的已经有了的SPU对象数据(但是不完整, 没有图片列表等)
    // 取全部品牌数据用于第一个下拉列表
    let result: AllTrademark = await reqAllTrademark();
    // 获取某一品牌下的图片列表
    let result1: SpuHasImg = await reqSpuImageList((spu.id as number));
    // 获取已经有了的商品的销售属性
    let result2: SaleAttrResponseData = await reqSpuHasSaleAttr((spu.id as number));
    // 获取当前全部的销售属性用于table上面的下拉列表
    let result3: HasSaleAttrResponseData = await reqAllSaleAttr();

    // 全部品牌的数据
    AllTrademark.value = result.data;
    // 全部图片的数据
    imgList.value = result1.data;
    // 已有的商品的销售属性
    saleAttr.value = result2.data
    // 全部的销售属性
    allSaleAttr.value = result3.data;
}
defineExpose({ initHasSpuData });
</script>

<style scoped lang='scss'></style>