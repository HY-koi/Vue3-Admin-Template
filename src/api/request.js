import axios from 'axios'
import { ElMessage } from 'element-plus';
import config from '@/config';
const service = axios.create({
  baseURL:config.baseApi,
  // baseURL:'/api', //请求地址在下面动态配置
});
const NETWORK_ERROR = '网络异常,请稍后再试!'
// 创建axios实例
// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么,异步操作
    return config;
  }, 
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// service.interceptors.response.use(
//   (response) => {
//     // 检查响应数据格式
//     if (!response.data) {
//       ElMessage.error('服务器返回数据为空')
//       return Promise.reject('服务器返回数据为空')
//     }
    
//     const { code, data, msg } = response.data
    
//     if (code === 200) {
//       return data
//     } else {
//       ElMessage.error(msg || NETWORK_ERROR)
//       return Promise.reject(msg || NETWORK_ERROR)
//     }
//   },
//   (error) => {
//     console.error('请求错误:', error)
    
//     // 更详细的错误处理
//     if (error.response) {
//       // 服务器返回错误状态码
//       ElMessage.error(`服务器错误: ${error.response.status}`)
//     } else if (error.request) {
//       // 请求已发出但没有收到响应
//       ElMessage.error('网络连接失败，请检查后端服务')
//     } else {
//       // 其他错误
//       ElMessage.error(error.message || NETWORK_ERROR)
//     }
    
//     return Promise.reject(error)
//   }
// )
// 响应拦截器
service.interceptors.response.use(
// 添加响应拦截器
  (res)=> {
    const {code,data,msg}=res.data
    if(code===200){
      return data
    }else{
      ElMessage.error(msg || NETWORK_ERROR);
      return Promise.reject(msg || NETWORK_ERROR);
    }
  },
  (error) => {
    ElMessage.error(NETWORK_ERROR)  // 简单的统一错误提示
    return Promise.reject(error)
  }
)

function request(options){
  options.method = options.method || 'get' ;
  //拼接完整的请求地址,关于get函数请求参数的调整
  if(options.method.toLowerCase() === 'get'){
    options.params = options.data
  }
  let isMock = config.mock;
  if(typeof options.mock != 'undefined'){
    isMock = options.mock
  }
  //根据是否是线上环境,决定使用线上还是本地的mock地址
  if(config.env === 'prod'){
    service.defaults.baseURL = config.baseApi
    //如果是线上环境,那么所有的请求地址都用线上地址,不使用mock地址
  }else{
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
  }

  return service(options);
}
export default request;
