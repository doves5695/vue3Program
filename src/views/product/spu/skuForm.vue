<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="请输入SKU的名称"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input type="number" placeholder="价格(元)"></el-input>
    </el-form-item><el-form-item label="重量(克)">
      <el-input type="number" placeholder="重量(克)"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input type="textarea" placeholder="SKU描述"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item label="内存">
          <el-select>
            <el-option label="64G"></el-option>
            <el-option label="128G"></el-option>
            <el-option label="256G"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内存">
          <el-select>
            <el-option label="64G"></el-option>
            <el-option label="128G"></el-option>
            <el-option label="256G"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内存">
          <el-select>
            <el-option label="64G"></el-option>
            <el-option label="128G"></el-option>
            <el-option label="256G"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item label="颜色">
          <el-select>
            <el-option label="64G"></el-option>
            <el-option label="128G"></el-option>
            <el-option label="256G"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="尺码">
          <el-select>
            <el-option label="64G"></el-option>
            <el-option label="128G"></el-option>
            <el-option label="256G"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内存">
          <el-select>
            <el-option label="64G"></el-option>
            <el-option label="128G"></el-option>
            <el-option label="256G"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border>
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片"></el-table-column>
        <el-table-column label="名称"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
let $emit = defineEmits(['changScene']);
// 取消按钮的回调
const cancel = () => {
  $emit('changScene', {flag: 0, params: ''});
}
</script>

<style scoped lang="scss"></style>
