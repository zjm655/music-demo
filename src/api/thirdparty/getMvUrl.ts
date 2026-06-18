import { request } from '@/utils/request'
import { thirdpartyMvUrlPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
import { createCache } from '@/utils/cache'
export let abort: null | AbortController = null

// MV 链接缓存，30 分钟 TTL
const mvUrlCache = createCache<string>(30 * 60 * 1000)

export interface Payload {
  vid: string
}

// MV 链接响应 data 为字符串
export type ResPayload = string

export function getMvUrl(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const cacheKey = payload.vid
  const cached = mvUrlCache.get(cacheKey)
  if (cached) {
    return Promise.resolve({ code: 200, message: 'success', data: cached })
  }
  const res = request.json.get<ResPayload>(thirdpartyMvUrlPath, { params: payload })
  abort = res.controller
  // 命中后写入缓存
  res.promise.then((r) => {
    if (r?.code === 200 && r.data) mvUrlCache.set(cacheKey, r.data)
  })
  return res.promise
}