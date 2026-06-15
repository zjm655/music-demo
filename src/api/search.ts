import { request } from '@/utils/request'
import { searchPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  keyword: string
  type?: 'song' | 'artist' | 'album'
  page?: number
  pageSize?: number
}

export interface SearchSongItem {
  id: number
  title: string
  artist: string
  album: string
  duration: number
  coverUrl: string | null
  audioUrl: string | null
}

export interface ResPayload {
  list: SearchSongItem[]
  total: number
  page: number
  pageSize: number
}

export function getSearchSongs(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.get<ResPayload>(searchPath, {
    params: payload,
  })
  abort = res.controller
  return res.promise
}
