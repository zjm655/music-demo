import { request } from '@/utils/request'
import { userProfilePath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

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

export function getUserProfile(): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.get<ResPayload>(userProfilePath, {})
  abort = res.controller
  return res.promise
}
