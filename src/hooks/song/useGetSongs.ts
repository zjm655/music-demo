import { getSongs, getSongsAbort } from '@/api/song'
import type { GetSongsPayload, GetSongsResPayload, SongItem } from '@/api/song'
import { useHandleRes, createResCfg } from '@/hooks/request'
import { prefixLocalUrls } from '@/utils/prefixUrl'

export type { GetSongsPayload, GetSongsResPayload, SongItem }

const URL_FIELDS = ['coverUrl', 'audioUrl', 'mvUrl'] as const

// 获取歌曲列表 hook
export const useGetSongs = () => {
  const cfg = createResCfg({
    success: '获取歌曲列表成功',
    clientFail: '歌曲列表状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '获取失败，请稍后重试',
    handle: getSongs,
  })
  const { execute, isLoading } = useHandleRes<GetSongsPayload, GetSongsResPayload>(cfg)
  // 执行函数：获取歌曲列表
  const fetchSongs = async (payload: GetSongsPayload) => {
    const res = await execute(payload)
    if (res?.data?.list) {
      res.data.list.forEach((item) => prefixLocalUrls(item, [...URL_FIELDS]))
    }
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, fetchSongs, abort: getSongsAbort }
}
