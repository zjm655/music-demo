import { getSong, getSongAbort } from '@/api/song'
import type { GetSongPayload, GetSongResPayload } from '@/api/song'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { GetSongPayload, GetSongResPayload }

// 获取歌曲详情 hook
export const useGetSong = () => {
  const cfg = createResCfg({
    success: '获取歌曲详情成功',
    clientFail: '歌曲详情状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '获取失败，请稍后重试',
    handle: getSong,
  })
  const { execute, isLoading } = useHandleRes<GetSongPayload, GetSongResPayload>(cfg)
  // 执行函数：获取歌曲详情
  const fetchSong = async (payload: GetSongPayload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, fetchSong, abort: getSongAbort }
}
