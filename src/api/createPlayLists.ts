import { request } from '@/utils/request'
import { playlistsPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  name: string
  description?: string
}

export interface ResPayload {
  id: number
  name: string | null
  createdAt: string
  //"createdAt": "2026-06-01T12:00:00Z"
}

export function createPlaylist(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.post<ResPayload>(playlistsPath, {
    data: payload,
  })
  abort = res.controller
  return res.promise
}
