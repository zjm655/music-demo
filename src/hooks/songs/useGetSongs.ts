import { getSongs, abort } from '@/api/getSongs'
import type { Payload } from '@/api/getSongs'
import { useHandleRes, createResCfg } from '@/hooks/request'
import { logger } from '@/utils/logger'

export type { Payload, ResPayload } from '@/api/getSongs'
export const useGetSongs = () => {
  const getSongCfg = createResCfg({
    success: '获取歌曲列表成功',
    clientFail: '歌曲列表状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '登录失败，请稍后重试',
    handle: getSongs,
  })

  const { execute, isLoading } = useHandleRes(getSongCfg)
  const userGetSongs = async (payload: Payload) => {
    logger.log('开始获取歌曲信息回调')
    const res = await execute(payload)
    logger.log('获取歌曲信息回调结束')
    if (res?.code === 200) {
      logger.log('获取歌曲信息成功！')
    } else {
      logger.log('获取歌曲信息失败！')
    }
    return {
      code: res?.code,
      message: res?.message,
      data: res?.data,
    }
  }

  return {
    isLoading,
    userGetSongs,
    abort,
  }
}
