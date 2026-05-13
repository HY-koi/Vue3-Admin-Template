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
      mockPath: 'src/api/mockData', // 确保路径正确
      localEnabled: true, // 开发环境开启
      prodEnabled: false,
      injectCode: `
        import { setupProdMockServer } from '../mockProdServer';
        setupProdMockServer();
      `,
      logger: true,
    }),
  ],
  resolve: { 
    alias: {
      '@': '/src'
    }
  }
})