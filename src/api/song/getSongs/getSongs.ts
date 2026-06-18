import { request } from '@/utils/request'
import { songsPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

// 歌曲列表项结构（与后端 Song 实体一致）
export interface SongItem {
  id: number
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
  createTime: string | null
  categoryId: number
}

export interface Payload {
  page?: number
  pageSize?: number
  keyword?: string
  type?: string
  categoryId?: number
}

export interface ResPayload {
  list: SongItem[]
  total: number
  page: number
  pageSize: number
}

export function getSongs(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.get<ResPayload>(songsPath, {
    params: payload,
  })
  abort = res.controller
  return res.promise
}
