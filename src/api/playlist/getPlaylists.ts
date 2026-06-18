import { request } from '@/utils/request'
import { playlistsPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

// 歌单项结构（与后端 PlaylistResponse 一致）
export interface PlaylistItem {
  id: number
  name: string
  coverUrl: string | null
  songCount: number
  createdAt: string
}

// 获取歌单列表无请求参数
export type ResPayload = PlaylistItem[]

export function getPlaylists(): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.get<ResPayload>(playlistsPath, {})
  abort = res.controller
  return res.promise
}