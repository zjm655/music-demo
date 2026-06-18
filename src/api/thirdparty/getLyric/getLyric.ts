import { request } from '@/utils/request'
import { thirdpartyLyricPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
import { createCache } from '@/utils/cache'
export let abort: null | AbortController = null

// 歌词缓存，30 分钟 TTL（歌词变化少）
const lyricCache = createCache<TencentLyricDTO>(30 * 60 * 1000)

// 第三方歌词结构（与后端 TencentLyricDTO 一致）
export interface TencentLyricDTO {
  lrc: string
  trans: string
}

export interface Payload {
  mid: string
}

export type ResPayload = TencentLyricDTO

export function getLyric(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const cacheKey = payload.mid
  const cached = lyricCache.get(cacheKey)
  if (cached) {
    return Promise.resolve({ code: 200, message: 'success', data: cached })
  }
  const res = request.json.get<ResPayload>(thirdpartyLyricPath, { params: payload })
  abort = res.controller
  // 命中后写入缓存
  res.promise.then((r) => {
    if (r?.code === 200 && r.data) lyricCache.set(cacheKey, r.data)
  })
  return res.promise
}
