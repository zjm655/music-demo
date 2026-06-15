import { login, abort } from '@/api/login'
import type { Payload } from '@/api/login'
import { useHandleRes, createResCfg } from '@/hooks/request'
import { useUserStore } from '@/stores/user'
import { logger } from '@/utils/logger'

export const useUserLogin = () => {
  const userLoginCfg = createResCfg({
    success: '登录成功',
    clientFail: '登录信息有误，请检查账号或密码',
    serverFail: '服务器繁忙，请稍后再试',
    error: '登录失败，请稍后重试',
    handle: login,
  })

  const { execute, isLoading } = useHandleRes(userLoginCfg)

  const userToLogin = async (payload: Payload) => {
    logger.log('abort', abort)
    const res = await execute(payload)
    if (res?.code === 200) {
      useUserStore().isLogin = true
      localStorage.setItem('token', res.data?.token)
      useUserStore().loadUserInfo(res.data)
    } else {
      useUserStore().isLogin = false
    }

    return {
      code: res?.code,
      message: res?.message,
    }
  }

  return {
    userToLogin,
    isLoading,
    abort,
  }
}
