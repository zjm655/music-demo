import { request } from '@/utils/request'
import { songsPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  page?: number
  pageSize?: number
  keyword?: string
}

export interface ResPayload {
  list: {
    id: number
    title: string
    artist: string
    album: string
    duration: number
    coverUrl: string
    audioUrl: string
  }[]
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
