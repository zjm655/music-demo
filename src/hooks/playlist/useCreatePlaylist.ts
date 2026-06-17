import { createPlaylist, abort } from '@/api/createPlayLists'
import type { Payload } from '@/api/createPlayLists'
import { useHandleRes, createResCfg } from '@/hooks/request'

export const useCreatePlaylist = () => {
  const createPlaylistCfg = createResCfg({
    success: '创建歌单成功',
    clientFail: '创建歌单参数异常，请检查后重试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '创建失败，请稍后重试',
    handle: createPlaylist,
  })
  const { execute, isLoading } = useHandleRes(createPlaylistCfg)
  const createPlayList = async (payload: Payload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, createPlayList, abort }
}
