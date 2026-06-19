import { getCategories, getCategoriesAbort } from '@/api/category'
import type { GetCategoriesResPayload, CategoryItem } from '@/api/category'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { GetCategoriesResPayload, CategoryItem }

// 获取分类列表 hook
export const useGetCategories = () => {
  const cfg = createResCfg<void, GetCategoriesResPayload>({
    success: '获取分类列表成功',
    clientFail: '分类列表状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '获取失败，请稍后重试',
    handle: getCategories,
  })
  const { execute, isLoading } = useHandleRes<void, GetCategoriesResPayload>(cfg)
  // 执行函数：获取分类列表（无 payload）
  const fetchCategories = async () => {
    const res = await execute()
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, fetchCategories, abort: getCategoriesAbort }
}
