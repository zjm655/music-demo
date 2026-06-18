import { request } from '@/utils/request'
import { songsSearchPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

// 搜索结果歌曲项（字段与 SongItem 一致，本文件内独立定义）
export interface SongSearchItem {
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
  list: SongSearchItem[]
  total: number
  page: number
  pageSize: number
}

export function searchSongs(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.get<ResPayload>(songsSearchPath, {
    params: payload,
  })
  abort = res.controller
  return res.promise
}
