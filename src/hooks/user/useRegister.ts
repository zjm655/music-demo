import { register as registerApi, registerAbort } from '@/api/user'
import type { RegisterPayload, RegisterResPayload } from '@/api/user'
import { useHandleRes, createResCfg } from '@/hooks/request'
import { useUserStore } from '@/stores/user'

export type { RegisterPayload, RegisterResPayload }

// 注册 hook
export const useRegister = () => {
  const cfg = createResCfg({
    success: '注册成功',
    clientFail: '注册信息有误，请检查输入',
    serverFail: '服务器繁忙，请稍后再试',
    error: '注册失败，请稍后重试',
    handle: registerApi,
  })
  const { execute, isLoading } = useHandleRes<RegisterPayload, RegisterResPayload>(cfg)
  // 执行函数：注册
  const register = async (payload: RegisterPayload) => {
    const res = await execute(payload)
    // 注册成功时保存登录状态与用户信息（注册无 token，不写 localStorage）
    if (res?.code === 200) {
      useUserStore().isLogin = true
      useUserStore().loadUserInfo(res.data)
    } else {
      useUserStore().isLogin = false
    }
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, register, abort: registerAbort }
}
