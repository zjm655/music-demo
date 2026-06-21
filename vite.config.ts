import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import type { ServerOptions } from 'vite'

// elemment plus自动按需导入所需
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const { VITE_BASE_SERVER_PATH, VITE_BASE_PROXY_SERVER_URL, VITE_BASE_H5_PROXY } = env

  const proxyConf: ServerOptions['proxy'] = {}
  // 服务器的代理
  if (VITE_BASE_SERVER_PATH && VITE_BASE_PROXY_SERVER_URL) {
    proxyConf[VITE_BASE_PROXY_SERVER_URL] = {
      target: VITE_BASE_SERVER_PATH,
      changeOrigin: true,
      secure: false,
    }
  }

  return {
    base: VITE_BASE_H5_PROXY,
    plugins: [
      vue(),
      vueDevTools(),
      // element plus按需自动导入配置
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: proxyConf,
    },
  }
})
