import type { FlatResCfg } from '@/types/requestType'

export function createResCfg<Payload, Res = Record<string, unknown>>(
  flatCfg: FlatResCfg<Payload, Res>,
) {
  return {
    tips: {
      success: flatCfg.success || '请求成功',
      clientFail: flatCfg.clientFail || '客户端错误',
      serverFail: flatCfg.serverFail || '服务器错误',
      error: flatCfg.error || '未知错误',
    },
    cfg: {},
    handle: flatCfg.handle,
  }
}
