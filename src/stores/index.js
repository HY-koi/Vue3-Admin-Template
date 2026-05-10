import {defineStore} from "pinia";
import {ref ,watch} from "vue";

function initState(){
  return{
    isCollapse:false,
    tags:[
      {
        label:'首页',
        path:'/home',
        name:'home',
        icon:'home',
      },
    ],
    currentMenu:null,
    menuList:[
      {
        label:'首页',
        path:'home',
        name:'home',
        icon:'home',
        url:'Home',
      }
    ],
    token: "dev-token",
    routerList:[],
  };
}

export const useALLDataStore = defineStore('allData', () => {
  const state = ref(initState())

  // 监听state的变化，持久化到localStorage
  watch(state,(newObj)=>{
    if(newObj.token) {
      localStorage.setItem("app_token", newObj.token);
    }
    localStorage.setItem("store",JSON.stringify(newObj));
  },{deep:true})

  function selectMenu(val){
    if(val.name ==='home'){
      state.value.currentMenu = {
        label: '首页',
        path: '/home',
        name: 'home'
      };
    }else{
      state.value.currentMenu = {
        label: val.label,
        path: val.path.startsWith('/') ? val.path : `/${val.path}`,
        name: val.name
      };
    }
    
    if(val.name !== 'home'){
      let index = state.value.tags.findIndex((item) => item.name === val.name);
      if (index === -1) {
        state.value.tags.push({
          label: val.label,
          path: val.path.startsWith('/') ? val.path : `/${val.path}`,
          name: val.name
        });
      }
    }
  }

  function undateTags(tag){
    if (tag.name === 'home') {
      return;
    }
    let index = state.value.tags.findIndex((item)=>item.name===tag.name)
    if (index > -1) {
      state.value.tags.splice(index,1);
    }
  }

  function updateMenuList(val){
    state.value.menuList=val;
  }

  function addMenu(router, type){
    if(type ==='refresh'){
      const savedStore = localStorage.getItem('store');
      if(savedStore){
        try {
          const parsedStore = JSON.parse(savedStore);
          state.value = parsedStore;
          state.value.routerList = [];
        } catch (e) {
          console.warn('Failed to parse stored data, using default state');
          state.value = initState();
        }
      } else {
        return;
      }
    }
    
    const menu = state.value.menuList;
    const modules = import.meta.glob('../views/**/*.vue');
    const routerArr = [];
    
    menu.forEach((item) => {
      if(item.children){
        item.children.forEach((val) => {
          const url = `../views/${val.url}.vue`;
          if (modules[url]) {
            val.component = modules[url];
            val.path = val.path.startsWith('/') ? val.path : `/${val.path}`;
            routerArr.push(val);
          }
        });
      } else {
        const url = `../views/${item.url}.vue`;
        if (modules[url]) {
          item.component = modules[url];
          item.path = item.path.startsWith('/') ? item.path : `/${item.path}`;
          routerArr.push(item);
        }
      }
    });

    // 清理之前的动态路由
    state.value.routerList.forEach((removeFn) => {
      if(removeFn) removeFn();
    });
    state.value.routerList = [];

    // 移除现有的动态路由（除了基础路由）
    const existingRoutes = router.getRoutes();
    existingRoutes.forEach((route) => {
      if(!['main', 'login', '404', 'NotFound'].includes(route.name)) {
        router.removeRoute(route.name);
      }
    });

    // 添加新的动态路由
    routerArr.forEach((item) => {
      if (item.name && item.component) {
        const removeFn = router.addRoute('main', item);
        state.value.routerList.push(removeFn);
      }
    });
  }
  
  function clean(){
    state.value.routerList.forEach((removeFn) => {
      if(removeFn) removeFn();
    });
    state.value = initState();
    localStorage.removeItem("store");
    localStorage.removeItem("app_token");
  }
  
  return { 
    state,
    selectMenu,
    undateTags,
    updateMenuList,
    clean,
    addMenu,
  };
});