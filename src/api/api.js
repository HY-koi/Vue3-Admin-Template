// 整个项目的ai统一管理
import request from "./request"
// 首页相关的api
//请求首页左侧的表格的数据
export default {
  getTableData(){
    return request({
      url:'/home/getTableData',
      // /api/home/getTableData
      // 后端接口,请求路径,请求方法
      method:'get',
      // mock:true,
    })
  },
   getCountData(){
    return request({
      url:'/home/getCountData',
      // /api/home/getTableData
      // 后端接口,请求路径,请求方法
      method:'get',
      // mock:true,
    })
  },
  getChartData(){
    return request({
      url:'/home/getChartData',
      // /api/home/getTableData
      // 后端接口,请求路径,请求方法
      method:'get',
      // mock:true,
    })
  },
  getUserData(data){
    return request({
      url:'/home/getUserData',
      // /api/home/getTableData
      // 后端接口,请求路径,请求方法
      method:'get',
      data,
      // mock:true,
    });
  },
  deleteUser(data){
    return request({
      url:'/user/deleteUser',
      // /api/home/getTableData
      // 后端接口,请求路径,请求方法
      method:'get',
      // mock:true,
      data,
    });
  },
  addUser(data){
    return request({
      url:'/user/addUser',
      // /api/home/getTableData
      // 后端接口,请求路径,请求方法
      method:'post',
      // mock:true,
      data,
    });
  },
  editUser(data){
    return request({
      url:'/user/editUser',
      // /api/home/getTableData
      // 后端接口,请求路径,请求方法
      method:'post',
      // mock:true,
      data,
    });
  },
  getMenu(params) {
    return request({
      url: '/permission/getMenu',
      method: 'post',
      data: params
    })
}
}