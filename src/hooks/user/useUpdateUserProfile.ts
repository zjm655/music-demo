import { updateUserProfile as updateUserProfileApi, updateUserProfileAbort } from '@/api/user'
import type { UpdateUserProfilePayload, UpdateUserProfileResPayload } from '@/api/user'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { UpdateUserProfilePayload, UpdateUserProfileResPayload }

// 更新用户信息 hook
export const useUpdateUserProfile = () => {
  const cfg = createResCfg({
    success: '更新用户信息成功',
    clientFail: '用户信息参数异常，请检查后重试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '更新失败，请稍后重试',
    handle: updateUserProfileApi,
  })
  const { execute, isLoading } = useHandleRes<UpdateUserProfilePayload, UpdateUserProfileResPayload>(cfg)
  // 执行函数：更新用户信息
  const updateUserProfile = async (payload: UpdateUserProfilePayload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, updateUserProfile, abort: updateUserProfileAbort }
}
