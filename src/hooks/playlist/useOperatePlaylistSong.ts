import { operatePlaylistSong as operatePlaylistSongApi, operatePlaylistSongAbort } from '@/api/playlist'
import type { OperatePlaylistSongPayload, OperatePlaylistSongResPayload } from '@/api/playlist'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { OperatePlaylistSongPayload, OperatePlaylistSongResPayload }

// 操作歌单歌曲 hook
export const useOperatePlaylistSong = () => {
  const cfg = createResCfg<OperatePlaylistSongPayload, OperatePlaylistSongResPayload>({
    success: '操作歌单歌曲成功',
    clientFail: '操作歌单歌曲状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '操作失败，请稍后重试',
    handle: operatePlaylistSongApi,
  })
  const { execute, isLoading } = useHandleRes<OperatePlaylistSongPayload, OperatePlaylistSongResPayload>(cfg)
  const operatePlaylistSong = async (payload: OperatePlaylistSongPayload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, operatePlaylistSong, abort: operatePlaylistSongAbort }
}
