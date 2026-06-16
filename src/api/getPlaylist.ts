import { request } from '@/utils/request'
import { playlistsPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  id: number
}

export interface PlaylistSongItem {
  id: number
  title: string
  artist: string
  audioUrl: string | null
  coverUrl: string | null
}

export interface ResPayload {
  id: number
  name: string
  coverUrl: string | null
  description: string | null
  songs: PlaylistSongItem[]
}

export function getPlaylist(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.get<ResPayload>(`${playlistsPath}/${payload.id}`, {})
  abort = res.controller
  return res.promise
}
