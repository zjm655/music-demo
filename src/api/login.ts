import { request } from '@/utils/request'
import { loginPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  username: string
  password: string
}
export interface ResPayload {
  userId: number | string
  username: string
  token: string
}

export function login(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.post<ResPayload>(loginPath, {
    data: payload,
  })
  abort = res.controller
  return res.promise
}
