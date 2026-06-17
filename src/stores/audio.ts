import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
export interface Song {
  id: string
  title: string
  artist: string | null
  album: string | null
  duration: number | null
  lyricist: string | null
  composer: string | null
  lyrics: string | null
  audioUrl: string | null
  mvUrl: string | null
  mvDescription: string | null
  mvAuthor: string | null
  category: string | null
  coverUrl: string | null
  createTime: string
  categoryId: number | null
}

export const useAudioStore = defineStore('audio', () => {
  // 播放列表
  const playlist = ref<Song[]>([])
  const index = ref(0)
  const isPlaying = ref(false)
  // const currentSrc = ref('')
  const currentSong = computed(() => {
    return playlist.value[index.value]
  })

  const currentSrc = computed(() => {
    return playlist.value[index.value]?.audioUrl
  })

  const currentTime = ref(0)
  const duration = ref(0)
  // 当前歌曲信息
  const title = ref('')
  const artist = ref('')
  const coverUrl = ref('')

  // 音量
  const volume = ref(0.8)
  // 是否静音
  const isMuted = ref(false)

  // 播放列表面板
  const showPlaylist = ref(true)

  function reset() {
    index.value = 0
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0
    title.value = ''
    artist.value = ''
    coverUrl.value = ''
  }

  return {
    isPlaying,
    currentSrc,
    currentSong,
    currentTime,
    duration,
    playlist,
    index,
    title,
    artist,
    coverUrl,
    volume,
    isMuted,
    showPlaylist,
    reset,
  }
})
