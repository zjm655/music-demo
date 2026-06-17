import { Howl } from 'howler'
import { useAudioStore } from '@/stores/audio'

// Howl是外部库实例，不方便进行响应式，因此不放到store里面，而是放在这里进行隔离
let sound: Howl | null = null
let rafId: number | null = null

export function useAudio() {
  const store = useAudioStore()

  function stopProgressUpdate() {
    if (rafId) {
      // cancelAnimationFrame是浏览器提供的动画帧api，可以取消之前注册在动画帧的回调
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  function startProgressUpdate() {
    stopProgressUpdate()
    const update = () => {
      if (sound && store.isPlaying) {
        store.currentTime = sound.seek() as number
        // requestAnimationFrame也是浏览器的动画帧api，可以为下一帧注册一个回调，这里通过递归，让其自动注册，不断循环
        rafId = requestAnimationFrame(update)
      } else {
        stopProgressUpdate()
      }
    }
    rafId = requestAnimationFrame(update)
  }

  // 加载音频
  const load = (src: string) => {
    if (sound) {
      sound.unload()
      stopProgressUpdate()
    }

    store.currentSrc = src
    store.currentTime = 0
    store.duration = 0

    sound = new Howl({
      src: [src],
      html5: true,
      onplay: () => {
        store.isPlaying = true
        startProgressUpdate()
      },
      onend: () => {
        store.isPlaying = false
        store.currentTime = store.duration
        stopProgressUpdate()
      },
      onstop: () => {
        store.isPlaying = false
        stopProgressUpdate()
      },
      onload: () => {
        store.duration = sound?.duration() || 0
      },
      onloaderror: () => {
        store.isPlaying = false
        stopProgressUpdate()
      },
      onplayerror: () => {
        store.isPlaying = false
        stopProgressUpdate()
      },
    })
  }

  // 播放
  const play = () => {
    if (sound) {
      sound.play()
      store.isPlaying = true
    }
  }

  // 暂停
  const pause = () => {
    if (sound) {
      sound.pause()
      store.isPlaying = false
      stopProgressUpdate()
    }
  }

  // 切换暂停于播放
  const toggle = () => {
    store.isPlaying ? pause() : play()
  }

  // 手动切换播放进度
  const seek = (time: number) => {
    if (sound) {
      // 进行安全处理，防止用户修改不在范围内的值
      const target = Math.max(0, Math.min(time, store.duration))
      sound.seek(target)
      store.currentTime = target
    }
  }

  // 结束播放
  const unload = () => {
    if (sound) {
      sound.unload()
      sound = null
      stopProgressUpdate()
      // 重置所有状态
      store.reset()
    }
  }

  return {
    load,
    play,
    pause,
    toggle,
    seek,
    unload,
  }
}
