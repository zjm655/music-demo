interface EnvConfig {
  baseUrl: string
  isDev: boolean
  isOpenLog: boolean
}
// 加载环境变量
const { VITE_LOG_ISOPEN, DEV, VITE_BASE_SERVER_PATH, VITE_BASE_PROXY_SERVER_URL } = import.meta.env

// 开发环境用代理路径（走 Vite 代理），生产环境用后端直连地址
export const baseUrl: EnvConfig['baseUrl'] = DEV
  ? (VITE_BASE_PROXY_SERVER_URL ?? '')
  : (VITE_BASE_SERVER_PATH ?? '')
export const isDev: EnvConfig['isDev'] = DEV
export const isOpenLog: EnvConfig['isOpenLog'] = VITE_LOG_ISOPEN === 'true'
