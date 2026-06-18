import { request } from '@/utils/request'
import { thirdpartyPlayUrlPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
import { createCache } from '@/utils/cache'
export let abort: null | AbortController = null

// 播放链接缓存，10 分钟 TTL
const playUrlCache = createCache<string>(10 * 60 * 1000)

export interface Payload {
  mid: string
  quality?: number
}

// 播放链接响应 data 为字符串
export type ResPayload = string

export function getPlayUrl(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const cacheKey = `${payload.mid}_${payload.quality ?? 10}`
  const cached = playUrlCache.get(cacheKey)
  if (cached) {
    return Promise.resolve({ code: 200, message: 'success', data: cached })
  }
  const res = request.json.get<ResPayload>(thirdpartyPlayUrlPath, { params: payload })
  abort = res.controller
  // 命中后写入缓存
  res.promise.then((r) => {
    if (r?.code === 200 && r.data) playUrlCache.set(cacheKey, r.data)
  })
  return res.promise
}