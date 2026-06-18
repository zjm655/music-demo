import { getUserProfile, getUserProfileAbort } from '@/api/user'
import type { GetUserProfileResPayload } from '@/api/user'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { GetUserProfileResPayload }

// 获取用户信息 hook
export const useGetUserProfile = () => {
  const cfg = createResCfg<void, GetUserProfileResPayload>({
    success: '获取用户信息成功',
    clientFail: '用户信息状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '获取失败，请稍后重试',
    handle: getUserProfile,
  })
  const { execute, isLoading } = useHandleRes<void, GetUserProfileResPayload>(cfg)
  // 执行函数：获取用户信息（无 payload）
  const fetchUserProfile = async () => {
    const res = await execute()
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, fetchUserProfile, abort: getUserProfileAbort }
}
