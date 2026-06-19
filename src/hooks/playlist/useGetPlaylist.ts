import { getPlaylist, getPlaylistAbort } from '@/api/playlist'
import type { GetPlaylistPayload, GetPlaylistResPayload } from '@/api/playlist'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { GetPlaylistPayload, GetPlaylistResPayload }

// 获取歌单详情 hook
export const useGetPlaylist = () => {
  const cfg = createResCfg<GetPlaylistPayload, GetPlaylistResPayload>({
    success: '获取歌单详情成功',
    clientFail: '歌单详情状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '获取失败，请稍后重试',
    handle: getPlaylist,
  })
  const { execute, isLoading } = useHandleRes<GetPlaylistPayload, GetPlaylistResPayload>(cfg)
  const fetchPlaylist = async (payload: GetPlaylistPayload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, fetchPlaylist, abort: getPlaylistAbort }
}
