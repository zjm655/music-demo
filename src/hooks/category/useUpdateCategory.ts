import { updateCategory as updateCategoryApi, updateCategoryAbort } from '@/api/category'
import type { UpdateCategoryPayload, UpdateCategoryResPayload } from '@/api/category'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { UpdateCategoryPayload, UpdateCategoryResPayload }

// 更新分类 hook
export const useUpdateCategory = () => {
  const cfg = createResCfg({
    success: '更新分类成功',
    clientFail: '分类参数异常，请检查后重试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '更新失败，请稍后重试',
    handle: updateCategoryApi,
  })
  const { execute, isLoading } = useHandleRes<UpdateCategoryPayload, UpdateCategoryResPayload>(cfg)
  // 执行函数：更新分类
  const updateCategory = async (payload: UpdateCategoryPayload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, updateCategory, abort: updateCategoryAbort }
}
