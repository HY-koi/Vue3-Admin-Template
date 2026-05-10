<script setup>
import CommonAside from '@/components/CommonAside.vue'
import CommonHeader from '@/components/CommonHeader.vue'
import CommonTab from '@/components/CommonTab.vue'
</script>

<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <!-- 自定义左边的组件,导航栏 -->
       <common-aside />
      <!-- 右边所有的组件 -->
        <el-container class="right-container">
          <!-- 头部 -->
          <el-header class="el-header">
            <common-header />
          </el-header>
          <!-- 主要内容 -->
           <common-Tab/>
          <el-main class="right-main">
           <router-view :key="$route.path"></router-view>
          </el-main>
        </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="less">
.common-layout {
  height: 100vh;
  overflow: hidden;
}

.lay-container {
  height: 100%;
}

.right-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.el-header {
  height: 60px !important;
  padding: 0;
  line-height: 60px;
  background-color: #333;
  color: white;
}

.right-main {
  flex: 1;
  overflow: auto;
  padding: 16px;
  background: #f0f2f5;
}
</style>
