import { request } from '@/utils/request'
import { songDetailPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

// 歌曲详情结构（字段与 SongItem 一致，本文件内独立定义以避免跨文件依赖）
export interface SongDetail {
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
  id: number
}

export type ResPayload = SongDetail

export function getSong(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const url = songDetailPath.replace('{id}', String(payload.id))
  const res = request.json.get<ResPayload>(url, {
    params: {},
  })
  abort = res.controller
  return res.promise
}