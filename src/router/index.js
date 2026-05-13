//引入Vue Router的核心功能，用于创建路由实例和管理路由历史记录
import {createRouter, createWebHashHistory} from "vue-router";

//这里定义了一个路由数组，每个路由对象用来映射路由路径和对应的组件
const routes = [
    { path: '/',
      //path: 指定路由的路径，这里是根路径'/'
      name:"main",
      //name: 给路由命名，方便在代码中通过名称引用路由
      component: () => import('@/views/Main.vue'),
      //component: 指定要渲染的组件。这里使用动态导入（import函数）来异步加载Main.vue组件。动态导入意味着这个组件会在需要的时候才被加载，而不是一开始就加载，这有助于减少初始加载包的体积。
      redirect: "/home",
      //redirect: 定义路由重定向，这里将根路径'/'重定向到'/home'路径
      children:[{
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/mall',
        name: 'mall',
        component: () => import('@/views/Mall.vue'),
        meta: { title: '商城' }
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('@/views/User.vue'),
        meta: { title: '用户管理' }
      }],
    },
    { 
      path: "/login",
      name: "login",
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/404.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/404.vue')
    },
  ]
//使用createRouter函数创建路由实例。Vue Router 4.x（用于Vue 3）中使用createRouter来创建路由实例。
const router = createRouter({
    history: createWebHashHistory(),
    //这里使用createWebHashHistory函数来创建基于哈希的路由历史记录模式。哈希模式使用URL中的哈希（#）部分来模拟完整的URL路径，这样可以避免服务器配置问题，因为哈希部分不会被发送到服务器。
    //这里指定使用HTML5 History模式来管理路由。这种模式利用history.pushStateAPI来实现页面跳转而无须重新加载页面。它允许使用正常的URL路径（如http://example.com/user），而不是哈希模式（如http://example.com/#/user）。
    
    routes
    //将上面定义的路由数组传递给路由实例
})


export default router;
//导出路由实例，以便在Vue应用中使用