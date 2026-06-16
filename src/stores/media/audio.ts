import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAudioStore = defineStore('audio', () => {
  const isPlaying = ref(false)
  const currentSrc = ref('')
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
  const showPlaylist = ref(false)

  function reset() {
    isPlaying.value = false
    currentSrc.value = ''
    currentTime.value = 0
    duration.value = 0
    title.value = ''
    artist.value = ''
    coverUrl.value = ''
  }

  return {
    isPlaying,
    currentSrc,
    currentTime,
    duration,
    title,
    artist,
    coverUrl,
    volume,
    isMuted,
    showPlaylist,
    reset,
  }
})
