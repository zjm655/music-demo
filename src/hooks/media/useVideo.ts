import { useMediaControls } from '@vueuse/core'
import type { Ref } from 'vue'
import { ref } from 'vue'

export function useVideo(videoRef: Ref<HTMLVideoElement | null>) {
  const {
    currentTime,
    duration,
    waiting,
    seeking,
    ended,
    stalled,
    playing,
    rate,
    volume,
    muted,
    buffered,
    isPictureInPicture,
    supportsPictureInPicture,
    togglePictureInPicture,
    onSourceError,
    onPlaybackError,
  } = useMediaControls(videoRef)

  const currentSrc = ref('')

  const load = (src: string) => {
    if (!videoRef.value) return
    currentSrc.value = src
    videoRef.value.src = src
    videoRef.value.load()
  }

  const play = () => {
    videoRef.value?.play()
  }

  const pause = () => {
    videoRef.value?.pause()
  }

  const toggle = () => {
    if (playing.value) {
      pause()
    } else {
      play()
    }
  }

  const seek = (time: number) => {
    if (!videoRef.value) return
    const target = Math.max(0, Math.min(time, duration.value))
    videoRef.value.currentTime = target
  }

  const setVolume = (val: number) => {
    if (videoRef.value) {
      videoRef.value.volume = Math.max(0, Math.min(1, val))
    }
  }

  const setMuted = (val: boolean) => {
    if (videoRef.value) {
      videoRef.value.muted = val
    }
  }

  const setRate = (val: number) => {
    if (videoRef.value) {
      videoRef.value.playbackRate = val
    }
  }

  const unload = () => {
    if (!videoRef.value) return
    videoRef.value.pause()
    videoRef.value.removeAttribute('src')
    videoRef.value.load()
    currentSrc.value = ''
  }

  return {
    // 状态
    currentTime,
    duration,
    waiting,
    seeking,
    ended,
    stalled,
    playing,
    rate,
    volume,
    muted,
    buffered,
    currentSrc,
    isPictureInPicture,
    supportsPictureInPicture,

    // 事件钩子
    onSourceError,
    onPlaybackError,

    // 控制方法
    load,
    play,
    pause,
    toggle,
    seek,
    setVolume,
    setMuted,
    setRate,
    unload,
    togglePictureInPicture,
  }
}
