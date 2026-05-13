import Mock from "mockjs";
// 定义请求拦截规则：路径、请求方法、返回数据

// 导入各模块的 mock 数据
import homeApi from "./mockData/home";
import userApi from './mockData/user';
import menuApi from './mockData/permission';

// 设置全局延时，模拟真实请求
Mock.setup({
  timeout: '200-600'
});

// ==================== Home 模块 Mock 接口 ====================
// 首页表格数据
Mock.mock("/api/home/getTableData", "get", homeApi.getTableData);
// 统计数据
Mock.mock("/api/home/getCountData", "get", homeApi.getCountData);
// 图表数据
Mock.mock("/api/home/getChartData", "get", homeApi.getChartData);

// ==================== User 模块 Mock 接口 ====================
// 获取用户列表（带分页和搜索）- 修正路径为正确的user模块路径
Mock.mock("/api/user/getUserData", "get", userApi.getUserList);
// 删除用户
Mock.mock("/api/user/deleteUser", "get", userApi.deleteUser);
// 添加用户
Mock.mock("/api/user/addUser", "post", userApi.createUser);
// 编辑用户
Mock.mock("/api/user/editUser", "post", userApi.updateUser);

// ==================== Permission 模块 Mock 接口 ====================
// 获取菜单权限
Mock.mock("/api/permission/getMenu", "post", menuApi.getMenu);

// 可选：在开发环境下输出已注册的 mock 接口
if (import.meta.env.DEV) {
  console.log('✅ Mock 接口注册完成');
  console.log('Mock 接口已注册:', [
    '/api/home/getTableData',
    '/api/home/getCountData', 
    '/api/home/getChartData',
    '/api/user/getUserData', // 修正路径
    '/api/user/deleteUser',
    '/api/user/addUser',
    '/api/user/editUser',
    '/api/permission/getMenu'
  ]);
}