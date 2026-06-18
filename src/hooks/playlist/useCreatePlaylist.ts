import { createPlaylist as createPlaylistApi, createPlaylistAbort } from '@/api/playlist'
import type { CreatePlaylistPayload, CreatePlaylistResPayload } from '@/api/playlist'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { CreatePlaylistPayload, CreatePlaylistResPayload }

// 创建歌单 hook
export const useCreatePlaylist = () => {
  const cfg = createResCfg<CreatePlaylistPayload, CreatePlaylistResPayload>({
    success: '创建歌单成功',
    clientFail: '创建歌单状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '创建失败，请稍后重试',
    handle: createPlaylistApi,
  })
  const { execute, isLoading } = useHandleRes<CreatePlaylistPayload, CreatePlaylistResPayload>(cfg)
  const createPlaylist = async (payload: CreatePlaylistPayload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, createPlaylist, abort: createPlaylistAbort }
}
