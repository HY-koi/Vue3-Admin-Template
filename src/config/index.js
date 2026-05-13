//根据不同的环境变量,导出不同的接口地址,总配置
const env = import.meta.env.VITE_APP_ENV || import.meta.env.MODE || "production";

// 从环境变量读取 mock 配置，默认为 false
const isMockEnabled = import.meta.env.VITE_MOCK === 'true';

const EnvConfig = {
  development: {
    baseApi: '/api',
    mockApi: '/api' // 本地 mock 使用相同的路径前缀
  },
  test: {
    baseApi: '//test.future.com/api',
    mockApi: '//test.future.com/api'
  },
  production: {
    baseApi: '//future.com/api',
    mockApi: '//future.com/api'
  },
};

export default {
  ...EnvConfig[env],
  mock: isMockEnabled,
  env,
}