import { request } from '@/utils/request'
import { thirdpartySearchPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

// 第三方搜索歌曲项结构（与后端 TencentSongDTO 一致）
export interface TencentSongDTO {
  id: string
  song: string
  singer: string
  album: string
  cover: string
  interval: string
  vid: string
  pay: string
}

export interface Payload {
  keyword: string
  limit?: number
}

export type ResPayload = TencentSongDTO[]

// 搜索关键词多变，不接入缓存
export function searchThirdpartySongs(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.get<ResPayload>(thirdpartySearchPath, {
    params: payload,
  })
  abort = res.controller
  return res.promise
}
