import { request } from '@/utils/request'
import { categoryDetailPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

// 分类项结构（与后端 CategoryResponse 一致，本文件内独立定义）
export interface CategoryItem {
  id: number
  name: string
  description: string | null
  icon: string | null
  sortOrder: number | null
  createTime: string | null
}

export interface Payload {
  id: number
}

export type ResPayload = CategoryItem

export function getCategory(payload: Payload): Promise<CommonResCfg<ResPayload>> {
  const url = categoryDetailPath.replace('{id}', String(payload.id))
  const res = request.json.get<ResPayload>(url, {
    params: {},
  })
  abort = res.controller
  return res.promise
}
