<template>
    <div class="layout_container">
        <!-- 左侧的菜单导航栏 -->
        <div class="layout_slider">123</div>
        <!-- 顶部导航 -->
        <div class="layout_tabbar">456</div>
        <!-- 内容主要展示区 -->
        <div class="layout_main">
            <p style="height: 10000px; background-color: palevioletred;">我是段落</p>
        </div>
    </div>
</template>

<script setup lang='ts'>

</script>

<style scoped lang='scss'>
.layout_container {
    width: 100%;
    height: 100vh;
    .layout_slider {
        width: $base-menu-width;
        height: 100vh;
        background-color: $base-menu-background;
    }
    .layout_tabbar {
        position: fixed;
        width: calc(100% - $base-menu-width);
        height: $base-tabbar-height;
        background-color: green;
        top: 0;
        left: $base-menu-width;
    }
    .layout_main {
        position: absolute;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        background-color: blue;
        left: $base-menu-width;
        top: $base-tabbar-height;
        padding: 20px;
        overflow: auto;
    }
    
}
</style>