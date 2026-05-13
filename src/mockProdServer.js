/**
 * 生产环境 mock 服务器配置
 * 只有在 prodEnabled: true 时才会生效
 */
import Mock from "mockjs";
import homeApi from "./api/mockData/home.js";
import userApi from './api/mockData/user.js';
import menuApi from './api/mockData/permission.js';

export function setupProdMockServer() {
  // 设置全局延时，模拟真实请求
  Mock.setup({
    timeout: '200-600'
  });
  
  // 注册所有mock接口
  Mock.mock("/api/home/getTableData", "get", homeApi.getTableData);
  Mock.mock("/api/home/getCountData", "get", homeApi.getCountData);
  Mock.mock("/api/home/getChartData", "get", homeApi.getChartData);
  Mock.mock("/api/user/getUserData", "get", userApi.getUserList);
  Mock.mock("/api/user/deleteUser", "get", userApi.deleteUser);
  Mock.mock("/api/user/addUser", "post", userApi.createUser);
  Mock.mock("/api/user/editUser", "post", userApi.updateUser);
  Mock.mock("/api/permission/getMenu", "post", menuApi.getMenu);
  
  console.log('✅ 生产环境 Mock 接口注册完成');
}