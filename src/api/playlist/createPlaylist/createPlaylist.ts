import { request } from '@/utils/request'
import { playlistsPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  name: string
  description?: string
}

// 创建歌单响应结构（与后端 PlaylistCreateResponse 一致）
export interface ResPayload {
  id: number
  name: string
  createdAt: string
}

export function createPlaylist(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.post<ResPayload>(playlistsPath, {
    data: payload,
  })
  abort = res.controller
  return res.promise
}
