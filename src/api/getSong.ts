import { request } from '@/utils/request'
import { songsPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  id: string
}

// export interface ResPayload {
//   id: number
//   title: string
//   artist: string
//   album: string
//   duration: number
//   coverUrl: string
//   audioUrl: string
//   lyrics: string
// }

export interface ResPayload {
  id: string
  title: string
  artist: string | null
  album: string | null
  duration: number | null
  lyricist: string | null
  composer: string | null
  lyrics: string | null
  audioUrl: string | null
  mvUrl: string | null
  mvDescription: string | null
  mvAuthor: string | null
  category: string | null
  coverUrl: string | null
  createTime: string
  categoryId: number | null
}

export function getSong(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.get<ResPayload>(`${songsPath}/${payload.id}`, {})
  abort = res.controller
  return res.promise
}
