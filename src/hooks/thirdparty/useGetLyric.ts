import { getLyric, getLyricAbort } from '@/api/thirdparty'
import type { GetLyricPayload, GetLyricResPayload } from '@/api/thirdparty'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { GetLyricPayload, GetLyricResPayload }

// 获取歌词 hook
export const useGetLyric = () => {
  const cfg = createResCfg<GetLyricPayload, GetLyricResPayload>({
    success: '获取歌词成功',
    clientFail: '获取歌词状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '获取失败，请稍后重试',
    handle: getLyric,
  })
  const { execute, isLoading } = useHandleRes<GetLyricPayload, GetLyricResPayload>(cfg)
  const fetchLyric = async (payload: GetLyricPayload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, fetchLyric, abort: getLyricAbort }
}
