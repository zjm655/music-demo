import { request } from '@/utils/request'
import { playlistDetailPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  id: number
}

// 删除歌单响应 data
export interface ResPayload {
  success: boolean
}

export function deletePlaylist(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const url = playlistDetailPath.replace('{id}', String(payload.id))
  const res = request.json.delete<ResPayload>(url, {
    data: {},
  })
  abort = res.controller
  return res.promise
}