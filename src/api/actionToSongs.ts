import { request } from '@/utils/request'
import { actionToSongsPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  playlistId: number
  songId: number
  action: 'add' | 'remove'
  // 'add'是添加，'remove'是移除
}

export interface ResPayload {
  success: boolean
}

export function actionToSongs(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.post<ResPayload>(
    actionToSongsPath.replace('{id}', String(payload.playlistId)),
    {
      data: payload,
    },
  )
  abort = res.controller
  return res.promise
}
