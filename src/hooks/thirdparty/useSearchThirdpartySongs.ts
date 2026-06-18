import { searchThirdpartySongs as searchThirdpartySongsApi, searchThirdpartySongsAbort } from '@/api/thirdparty'
import type { SearchThirdpartySongsPayload, SearchThirdpartySongsResPayload } from '@/api/thirdparty'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { SearchThirdpartySongsPayload, SearchThirdpartySongsResPayload }

// 搜索第三方歌曲 hook
export const useSearchThirdpartySongs = () => {
  const cfg = createResCfg<SearchThirdpartySongsPayload, SearchThirdpartySongsResPayload>({
    success: '搜索第三方歌曲成功',
    clientFail: '搜索第三方歌曲状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '搜索失败，请稍后重试',
    handle: searchThirdpartySongsApi,
  })
  const { execute, isLoading } = useHandleRes<SearchThirdpartySongsPayload, SearchThirdpartySongsResPayload>(cfg)
  const searchThirdpartySongs = async (payload: SearchThirdpartySongsPayload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, searchThirdpartySongs, abort: searchThirdpartySongsAbort }
}
