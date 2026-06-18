import { request } from '@/utils/request'
import { categoryDetailPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

export interface Payload {
  id: number
}

// 删除分类响应 data 为 null
export type ResPayload = null

export function deleteCategory(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const url = categoryDetailPath.replace('{id}', String(payload.id))
  const res = request.json.delete<ResPayload>(url, {
    data: {},
  })
  abort = res.controller
  return res.promise
}
