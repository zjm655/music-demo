import { updatePassword as updatePasswordApi, updatePasswordAbort } from '@/api/user'
import type { UpdatePasswordPayload, UpdatePasswordResPayload } from '@/api/user'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { UpdatePasswordPayload, UpdatePasswordResPayload }

// 修改密码 hook
export const useUpdatePassword = () => {
  const cfg = createResCfg({
    success: '修改密码成功',
    clientFail: '密码参数异常，请检查后重试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '修改失败，请稍后重试',
    handle: updatePasswordApi,
  })
  const { execute, isLoading } = useHandleRes<UpdatePasswordPayload, UpdatePasswordResPayload>(cfg)
  // 执行函数：修改密码
  const updatePassword = async (payload: UpdatePasswordPayload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, updatePassword, abort: updatePasswordAbort }
}
