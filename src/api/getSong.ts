import { request } from '@/utils/request'
import { songsPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  id: number
}

export interface ResPayload {
  id: number
  title: string
  artist: string
  album: string
  duration: number
  coverUrl: string
  audioUrl: string
  lyrics: string
}

export function getSong(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.get<ResPayload>(`${songsPath}/${payload.id}`, {})
  abort = res.controller
  return res.promise
}
