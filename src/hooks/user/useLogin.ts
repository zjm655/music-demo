import { login as loginApi, loginAbort } from '@/api/user'
import type { LoginPayload, LoginResPayload } from '@/api/user'
import { useHandleRes, createResCfg } from '@/hooks/request'
import { useUserStore } from '@/stores/user'

export type { LoginPayload, LoginResPayload }

// 登录 hook
export const useLogin = () => {
  const cfg = createResCfg({
    success: '登录成功',
    clientFail: '登录信息有误，请检查账号或密码',
    serverFail: '服务器繁忙，请稍后再试',
    error: '登录失败，请稍后重试',
    handle: loginApi,
  })
  const { execute, isLoading } = useHandleRes<LoginPayload, LoginResPayload>(cfg)
  // 执行函数：登录
  const login = async (payload: LoginPayload) => {
    const res = await execute(payload)
    // 登录成功时保存登录状态与用户信息
    if (res?.code === 200) {
      useUserStore().isLogin = true
      localStorage.setItem('token', res.data?.token)
      useUserStore().loadUserInfo(res.data)
    } else {
      useUserStore().isLogin = false
    }
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, login, abort: loginAbort }
}
