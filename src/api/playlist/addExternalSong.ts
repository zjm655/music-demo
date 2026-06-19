import { request } from '@/utils/request'
import { playlistExternalSongsPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  playlistId: number
  songId: string
  source?: string
  name?: string
  artist?: string
  cover?: string
}

// 添加外部歌曲到歌单响应 data
export interface ResPayload {
  success: boolean
}

export function addExternalSong(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  // playlistId 仅用于替换路径占位符，不放入请求体
  const url = playlistExternalSongsPath.replace('{id}', String(payload.playlistId))
  const res = request.json.post<ResPayload>(url, {
    data: {
      songId: payload.songId,
      source: payload.source,
      name: payload.name,
      artist: payload.artist,
      cover: payload.cover,
    },
  })
  abort = res.controller
  return res.promise
}