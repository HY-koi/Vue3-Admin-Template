/**
 * 项目 API 接口统一管理
 * 所有接口调用都通过此文件导出，便于维护和 Mock 数据模拟
 */
import request from "./request";

export default {
  /**
   * 获取首页表格数据
   * @returns {Promise} 表格数据
   */
  getTableData() {
    return request({
      url: '/home/getTableData', // ✅ 正确
      method: 'get'
    });
  },

  /**
   * 获取统计数据
   * @returns {Promise} 统计数据
   */
  getCountData() {
    return request({
      url: '/home/getCountData', // ✅ 正确
      method: 'get'
    });
  },

  /**
   * 获取图表数据
   * @returns {Promise} 图表数据
   */
  getChartData() {
    return request({
      url: '/home/getChartData', // ✅ 正确
      method: 'get'
    });
  },

  /**
   * 获取用户列表数据（支持分页和搜索）
   * @param {Object} data - 请求参数 { name, page, limit }
   * @returns {Promise} 用户列表数据
   */
  getUserData(data) {
    return request({
      url: '/user/getUserData', // ✅ 正确
      method: 'get',
      data
    });
  },

  /**
   * 删除用户
   * @param {Object} data - 请求参数 { id }
   * @returns {Promise} 删除结果
   */
  deleteUser(data) {
    return request({
      url: '/user/deleteUser', // ✅ 正确
      method: 'get',
      data
    });
  },

  /**
   * 添加用户
   * @param {Object} data - 用户信息 { name, addr, age, birth, sex }
   * @returns {Promise} 添加结果
   */
  addUser(data) {
    return request({
      url: '/user/addUser', // ✅ 正确
      method: 'post',
      data
    });
  },

  /**
   * 编辑用户
   * @param {Object} data - 用户信息 { id, name, addr, age, birth, sex }
   * @returns {Promise} 编辑结果
   */
  editUser(data) {
    return request({
      url: '/user/editUser', // ✅ 正确
      method: 'post',
      data
    });
  },

  /**
   * 获取菜单权限
   * @param {Object} params - 登录参数 { username, password }
   * @returns {Promise} 菜单列表和 token
   */
  getMenu(params) {
    return request({
      url: '/permission/getMenu', // ✅ 正确
      method: 'post',
      data: params
    });
  }
}