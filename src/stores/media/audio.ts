import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAudioStore = defineStore('audio', () => {
  const isPlaying = ref(false)
  const currentSrc = ref('')
  const currentTime = ref(0)
  const duration = ref(0)
  // 音量
  const volume = ref(0.8)

  function reset() {
    isPlaying.value = false
    currentSrc.value = ''
    currentTime.value = 0
    duration.value = 0
  }

  return {
    isPlaying,
    currentSrc,
    currentTime,
    duration,
    volume,
    reset,
  }
})
