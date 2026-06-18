import { request } from '@/utils/request'
import { categoriesPath } from '@/config/api'
import type { CommonResCfg } from '@/types/requestType'
export let abort: null | AbortController = null

// 分类项结构（与后端 CategoryResponse 一致）
export interface CategoryItem {
  id: number
  name: string
  description: string | null
  icon: string | null
  sortOrder: number | null
  createTime: string | null
}

export type ResPayload = CategoryItem[]

export function getCategories(): Promise<CommonResCfg<ResPayload>> {
  const res = request.json.get<ResPayload>(categoriesPath, {})
  abort = res.controller
  return res.promise
}
