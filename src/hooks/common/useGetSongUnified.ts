import { useGetSong } from '@/hooks/song'
import { useGetPlayUrl, useGetLyric } from '@/hooks/thirdparty'
import { parseLrc, type LrcLine } from '@/utils/lrc'

// 统一歌曲结构
export interface UnifiedSong {
  id: string
  title: string
  artist: string | null
  album: string | null
  duration: number | null
  coverUrl: string | null
  audioUrl: string | null
  lyrics: string | null
  source: 'local' | 'tencent'
  vid: string | null
}

export interface UnifiedSongResult {
  song: UnifiedSong
  lyrics: LrcLine[]
  source: 'local' | 'tencent'
}

// 第三方歌曲的元信息（因后端无按 mid 获取详情接口，需调用方提供）
export interface ThirdpartyMeta {
  title?: string
  artist?: string
  album?: string
  duration?: number | null
  coverUrl?: string | null
  vid?: string | null
}

// 判断是否为本地歌曲 id（纯数字）
const isLocalId = (id: string) => /^\d+$/.test(id)

// 统一获取歌曲详情 hook：按 id 字符种类自动识别数据源
export const useGetSongUnified = () => {
  // isLoading 取本地 fetchSong 的 isLoading，简单聚合
  const { fetchSong, isLoading } = useGetSong()
  const { fetchPlayUrl } = useGetPlayUrl()
  const { fetchLyric } = useGetLyric()

  const getSongUnified = async (
    id: string,
    meta?: ThirdpartyMeta,
  ): Promise<{ code?: number; data?: UnifiedSongResult; message?: string }> => {
    if (isLocalId(id)) {
      // 本地歌曲：通过 id 获取详情
      const res = await fetchSong({ id: Number(id) })
      if (!res.data) {
        return { code: res.code, message: res.message || '获取歌曲详情失败' }
      }
      const detail = res.data
      const song: UnifiedSong = {
        id: String(detail.id),
        title: detail.title,
        artist: detail.artist,
        album: detail.album,
        duration: detail.duration,
        coverUrl: detail.coverUrl,
        audioUrl: detail.audioUrl,
        lyrics: detail.lyrics,
        source: 'local',
        vid: null,
      }
      // 本地歌词可能为纯文本无时间戳，parseLrc 会自动按固定间隔分配
      const lyrics = parseLrc(detail.lyrics || '')
      return { code: 200, data: { song, lyrics, source: 'local' } }
    }

    // 第三方歌曲：并行获取播放链接与歌词
    const [playUrlRes, lyricRes] = await Promise.all([
      fetchPlayUrl({ mid: id }),
      fetchLyric({ mid: id }),
    ])
    if (!playUrlRes.data) {
      return { code: playUrlRes.code, message: playUrlRes.message || '获取播放链接失败' }
    }
    const song: UnifiedSong = {
      id,
      title: meta?.title ?? '',
      artist: meta?.artist ?? null,
      album: meta?.album ?? null,
      duration: meta?.duration ?? null,
      coverUrl: meta?.coverUrl ?? null,
      audioUrl: playUrlRes.data,
      lyrics: lyricRes.data?.lrc ?? null,
      source: 'tencent',
      vid: meta?.vid ?? null,
    }
    // 第三方歌词带 LRC 时间戳，正常解析
    const lyrics = parseLrc(lyricRes.data?.lrc || '')
    return { code: 200, data: { song, lyrics, source: 'tencent' } }
  }

  return { getSongUnified, isLoading }
}
