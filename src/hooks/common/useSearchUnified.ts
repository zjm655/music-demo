import { ref } from 'vue'
import { useSearchSongs } from '@/hooks/song'
import { useSearchThirdpartySongs } from '@/hooks/thirdparty'
import { logger } from '@/utils/logger'
import type { SongSearchItem } from '@/api/song'
import type { TencentSongDTO } from '@/api/thirdparty'

export interface UnifiedSearchResult {
  id: string | number
  title: string
  artist: string | null
  album: string | null
  duration: number | null
  coverUrl: string | null
  audioUrl: string | null
  source: 'local' | 'tencent'
  lyricist?: string | null
  composer?: string | null
  lyrics?: string | null
  mvUrl?: string | null
  mvDescription?: string | null
  mvAuthor?: string | null
  category?: string | null
  categoryId?: number | null
  vid?: string | null
  pay?: string | null
}

export interface SearchUnifiedPayload {
  keyword: string
  page?: number
  pageSize?: number
  includeThirdParty?: boolean
}

export interface SearchUnifiedResPayload {
  list: UnifiedSearchResult[]
  total: number
  page: number
  pageSize: number
  localCount: number
  thirdpartyCount: number
}

export const useSearchUnified = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const { searchSongs, abort: localAbort } = useSearchSongs()
  const { searchThirdpartySongs, abort: thirdAbort } = useSearchThirdpartySongs()

  const search = async (payload: SearchUnifiedPayload): Promise<{
    code: number
    message: string
    data?: SearchUnifiedResPayload
  }> => {
    isLoading.value = true
    error.value = null

    const { keyword, page = 1, pageSize = 35, includeThirdParty = true } = payload

    try {
      const promises: Promise<UnifiedSearchResult[]>[] = []

      promises.push(
        searchSongs({ keyword, page, pageSize }).then((res) => {
          const list: UnifiedSearchResult[] = []
          if (res?.code === 200 && res?.data) {
            res.data.list.forEach((item: SongSearchItem) => {
              list.push({
                id: item.id,
                title: item.title,
                artist: item.artist,
                album: item.album,
                duration: item.duration,
                coverUrl: item.coverUrl,
                audioUrl: item.audioUrl,
                source: 'local',
                lyricist: item.lyricist,
                composer: item.composer,
                lyrics: item.lyrics,
                mvUrl: item.mvUrl,
                mvDescription: item.mvDescription,
                mvAuthor: item.mvAuthor,
                category: item.category,
                categoryId: item.categoryId,
              })
            })
          }
          return list
        }),
      )

      if (includeThirdParty) {
        promises.push(
          searchThirdpartySongs({ keyword, page, num: pageSize }).then((res) => {
            if (res?.code === 200 && res?.data?.list) {
              return res.data.list.map((item: TencentSongDTO): UnifiedSearchResult => ({
                id: item.id,
                title: item.song,
                artist: item.singer || null,
                album: item.album || null,
                duration: null,
                coverUrl: item.cover || null,
                audioUrl: null,
                source: 'tencent',
                vid: item.vid || null,
                pay: item.pay || null,
              }))
            }
            return []
          }),
        )
      }

      const results = await Promise.all(promises)
      const mergedList = results.flat()
      const localResult = results[0] || []
      const thirdResult = results[1] || []

      return {
        code: 200,
        message: '搜索成功',
        data: {
          list: mergedList,
          total: mergedList.length,
          page,
          pageSize,
          localCount: localResult.length,
          thirdpartyCount: includeThirdParty ? thirdResult.length : 0,
        },
      }
    } catch (e) {
      logger.warn('搜索异常:', e)
      error.value = String(e)
      return { code: 0, message: String(e) }
    } finally {
      isLoading.value = false
    }
  }

  const abort = () => {
    localAbort?.abort?.()
    thirdAbort?.abort?.()
  }

  return { search, isLoading, error, abort }
}