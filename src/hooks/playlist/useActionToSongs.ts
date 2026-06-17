import { actionToSongs, abort } from '@/api/actionToSongs'
import type { Payload } from '@/api/actionToSongs'
import { useHandleRes, createResCfg } from '@/hooks/request'

export const useActionToSongs = () => {
  const actionToSongsCfg = createResCfg({
    success: '操作成功',
    clientFail: '操作参数异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '操作失败，请稍后重试',
    handle: actionToSongs,
  })
  const { execute, isLoading } = useHandleRes(actionToSongsCfg)
  const doActionToSongs = async (payload: Payload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, doActionToSongs, abort }
}
