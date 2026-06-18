import { request } from '@/utils/request'
import { playlistSongsPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  playlistId: number
  songId: number
  action: 'add' | 'remove'
}

// 操作歌单内歌曲响应 data
export interface ResPayload {
  success: boolean
}

export function operatePlaylistSong(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  // playlistId 仅用于替换路径占位符，不放入请求体
  const url = playlistSongsPath.replace('{id}', String(payload.playlistId))
  const res = request.json.post<ResPayload>(url, {
    data: {
      songId: payload.songId,
      action: payload.action,
    },
  })
  abort = res.controller
  return res.promise
}
