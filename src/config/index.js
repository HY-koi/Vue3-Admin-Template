import { mock } from "mockjs";

//根据不同的环境变量,导出不同的接口地址,总配置
const env = import.meta.env.MODE ||"prod";  //获取当前环境变量,拿不到就默认是线上环境
const EnvConfig = {
  development: {
    //开发环境
    baseApi: '/api',
    //本地开发环境(真实接口)
    mockApi: 'https://apifoxmock.com/m1/4068509-0-default/api'
    // mockApi:'/api'
    //线上开发环境(模拟接口)
  },
  test: {
    //测试环境
    baseApi: '//test.future.com/api',
    //本地开发环境
    mockApi: 'https://apifoxmock.com/m1/4068509-0-default/api'
    //线上开发环境
  },
  prod: {
    //生产环境
    baseApi: '//future.com/api',
    //本地开发环境
    mockApi: 'https://apifoxmock.com/m1/4068509-0-default/api'
    //线上开发环境
  },
};

export default{
  ...EnvConfig[env],
  //mock开关
  mock:false,
  //默认的设置,如若api里面没有定义的话,线上的api关闭,本地没有拦截,那么就是真实的接口
  env,
}