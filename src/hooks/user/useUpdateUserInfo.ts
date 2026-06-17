import { updateUserInfo, abort } from '@/api/updateUserInfo'
import type { Payload } from '@/api/updateUserInfo'
import { useHandleRes, createResCfg } from '@/hooks/request'

export const useUpdateUserInfo = () => {
  const updateUserInfoCfg = createResCfg({
    success: '更新用户信息成功',
    clientFail: '用户信息参数异常，请检查后重试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '更新失败，请稍后重试',
    handle: updateUserInfo,
  })
  const { execute, isLoading } = useHandleRes(updateUserInfoCfg)
  const saveUserInfo = async (payload: Payload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, saveUserInfo, abort }
}
