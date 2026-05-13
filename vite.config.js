import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    viteMockServe({
      mockPath: 'src/api', // 修改为包含mock.js的目录
      localEnabled: true, // 开发环境开启
      prodEnabled: false,
      supportTs: true,
      watchFiles: true,
      injectCode: `
        import { setupProdMockServer } from '../mockProdServer';
        setupProdMockServer();
      `,
      logger: true,
      ignore: [\ /^_/, // 忽略以下划线开头的文件
        /\.test\.$/, // 忽略.test文件
        /\.prod\.mock\.js$/ // 忽略.prod.mock.js文件
      ]
    }),
  ],
  resolve: { 
    alias: {
      '@': '/src'
    }
  }
})