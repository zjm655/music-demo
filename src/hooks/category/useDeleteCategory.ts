import { deleteCategory as deleteCategoryApi, deleteCategoryAbort } from '@/api/category'
import type { DeleteCategoryPayload, DeleteCategoryResPayload } from '@/api/category'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { DeleteCategoryPayload, DeleteCategoryResPayload }

// 删除分类 hook
export const useDeleteCategory = () => {
  const cfg = createResCfg({
    success: '删除分类成功',
    clientFail: '分类参数异常，请检查后重试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '删除失败，请稍后重试',
    handle: deleteCategoryApi,
  })
  const { execute, isLoading } = useHandleRes<DeleteCategoryPayload, DeleteCategoryResPayload>(cfg)
  // 执行函数：删除分类
  const deleteCategory = async (payload: DeleteCategoryPayload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, deleteCategory, abort: deleteCategoryAbort }
}
