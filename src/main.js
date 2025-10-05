import { createApp } from 'vue'
//从Vue框架中导入createApp函数。这个函数用于创建一个Vue应用实例。
import App from './App.vue'
//导入根组件App.vue。这个组件通常是应用的入口组件，包含了整个应用的结构和逻辑。
import "@/api/mock.js";
import api from "@/api/api"

import "@/assets/less/index.less"
//导入全局样式文件index.less。这个文件通常包含应用的全局样式设置。
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//引入element-plus组件库及其样式文件，并导入所有图标组件
import router from './router'
//从当前目录下的router模块中导入路由配置。通常，router是一个包含了路由定义和路由实例的文件（如index.js）。
import {createPinia} from 'pinia'
import {useALLDataStore} from "@/stores"


const pinia =createPinia()
//引入pinia状态管理库，并创建一个pinia实例
//引入element-plus图标库，导入所有图标组件
const app = createApp(App)
//使用createApp函数并传入根组件App，创建一个Vue应用实例，并将其赋值给常量app
// app.config.globalProperties.$api=api
//将api对象挂载到Vue应用实例的全局属性中，这样在任何组件中都可以通过this.$api访问api对象

app.use(ElementPlus)
//引入element-plus组件库，并在Vue应用中注册使用
app.use(pinia)
//在Vue应用中注册pinia实例，以便在应用中使用状态管理功能
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$api=api
//将api对象挂载到Vue应用实例的全局属性中，这样在任何组件中都可以通过this.$api访问api对象

const store =useALLDataStore()
//创建并获取Pinia store实例

store.addMenu(router,"refresh")
//动态添加路由
router.beforeEach((to, from, next) => {
  // console.log('🔄 路由跳转:', from.path, '->', to.path);
  if (to.path === '/login' || to.path === '/404') {
    next();
    return;
  }
  
  if (!store.state.token) {
    next('/login');
    return;
  }
  
  // console.log('✅ 有 token,允许访问');
  next();
});

//全局前置守卫
//在路由跳转之前执行的函数，可以用来检查用户是否有权限访问某个路由，或者进行其他的逻辑处理。
//这个函数接收三个参数：to（目标路由对象）、from（当前路由对象）和next（一个函数，用于决定是否允许导航）。
//在这个例子中，守卫检查如果目标路径是'/login'，则直接放行（next()）。如果用户没有token（表示未登录），则重
//定向到登录页（next('/login')）。否则，允许导航继续（next()）。


app.use(router).mount('#app')
//创建Vue应用实例，并将路由器集成到应用中，最后将应用挂载到id为'app'的DOM元素上
//挂载到DOM：将应用渲染到页面上的指定位置
//根组件是 Vue 应用的最顶层组件，是所有其他组件的容器和起点
//app.mount('#app') 就像是在说：「Vue，请把你创建的所有组件和页面，都放到 HTML 中那个 id 为 'app' 的 div 里面去，让用户能够看到和使用它们。」

// app.mount('#app')
//将Vue应用实例挂载到id为'app'的DOM元素上，使应用生效并显示在页面中
