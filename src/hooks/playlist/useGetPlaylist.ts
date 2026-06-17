import { getPlaylist, abort } from '@/api/getPlaylist'
import type { Payload } from '@/api/getPlaylist'
import { useHandleRes, createResCfg } from '@/hooks/request'

export const useGetPlaylist = () => {
  const getPlaylistCfg = createResCfg({
    success: '获取歌单详情成功',
    clientFail: '歌单详情状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '获取失败，请稍后重试',
    handle: getPlaylist,
  })
  const { execute, isLoading } = useHandleRes(getPlaylistCfg)
  const fetchPlaylist = async (payload: Payload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, fetchPlaylist, abort }
}
