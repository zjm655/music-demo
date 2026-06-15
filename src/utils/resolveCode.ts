import { logger } from '@/utils/logger'
import type { LogCfg } from '@/types/requestType'

export const resolveCode = (logCfg: LogCfg) => {
  switch (logCfg.code) {
    case 200:
      logger.log(logCfg?.message || '请求成功')
      return true
    case 400:
      logger.log(logCfg?.message || '客户端请求异常，服务器无法理解或处理')
      break
    case 500:
      logger.log(logCfg?.message || '服务器内部错误,无法正常响应')
      break
    case 401:
      logger.warn(logCfg?.message || '登录已过期，请重新登录')
      localStorage.removeItem('token')
      window.location.href = '/login'
      break
    case 403:
      logger.warn(logCfg?.message || '权限不足')
      break
    case 404:
      logger.info(logCfg?.message || '资源暂时不存在！')
      break
    case -1:
      logger.error(logCfg?.message || '网络异常')
      break
    default:
      logger.error(logCfg?.message || '异常错误')
      break
  }
  return false
}
