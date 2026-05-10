import { mock } from "mockjs";

//根据不同的环境变量,导出不同的接口地址,总配置
const env = import.meta.env.VITE_APP_ENV || import.meta.env.MODE || "production";

const EnvConfig = {
  development: {
    baseApi: '/api',
    mockApi: 'https://apifoxmock.com/m1/4068509-0-default/api'
  },
  test: {
    baseApi: '//test.future.com/api',
    mockApi: 'https://apifoxmock.com/m1/4068509-0-default/api'
  },
  production: {
    baseApi: '//future.com/api',
    mockApi: 'https://apifoxmock.com/m1/4068509-0-default/api'
  },
};

export default {
  ...EnvConfig[env],
  mock: false,
  env,
}