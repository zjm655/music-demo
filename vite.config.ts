import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import type { ServerOptions } from 'vite'

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const {
    VITE_BASH_SERVER_PATH,
    VITE_BASE_PROXY_SERVER_URL,
    VITE_BASE_PROXY_OSS_URL,
    VITE_BASE_OSS_PATH,
    VITE_BASE_H5_PROXY,
  } = env

  const proxyConf: ServerOptions['proxy'] = {}
  // 服务器的代理
  if (VITE_BASH_SERVER_PATH && VITE_BASE_PROXY_SERVER_URL) {
    proxyConf[VITE_BASE_PROXY_SERVER_URL] = {
      target: VITE_BASH_SERVER_PATH,
      changeOrigin: true,
      secure: false,
    }
  }
  // OSS代理
  if (VITE_BASE_PROXY_OSS_URL && VITE_BASE_OSS_PATH) {
    proxyConf[VITE_BASE_PROXY_OSS_URL] = {
      target: VITE_BASE_OSS_PATH,
      changeOrigin: true,
      secure: false,
      rewrite: (path) => {
        const prefix = VITE_BASE_PROXY_OSS_URL
        return path.replace(new RegExp(`^${escapeRegExp(prefix)}`), '')
      },
    }
  }

  return {
    base: VITE_BASE_H5_PROXY,
    plugins: [vue(), vueDevTools()],
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
