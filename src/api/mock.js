import Mock from "mockjs";
// 定义请求拦截规则 1.路径2.请求方法3.返回数据
import homeApi from "./mockData/home"
// 拦截 /api/home/getTableData 的get请求，返回homeApi.getStatisticalData'
import userApi from './mockData/user'
import menuApi from './mockData/permission'

// Mock.mock("/api/home/getTableData", "get", homeApi.getTableData)
// Mock.mock("/api/home/getCountData", "get", homeApi.getCountData)
// Mock.mock("/api/home/getChartData", "get", homeApi.getChartData)
// Mock.mock("/api/home/getUserData", "get", userApi.getUserList)
// Mock.mock("/api/home/deleteUser", "get", userApi.deleteUser)
Mock.mock(/\/api\/home\/getUserData/, 'get', userApi.getUserList)
Mock.mock(/\/api\/home\/getTableData/, 'get', homeApi.getTableData)
Mock.mock(/\/api\/home\/getCountData/, 'get', homeApi.getCountData)
Mock.mock(/\/api\/home\/getChartData/, 'get', homeApi.getChartData)
Mock.mock(/\/api\/user\/deleteUser/, 'get', userApi.deleteUser)
Mock.mock(/\/api\/user\/addUser/, 'post', userApi.createUser)
Mock.mock(/\/api\/user\/editUser/, 'post', userApi.updateUser)
Mock.mock(/\/permission\/getMenu/, 'post', menuApi.getMenu)
// console.log('✅ Mock 接口注册完成')
// console.log('Mock 接口已注册:', [
//   '/api/home/getTableData',
//   '/api/home/getCountData', 
//   '/api/home/getChartData',
//   '/api/home/getUserData',
//   '/api/home/deleteUser'
// ])