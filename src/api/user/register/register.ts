import { request } from '@/utils/request'
import { registerPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  username: string
  password: string
  confirmPassword: string
  email?: string
}

export interface ResPayload {
  userId: number
  username: string
}

export function register(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.post<ResPayload>(registerPath, {
    data: payload,
  })
  abort = res.controller
  return res.promise
}
