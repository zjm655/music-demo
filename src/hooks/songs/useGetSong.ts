import { getSong, abort } from '@/api/getSong'
import type { Payload } from '@/api/getSong'
import { useHandleRes, createResCfg } from '@/hooks/request'
import { logger } from '@/utils/logger'

export type { Payload, ResPayload } from '@/api/getSong'

export const useGetSong = () => {
  const getSongCfg = createResCfg({
    success: '获取歌曲详情成功',
    clientFail: '歌曲状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '登录失败，请稍后重试',
    handle: getSong,
  })

  const { execute, isLoading } = useHandleRes(getSongCfg)
  const userGetSong = async (payload: Payload) => {
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
    userGetSong,
    abort,
  }
}
