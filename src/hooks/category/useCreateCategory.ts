import { createCategory as createCategoryApi, createCategoryAbort } from '@/api/category'
import type { CreateCategoryPayload, CreateCategoryResPayload } from '@/api/category'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { CreateCategoryPayload, CreateCategoryResPayload }

// 创建分类 hook
export const useCreateCategory = () => {
  const cfg = createResCfg({
    success: '创建分类成功',
    clientFail: '分类参数异常，请检查后重试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '创建失败，请稍后重试',
    handle: createCategoryApi,
  })
  const { execute, isLoading } = useHandleRes<CreateCategoryPayload, CreateCategoryResPayload>(cfg)
  // 执行函数：创建分类
  const createCategory = async (payload: CreateCategoryPayload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, createCategory, abort: createCategoryAbort }
}
