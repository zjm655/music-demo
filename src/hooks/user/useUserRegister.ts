import { register, abort } from '@/api/register'
import type { Payload } from '@/api/register'
import { useHandleRes, createResCfg } from '@/hooks/request'
import { useUserStore } from '@/stores/user'
import { logger } from '@/utils/logger'

export const useUserRegister = () => {
  const userRegisterCfg = createResCfg({
    success: '注册成功',
    clientFail: '注册信息有误，请检查输入',
    serverFail: '服务器繁忙，请稍后再试',
    error: '注册失败，请稍后重试',
    handle: register,
  })

  const { execute, isLoading } = useHandleRes(userRegisterCfg)

  const userToRegister = async (payload: Payload) => {
    logger.log('abort', abort)
    const res = await execute(payload)
    if (res?.code === 200) {
      useUserStore().isLogin = true
      localStorage.setItem('token', res.data?.token)
      useUserStore().userInfo.userId = res.data?.userId
      useUserStore().userInfo.username = res.data?.username
    } else {
      useUserStore().isLogin = false
    }

    return {
      code: res?.code,
      message: res?.message,
    }
  }

  return {
    userToRegister,
    isLoading,
    abort,
  }
}
