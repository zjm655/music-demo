import { logger } from '@/utils/logger'
import type { LogCfg } from '@/types/requestType'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'

export const resolveCode = (logCfg: LogCfg) => {
  switch (logCfg.code) {
    case 200:
      logger.log(logCfg.message || '请求成功')
      ElMessage.success(logCfg.tips.success)
      return true
    case 400:
      logger.log(logCfg?.message || '客户端请求异常，服务器无法理解或处理')
      ElMessage.warning(logCfg.tips.clientFail)
      break
    case 500:
      logger.log(logCfg?.message || '服务器内部错误,无法正常响应')
      ElMessage.error(logCfg.tips.serverFail)
      break
    case 401:
      logger.warn(logCfg?.message || '登录已过期，请重新登录')
      localStorage.removeItem('token')
      window.location.href = '/login'
      ElMessage.warning(logCfg.tips.clientFail)
      break
    case 403:
      logger.warn(logCfg?.message || '权限不足')
      ElMessage.warning(logCfg.tips.clientFail)
      break
    case 404:
      logger.info(logCfg?.message || '资源暂时不存在！')
      ElMessage.warning(logCfg.tips.clientFail)
      break
    case -1:
      logger.error(logCfg?.message || '网络异常')
      ElMessage.error(logCfg.message)
      break
    default:
      logger.error(logCfg?.message || '异常错误')
      ElMessage.error(logCfg.message)
      break
  }
  return false
}
