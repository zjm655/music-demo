import { request } from '@/utils/request'
import { playlistsPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Playlist {
  id: number
  name: string
  coverUrl: string
  songCount: number
  createdAt: string
}

export type ResPayload = Playlist[]

export function getPlaylists(payload: string): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.get<ResPayload>(playlistsPath, {})
  abort = res.controller
  return res.promise
}
