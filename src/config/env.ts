interface EnvConfig {
  baseUrl: string
  isDev: boolean
  isOpenLog: boolean
}
// 加载环境变量
const { VITE_LOG_ISOPEN, DEV, VITE_BASE_SERVER_PATH } = import.meta.env

export const baseUrl: EnvConfig['baseUrl'] = VITE_BASE_SERVER_PATH ?? ''
export const isDev: EnvConfig['isDev'] = DEV
export const isOpenLog: EnvConfig['isOpenLog'] = VITE_LOG_ISOPEN === 'true'
