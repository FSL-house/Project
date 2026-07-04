import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite 配置文件。
// 开发环境通过代理转发接口和上传图片，生产环境建议交给 Nginx 处理。
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/uploads': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        // 按依赖拆分代码包，减少首页首次加载压力。
        manualChunks: {
          vue: ['vue', 'vue-router'],
          elementPlus: ['element-plus'],
          axios: ['axios']
        }
      }
    }
  }
})
