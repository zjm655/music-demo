import { request } from '@/utils/request'
import { userInfoPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  username?: string | null
  bio?: string | null
}

export interface ResPayload {
  id: number
  username: string
  email: string | null
  avatarUrl: string | null
  bio: string | null
  createdAt: string
}

export function updateUserInfo(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.put<ResPayload>(userInfoPath, {
    data: payload,
  })
  abort = res.controller
  return res.promise
}
