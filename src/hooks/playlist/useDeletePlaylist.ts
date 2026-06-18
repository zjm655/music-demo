import { deletePlaylist as deletePlaylistApi, deletePlaylistAbort } from '@/api/playlist'
import type { DeletePlaylistPayload, DeletePlaylistResPayload } from '@/api/playlist'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { DeletePlaylistPayload, DeletePlaylistResPayload }

// 删除歌单 hook
export const useDeletePlaylist = () => {
  const cfg = createResCfg<DeletePlaylistPayload, DeletePlaylistResPayload>({
    success: '删除歌单成功',
    clientFail: '删除歌单状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '删除失败，请稍后重试',
    handle: deletePlaylistApi,
  })
  const { execute, isLoading } = useHandleRes<DeletePlaylistPayload, DeletePlaylistResPayload>(cfg)
  const deletePlaylist = async (payload: DeletePlaylistPayload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, deletePlaylist, abort: deletePlaylistAbort }
}
