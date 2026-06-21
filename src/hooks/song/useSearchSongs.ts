import { searchSongs as searchSongsApi, searchSongsAbort } from '@/api/song'
import type { SearchSongsPayload, SearchSongsResPayload } from '@/api/song'
import { useHandleRes, createResCfg } from '@/hooks/request'
import { prefixLocalUrls } from '@/utils/prefixUrl'

export type { SearchSongsPayload, SearchSongsResPayload }

const URL_FIELDS = ['coverUrl', 'audioUrl', 'mvUrl'] as const

// 搜索歌曲 hook
export const useSearchSongs = () => {
  const cfg = createResCfg({
    success: '搜索歌曲成功',
    clientFail: '搜索状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '搜索失败，请稍后重试',
    handle: searchSongsApi,
  })
  const { execute, isLoading } = useHandleRes<SearchSongsPayload, SearchSongsResPayload>(cfg)
  // 执行函数：搜索歌曲
  const searchSongs = async (payload: SearchSongsPayload) => {
    const res = await execute(payload)
    if (res?.data?.list) {
      res.data.list.forEach((item) => prefixLocalUrls(item, [...URL_FIELDS]))
    }
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, searchSongs, abort: searchSongsAbort }
}
