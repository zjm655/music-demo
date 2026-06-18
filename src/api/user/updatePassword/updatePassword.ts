import { request } from '@/utils/request'
import { userPasswordPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  oldPassword: string
  newPassword: string
}

// 修改密码响应 data 为 null
export type ResPayload = null

export function updatePassword(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.post<ResPayload>(userPasswordPath, {
    data: payload,
  })
  abort = res.controller
  return res.promise
}
