import { createApp } from 'vue'
import App from './App.vue'
import "@/api/mock.js";
import api from "@/api/api"
import "@/assets/less/index.less"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import { createPinia } from 'pinia'
import { useALLDataStore } from "@/stores"

const pinia = createPinia()
const app = createApp(App)

app.use(ElementPlus)
app.use(pinia)

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局挂载 API 实例
app.config.globalProperties.$api = api

const store = useALLDataStore()
store.addMenu(router, "refresh")

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/404') {
    next();
    return;
  }
  
  if (!store.state.token) {
    next('/login');
    return;
  }
  
  next();
});

app.use(router).mount('#app')
