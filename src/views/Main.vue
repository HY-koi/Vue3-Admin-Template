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
        <el-container>
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
// .common-layout,.lay-container{
//   width: 100%;
//   height: 100vh;
// }
// .el-header{
//   background-color: #333;
// }
.common-layout {
  height: 100vh;
  overflow: hidden;
}

.lay-container {
  height: 100vh; /* 关键：固定高度 */
}

.right-container {
  height: 100vh; /* 关键：固定高度 */
  display: flex;
  flex-direction: column;
}

.el-header {
  height: 60px !important; /* 强制高度 */
  flex-shrink: 0;
  background-color: #333;
}

.right-main {
  flex: 1;
  height: calc(100vh - 100px) !important; /* 强制计算高度 */
  overflow: auto;
  padding: 16px;
  background: #f0f2f5;
}
</style>
