import { addExternalSong as addExternalSongApi, addExternalSongAbort } from '@/api/playlist'
import type { AddExternalSongPayload, AddExternalSongResPayload } from '@/api/playlist'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { AddExternalSongPayload, AddExternalSongResPayload }

// 添加第三方歌曲到歌单 hook
export const useAddExternalSong = () => {
  const cfg = createResCfg<AddExternalSongPayload, AddExternalSongResPayload>({
    success: '添加第三方歌曲成功',
    clientFail: '添加第三方歌曲状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '添加失败，请稍后重试',
    handle: addExternalSongApi,
  })
  const { execute, isLoading } = useHandleRes<AddExternalSongPayload, AddExternalSongResPayload>(cfg)
  const addExternalSong = async (payload: AddExternalSongPayload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, addExternalSong, abort: addExternalSongAbort }
}
