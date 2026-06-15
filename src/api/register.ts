import { request } from '@/utils/request'
import { registerPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  username: string
  password: string
  email: string
}

export interface ResPayload {
  userId: number | string
  username: string
  token: string
}

export function register(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.post<ResPayload>(registerPath, {
    data: payload,
  })
  abort = res.controller
  return res.promise
}
