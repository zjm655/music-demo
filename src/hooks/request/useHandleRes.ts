import { logger } from '@/utils/logger'
import { resolveCode } from '@/utils/resolveCode'
import { ref } from 'vue'
import type { CommonReqCfg, CommonResCfg } from '@/types/requestType'

export function isCommonResCfg<T>(val: unknown): val is CommonResCfg<T> {
  return (
    typeof val === 'object' && val !== null && 'code' in val && 'message' in val && 'data' in val
  )
}

export const useHandleRes = <Payload, Res = Record<string, unknown>>(
  resCfg: CommonReqCfg<Payload, Res>,
) => {
  const isLoading = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  return {
    isLoading,
    execute: async (payload: Payload) => {
      if (timer !== null || isLoading.value) return
      timer = setTimeout(() => {
        isLoading.value = true
      }, 100)
      const logCfg = {
        code: -1,
        message: '未知错误',
        tips: resCfg.tips,
      }

      try {
        const res = await resCfg.handle(payload)
        clearTimeout(timer)
        logCfg.code = res?.code
        logCfg.message = res?.message
        return res
      } catch (err) {
        const error: CommonResCfg<Res> = isCommonResCfg<Res>(err)
          ? err
          : { code: 0, message: String(err), data: {} as Res }

        logCfg.code = error?.code
        logCfg.message = error.message
        logger.warn(error?.message || '请求错误')
        return error
      } finally {
        isLoading.value = false
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
        logger.log('resolveCode')
        resolveCode(logCfg)
      }
    },
  }
}
