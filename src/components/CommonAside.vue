<template>
  <el-aside :width="width">
     <!-- 总控制菜单的地方 -->
       <!-- <div>菜单数量: {{ list.length }}</div> -->
    <el-menu  
      background-color="#545c64"
      text-color="#fff"
      :collapse="isCollapse"
      :collapse-transition="false"
      :default-active="activeMenu"
      >
      <h3 v-show="!isCollapse">通用后台管理</h3>
      <h3 v-show="isCollapse">后台</h3>
        <el-menu-item 
            v-for="item in noChildren"
            :index="item.path"
            :key="item.path"
            @click="handleMenu(item)"
        >
          <component class="icons" :is="item.icon"></component>
          <span>{{item.label}}</span>
        </el-menu-item>

        <el-sub-menu
            v-for="item in hasChildren"
            :index="item.path"
            :key="item.path" 
        >
          <template #title>
           <component class="icons" :is="item.icon"></component>
           <span>{{item.label}}</span>
          </template>
          <el-menu-item-group >
            <el-menu-item 
                v-for="(subItem) in item.children"
                :index="subItem.path"
                :key="subItem.path"
                @click="handleMenu(subItem)"
            > 
             <component class="icons" :is="subItem.icon"></component>
             <span>{{subItem.label}}</span>
          </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

      </el-menu>
  </el-aside>

</template>

<script setup>
import {ref,computed} from 'vue'
import {useALLDataStore} from '@/stores'
import {useRouter,useRoute} from 'vue-router'


// const list =ref([
//       	{
//           path: '/home',
//           name: 'home',
//           label: '首页',
//           icon: 'house',
//           url: 'Home'
//       	},
//         {
//             path: '/mall',
//             name: 'mall',
//             label: '商品管理',
//             icon: 'video-play',
//             url: 'Mall'
//         },
//         {
//             path: '/user',
//             name: 'user',
//             label: '用户管理',
//             icon: 'user',
//             url: 'User'
//         },
//         {
//             path: '/other',
//             name: 'other',
//             label: '其他',
//             icon: 'location',
//             children: [
//                 {
//                     path: 'page1',
//                     name: 'page1',
//                     label: '页面1',
//                     icon: 'setting',
//                     url: 'Page1'
//                 },
//                 {
//                     path: 'page2',
//                     name: 'page2',
//                     label: '页面2',
//                     icon: 'setting',
//                     url: 'Page2'
//                 }
//             ]
//         }
// ])
// const noChildren = computed(() => {
//   const result = list.value.filter(item => !item.children)
//   console.log('无子菜单数量:', result.length)
//   return result
// })

// const hasChildren = computed(() => {
//   const result = list.value.filter(item => item.children)
//   console.log('有子菜单数量:', result.length)
//   return result
// })
const noChildren=computed(()=>list.value.filter(item=>!item.children))
const hasChildren=computed(()=>list.value.filter(item=>item.children))
// 这两行代码是 Vue 3 Composition
// API 中的计算属性，用于根据数据是否有 children 属性来过滤和分类数据。
const store =useALLDataStore()
const isCollapse =computed(()=>store.state.isCollapse)
//width
const width =computed(()=>store.state.isCollapse?'64px':'180px')
const router =useRouter()
const route =useRoute()
const activeMenu =computed(()=>route.path) 

const list = computed(() => store.state.menuList)

//当前激活的菜单项，初始值为当前路由的路径
//监听路由变化，更新activeMenu
const handleMenu=(item)=>{
  // console.log(item);
  router.push(item.path) //菜单跳转
  store.selectMenu(item) //修改当前选中的菜单
}
</script>

<style lang="less">
.icons{
  width:18px;
  height: 18px;
  margin-right: 5px;
}
.el-menu{
  border-right: none;
  h3  {
    line-height:48px;
    color:#fff;
    text-align: center;
  }
}
.el-aside{
  height: 100%;
  background-color: #545c64;
}

</style>