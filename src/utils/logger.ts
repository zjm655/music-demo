// 日志打印工具，用于控制区分生产环境与开发环境的打印内容
import { isOpenLog, isDev } from '@/config/env'

const isLog = isOpenLog && isDev
export const logger = {
  log(...args: unknown[]) {
    if (isLog) console.log(...args)
  },
  info(...args: unknown[]) {
    if (isLog) console.info(...args)
  },
  warn(...args: unknown[]) {
    if (isLog) console.warn(...args)
  },
  debug(...args: unknown[]) {
    if (isLog) console.debug(...args)
  },
  error(...args: unknown[]) {
    console.error(...args)
  },
}
