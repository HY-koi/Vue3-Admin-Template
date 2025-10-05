import {defineStore} from "pinia";
import {ref ,watch} from "vue";
//定义并导出一个Pinia store，命名为'allData'。这个store包含状态、计算属性和方法
function initState(){
  // 如果没有保存过，就保存到 localStorage
  // if (!savedToken) {
  //   localStorage.setItem('app_token', defaultToken);
  // }

  return{
    isCollapse:false,//侧边栏是否折叠
    tags:[
      {
        label:'首页',
        path:'/home',
        name:'home',
        icon:'home',

      },
    ],
    currentMenu:null,//当前选中的菜单
    menuList:[
      {
        label:'首页',
        path:'home',
        name:'home',
        icon:'home',
        url:'Home',
      }
    ],//菜单数据
    token: "dev-token",
    // savedToken||"dev-token",//登录成功后的标志
    routerList:[],//存储动态添加的路由

  };
}
export const useALLDataStore = defineStore('allData', () => {
  //ref state属性
  //computed getters 计算属性
  //function actions 方法

  const state=ref(initState())//使用reative或ref来定义响应式状态

  // 监听state的变化，将state存储到localStorage中
  watch(state,(newObj)=>{
    if(newObj.token) {
      localStorage.setItem("app_token", newObj.token);
    }
    localStorage.setItem("store",JSON.stringify(newObj));
  },{deep:true})

  function selectMenu(val){
    //点击菜单，添加标签
    if(val.name ==='home'){
      state.value.currentMenu = {  // ← 首页时也设置 currentMenu
      label: '首页',
      path: '/home',
      name: 'home'
    };
    }else{
      state.value.currentMenu=val;
      let index=state.value.tags.findIndex((item)=>item.name===val.name)
      index ===-1?state.value.tags.push(val):'';
      //  if (index === -1) state.value.tags.push(val);
    }
  }

  function undateTags(tag){
    if (tag.name === 'home') {
      return;
    }
    let index=state.value.tags.findIndex((item)=>item.name===tag.name)
    state.value.tags.splice(index,1);
  }

  function updateMenuList(val){
    state.value.menuList=val;
  }
 function addMenu(router,type){
    if(type ==='refresh'){
      if(JSON.parse(localStorage.getItem('store'))){
        state.value=JSON.parse(localStorage.getItem('store'));
        state.value.routerList=[];
      }else{
        return;
      }
    }
    
    // 获取store中的菜单列表
    const menu= state.value.menuList;
    console.log('📋 菜单数据:', menu);
    // 使用Vite的glob导入功能，动态获取所有Vue组件文件，vue界面
    // 这会返回一个对象，键是文件路径，值是动态导入函数
    const module =import.meta.glob('../views/**/*.vue')
    // console.log('🔍 找到的Vue组件:', Object.keys(module));
    // 创建路由数组，用于存储处理后的路由配置
    const routerArr=[];
     // 遍历菜单项,一共有两种情况
    menu.forEach((item)=>{
        // 如果菜单项有子菜单（如"其他"菜单）
      if(item.children){
        // 构建组件（界面）文件路径，如：../views/Page1.vue
        item.children.forEach((val)=>{
          let url = `../views/${val.url}.vue`;  // 添加反引号;
          // 将对应的组件（界面）导入函数赋值给路由配置，得到对应的组件（界面）路径
          val.component=module[url];
           // 将子菜单项添加到路由数组
           if (val.path && val.path.startsWith('/')) {
              val.path = val.path.slice(1); // 移除开头的斜杠
           }
          routerArr.push(val);
        })
      }else{
         let url=`../views/${item.url}.vue`;
        item.component=module[url];
         if (item.path && item.path.startsWith('/')) {
           item.path = item.path.slice(1); // 移除开头的斜杠
         }
        routerArr.push(item);
      }
    })

    state.value.routerList.forEach((item)=>{
           if(item) item();
    });
    state.value.routerList=[];
    let routers=router.getRoutes();
    routers.forEach((item)=>{
      if(item.name =='main' || item.name=='login' || item.name=='404' || item.name=='NotFound'){
        return;
      }else{
        router.removeRoute(item.name);
      }

    })

    //路由的动态添加
    routerArr.forEach((item)=>{
      // 将每个路由配置添加到名为'main'的父路由下
      state.value.routerList.push(router.addRoute('main',item));
    })
  } 
 
  function clean(){
    state.value.routerList.forEach((item)=>{
      if(item) item();
    });
    // 清除路由
    state.value=initState();
    //重置state
    localStorage.removeItem("store");
    localStorage.removeItem("app_token"); // 清理 token
  }
  return { 
    state,
    selectMenu,
    undateTags,
    updateMenuList,
    clean,
    addMenu,
  };
})