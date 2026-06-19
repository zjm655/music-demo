import { request } from '@/utils/request'
import { playlistExternalSongsPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  playlistId: number
  songId: string
  source: string
}

export interface ResPayload {
  success: boolean
}

export function removeExternalSong(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const url = playlistExternalSongsPath.replace('{id}', String(payload.playlistId))
  const res = request.json.delete<ResPayload>(url, {
    params: {
      songId: payload.songId,
      source: payload.source,
    },
  })
  abort = res.controller
  return res.promise
}
