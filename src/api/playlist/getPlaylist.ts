import { request } from '@/utils/request'
import { playlistDetailPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

// 歌单内歌曲项结构（与后端 PlaylistSongVO / SongVO 一致）
export interface PlaylistSongVO {
  id: number | string
  title: string
  artist: string | null
  album: string | null
  duration: number | null
  coverUrl: string | null
  audioUrl: string | null
  source: string
  vid: string | null
}

// 歌单详情结构（与后端 PlaylistDetailVO 一致）
export interface PlaylistDetail {
  id: number
  name: string
  coverUrl: string | null
  description: string | null
  songs: PlaylistSongVO[]
}

export interface Payload {
  id: number
}

export type ResPayload = PlaylistDetail

export function getPlaylist(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const url = playlistDetailPath.replace('{id}', String(payload.id))
  const res = request.json.get<ResPayload>(url, {
    params: {},
  })
  abort = res.controller
  return res.promise
}