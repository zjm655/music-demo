import { removeExternalSong as removeExternalSongApi, removeExternalSongAbort } from '@/api/playlist'
import type { RemoveExternalSongPayload, RemoveExternalSongResPayload } from '@/api/playlist'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { RemoveExternalSongPayload, RemoveExternalSongResPayload }

export const useRemoveExternalSong = () => {
  const cfg = createResCfg<RemoveExternalSongPayload, RemoveExternalSongResPayload>({
    success: '删除第三方歌曲成功',
    clientFail: '删除第三方歌曲状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '删除失败，请稍后重试',
    handle: removeExternalSongApi,
  })
  const { execute, isLoading } = useHandleRes<RemoveExternalSongPayload, RemoveExternalSongResPayload>(cfg)
  const removeExternalSong = async (payload: RemoveExternalSongPayload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, removeExternalSong, abort: removeExternalSongAbort }
}
