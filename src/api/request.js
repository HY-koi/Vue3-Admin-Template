import axios from 'axios'
import { ElMessage } from 'element-plus';
import config from '@/config';

const service = axios.create({
  baseURL: config.baseApi,
  timeout: 10000, // 添加请求超时
});

const NETWORK_ERROR = '网络异常，请稍后再试！'

// 请求拦截器
service.interceptors.request.use(
  function (config) {
    // 可以在这里添加认证token等
    return config;
  }, 
  function (error) {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    const { code, data, msg } = res.data || {};
    
    if (code === 200) {
      return data;
    } else {
      ElMessage.error(msg || NETWORK_ERROR);
      return Promise.reject(msg || NETWORK_ERROR);
    }
  },
  (error) => {
    let message = NETWORK_ERROR;
    
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 401:
          message = '未授权，请重新登录';
          break;
        case 403:
          message = '拒绝访问';
          break;
        case 404:
          message = '请求地址出错';
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = `请求失败: ${error.response.status}`;
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      message = '网络连接失败，请检查网络或后端服务';
    }
    
    ElMessage.error(message);
    return Promise.reject(error);
  }
)

function request(options){
  options.method = options.method || 'get';
  
  // 处理GET请求参数
  if(options.method.toLowerCase() === 'get'){
    options.params = options.data;
  }
  
  let isMock = config.mock;
  if(typeof options.mock !== 'undefined'){
    isMock = options.mock;
  }
  
  // 根据环境设置baseURL
  if(config.env === 'prod'){
    service.defaults.baseURL = config.baseApi;
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
  }

  return service(options);
}

export default request;
