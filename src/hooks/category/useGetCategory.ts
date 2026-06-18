import { getCategory, getCategoryAbort } from '@/api/category'
import type { GetCategoryPayload, GetCategoryResPayload } from '@/api/category'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { GetCategoryPayload, GetCategoryResPayload }

// 获取分类详情 hook
export const useGetCategory = () => {
  const cfg = createResCfg({
    success: '获取分类详情成功',
    clientFail: '分类详情状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '获取失败，请稍后重试',
    handle: getCategory,
  })
  const { execute, isLoading } = useHandleRes<GetCategoryPayload, GetCategoryResPayload>(cfg)
  // 执行函数：获取分类详情
  const fetchCategory = async (payload: GetCategoryPayload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, fetchCategory, abort: getCategoryAbort }
}
