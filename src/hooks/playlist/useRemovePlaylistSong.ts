import { useOperatePlaylistSong } from './useOperatePlaylistSong'
import { useRemoveExternalSong } from './useRemoveExternalSong'

/**
 * 自动识别本地/第三方歌曲，路由到对应的删除接口
 * 本地 → operatePlaylistSong(action: 'remove')
 * 第三方 → removeExternalSong
 */
export const useRemovePlaylistSong = () => {
  const { operatePlaylistSong } = useOperatePlaylistSong()
  const { removeExternalSong } = useRemoveExternalSong()

  const remove = async (payload: {
    playlistId: number
    songId: number | string
    source: string
  }): Promise<{ code?: number }> => {
    if (payload.source === 'local') {
      return operatePlaylistSong({
        playlistId: payload.playlistId,
        songId: Number(payload.songId),
        action: 'remove',
      })
    }
    return removeExternalSong({
      playlistId: payload.playlistId,
      songId: String(payload.songId),
      source: payload.source,
    })
  }

  return { remove }
}
