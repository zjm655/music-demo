import { useAudio } from '@/hooks/media'
import { useGetPlayUrl } from '@/hooks/thirdparty'
import { popup } from '@/utils/popup'
import type { Song } from '@/stores/audio'

// 可播放歌曲的最小结构
export interface PlayableSong {
  id: string | number
  title: string
  artist?: string | null
  coverUrl?: string | null
  audioUrl?: string | null
  source?: string
}

// 判断是否为第三方歌曲 id（非纯数字）
const isThirdpartyId = (id: string) => !/^\d+$/.test(id)

// 播放编排 hook：识别来源→取 audioUrl→load→play
export const usePlaySong = () => {
  const audio = useAudio()
  const { fetchPlayUrl } = useGetPlayUrl()

  // 获取播放链接：供 audio.nextSong(getUrl) / prevSong(getUrl) 使用
  // 有 audioUrl 直接返回；id 非纯数字（第三方）则请求 fetchPlayUrl；否则返回 null
  const getUrl = async (song: Song): Promise<string | null> => {
    if (song.audioUrl) return song.audioUrl
    const id = String(song.id)
    if (isThirdpartyId(id)) {
      const res = await fetchPlayUrl({ mid: id })
      return res.data ?? null
    }
    return null
  }

  // 播放歌曲：识别来源→取 audioUrl→load→play
  const playSong = async (song: PlayableSong, playlist?: Song[], index?: number) => {
    // 若提供播放列表与索引，先设置播放列表
    if (playlist && index !== undefined) {
      audio.setPlatlist(playlist, index)
    }

    // 获取播放链接：有 audioUrl 直接用；否则第三方请求 fetchPlayUrl；本地无 audioUrl 则为 null
    let url: string | null = song.audioUrl ?? null
    if (!url) {
      const id = String(song.id)
      if (isThirdpartyId(id)) {
        const res = await fetchPlayUrl({ mid: id })
        url = res.data ?? null
      }
    }

    // 无可用音频时提示并返回
    if (!url) {
      popup.message.warning('该歌曲暂无可用音频')
      return
    }

    audio.playByUrl(url)
  }

  return { playSong, getUrl }
}
