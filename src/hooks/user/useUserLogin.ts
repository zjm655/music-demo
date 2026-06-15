import { login, abort } from '@/api/login'
import { useHandleRes, createResCfg } from '@/hooks/request'
import { useUserStore } from '@/stores/user'

export const useUserLogin = () => {
  const userLoginCfg = createResCfg({
    success: '登录成功',
    clientFail: '登录信息有误，请检查账号或密码',
    serverFail: '服务器繁忙，请稍后再试',
    error: '登录失败，请稍后重试',
    handle: login,
  })
}
