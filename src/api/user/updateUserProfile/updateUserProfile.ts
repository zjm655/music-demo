import { request } from '@/utils/request'
import { userProfilePath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  nickname?: string
  email?: string
  bio?: string
  gender?: number
  hobby?: string
  avatar?: string
}

// 用户资料响应结构（与后端 UserProfileResponse 一致）
export interface ResPayload {
  id: number
  username: string
  nickname: string | null
  email: string | null
  bio: string | null
  gender: number | null
  hobby: string | null
  avatar: string | null
  createTime: string | null
}

export function updateUserProfile(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.put<ResPayload>(userProfilePath, {
    data: payload,
  })
  abort = res.controller
  return res.promise
}
