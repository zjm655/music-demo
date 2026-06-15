import { request } from '@/utils/request'
import { userHistoryPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  songId: number
}

export interface ResPayload {
  success: boolean
}

export function markSongHistory(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.post<ResPayload>(userHistoryPath, {
    data: payload,
  })
  abort = res.controller
  return res.promise
}
