<template>
  <div class="header">
    <!-- <div style="position: absolute; top: 5px; left: 5px; color: white; font-size: 12px;">
      路由: {{ route.path }} | 首页激活: {{ isHomeActive }} | 当前激活: {{ isCurrentActive }}
    </div> -->
    <div class="l-content">
      <el-button size="small" @click="handleCollapse">
        <!-- <component class="icons" is="menu"></component> -->
         <el-icon><Menu /></el-icon>
      </el-button>
      <el-breadcrumb separator="/" class="bread">
          <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
          <el-breadcrumb-item
          :to="{ path: '/' }"
          :class="{ 'is-active': !current }"
          style="--el-text-color-primary: #fff; color: #fff; font-weight: bold;"
          >
          首页
          </el-breadcrumb-item>
          <!-- 当前激活页面 -->
          <el-breadcrumb-item 
            v-if="current" 
            :to="current.path" 
            :class="{ 'is-active': true }" 
            style="--el-text-color-primary: #fff; color: #fff; font-weight: bold;"
          >
             {{ current.label }}
          </el-breadcrumb-item>

    </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
         <img :src="getImageUrl('user')" class="user"/>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item>首页</el-dropdown-item> -->
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item @click="handleLoginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

  </div>

</template>

<script setup>
 import {ref,computed} from 'vue'
//import { Menu } from '@element-plus/icons-vue'
import {useALLDataStore} from '@/stores'
import {useRouter,useRoute} from 'vue-router'
// 用户头像
const getImageUrl = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href
}
const store =useALLDataStore()
const router =useRouter()
// 控制菜单折叠
const handleCollapse =()=>{
  // console.log('点击了');
  store.state.isCollapse=!store.state.isCollapse;//直接修改：简单直接，适用于简单的状态翻转。但是，如果修改逻辑复杂，或者需要在修改前后执行其他操作（如日志、异步操作等），则直接修改不便于集中管理。
  //修改状态管理中的isCollapse属性
  //store.changeCollapse()//将修改逻辑封装在store中，便于复用和测试。可以在action中添加额外的逻辑，比如验证、提交到服务器等。
}
// 退出登录
const handleLoginOut =()=>{
  store.clean()
  router.push('/login')

}
// 当前激活菜单项
// const current=computed(()=>store.state.currentMenu)
const current = computed(() => {
  const currentMenu = store.state.currentMenu;
  
  // 如果currentMenu不存在或者是首页，返回null（不显示二级面包屑）
  if (!currentMenu || currentMenu.name === 'home') {
    return null;
  }
  
  // 确保路径格式正确
  if (currentMenu.path && !currentMenu.path.startsWith('/')) {
    currentMenu.path = '/' + currentMenu.path;
  }
  
  return currentMenu;
});


// :deep(.bread span){
//   color:#fff !important;
//   cursor:pointer !important;
// }
</script>

<style lang="less">
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width:100%;
  height: 100%;
  background-color: #333;
}
.icons{
  height:20px; 
  width: 20px;
}
.r-content{
  .user{
    height:40px; 
    width: 40px;
    border-radius: 50%;//圆角
  }
}
.l-content{
  display: flex;
  align-items: center;
  .el-button{
    margin-right: 20px;
  }
}
.bread{
  color:#fff;
  .el-breadcrumb__item{
    font-size: 14px;
    // color:#fff;
    cursor:pointer;
  }
}
:deep(.bread span){
  color:#fff !important;
  cursor:pointer !important;
}
</style>