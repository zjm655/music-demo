import { getPlaylists, getPlaylistsAbort } from '@/api/playlist'
import type { GetPlaylistsResPayload } from '@/api/playlist'
import { useHandleRes, createResCfg } from '@/hooks/request'
import { prefixLocalUrls } from '@/utils/prefixUrl'

export type { GetPlaylistsResPayload }

// 获取歌单列表 hook
export const useGetPlaylists = () => {
  const cfg = createResCfg<void, GetPlaylistsResPayload>({
    success: '获取歌单列表成功',
    clientFail: '歌单列表状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '获取失败，请稍后重试',
    handle: getPlaylists,
  })
  const { execute, isLoading } = useHandleRes<void, GetPlaylistsResPayload>(cfg)
  const fetchPlaylists = async () => {
    const res = await execute()
    if (res?.data) {
      res.data.forEach((item) => prefixLocalUrls(item, ['coverUrl']))
    }
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, fetchPlaylists, abort: getPlaylistsAbort }
}
