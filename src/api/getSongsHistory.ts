import { request } from '@/utils/request'
import { userHistoryPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface PlayHistoryItem {
  songId: number
  title: string
  artist: string
  audioUrl: string | null
  playedAt: string
}

export interface ResPayload {
  list: PlayHistoryItem[]
  total: number
}
export function getSongHistory(): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.get<ResPayload>(userHistoryPath, {})
  abort = res.controller
  return res.promise
}
