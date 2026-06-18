import { Howl } from 'howler'
import { useAudioStore, type Song } from '@/stores/audio'
import { logger } from '@/utils/logger'
import { ref } from 'vue'

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
  const load = () => {
    if (sound) {
      sound.unload()
      stopProgressUpdate()
    }
    const song = store.currentSong
    // 更新歌曲信息
    if (song) {
      store.title = song.title || ''
      store.artist = song.artist || ''
      store.coverUrl = song.coverUrl || ''
      store.currentTime = 0
      store.duration = 0
    }

    // 更新播放状态

    if (!store.currentSrc) {
      logger.warn('音频资源加载失败！')
      return
    }

    sound = new Howl({
      src: [String(store.currentSrc)],
      html5: true,
      volume: store.isMuted ? 0 : store.volume,
      onplay: () => {
        store.isPlaying = true
        startProgressUpdate()
      },
      onend: () => {
        store.isPlaying = false
        store.currentTime = store.duration
        stopProgressUpdate()
        // 自动播放下一首（播放列表只有一首时不切）
        if (store.playlist.length > 1) {
          nextSong()
        }
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

  // 通过指定 url 加载音频（用于第三方歌曲，不依赖 store.currentSrc）
  const loadByUrl = (url: string) => {
    if (sound) {
      sound.unload()
      stopProgressUpdate()
    }
    const song = store.currentSong
    // 更新歌曲信息
    if (song) {
      store.title = song.title || ''
      store.artist = song.artist || ''
      store.coverUrl = song.coverUrl || ''
      store.currentTime = 0
      store.duration = 0
    }

    if (!url) {
      logger.warn('音频资源加载失败！')
      return
    }

    sound = new Howl({
      src: [String(url)],
      html5: true,
      volume: store.isMuted ? 0 : store.volume,
      onplay: () => {
        store.isPlaying = true
        startProgressUpdate()
      },
      onend: () => {
        store.isPlaying = false
        store.currentTime = store.duration
        stopProgressUpdate()
        // 自动播放下一首（播放列表只有一首时不切）
        if (store.playlist.length > 1) {
          nextSong()
        }
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

  const setPlatlist = (playlist: Song[], index: number) => {
    store.playlist = playlist
    store.index = index
  }

  // 播放
  const play = () => {
    if (sound) {
      sound.play()
      store.isPlaying = true
    }
  }

  // 通过指定 url 加载并播放（用于第三方歌曲）
  const playByUrl = (url: string) => {
    loadByUrl(url)
    play()
  }

  const retry = ref(0)
  // 下一首
  const nextSong = async (getUrl?: (song: Song) => Promise<string | null>) => {
    store.index = (1 + store.index) % store.playlist.length
    if (retry.value >= store.playlist.length) {
      unload()
      return
    }
    if (getUrl) {
      // 第三方歌曲：通过 getUrl 获取播放链接
      const current = store.currentSong
      const url = current ? await getUrl(current) : null
      if (!url) {
        retry.value += 1
        return nextSong(getUrl)
      }
      loadByUrl(url)
      play()
      retry.value = 0
    } else {
      // 本地歌曲：沿用 store.currentSrc
      if (!store.currentSrc) {
        retry.value += 1
        return nextSong()
      }
      load()
      play()
      retry.value = 0
    }
  }

  const prevSong = async (getUrl?: (song: Song) => Promise<string | null>) => {
    store.index = (store.index - 1 + store.playlist.length) % store.playlist.length
    if (retry.value >= store.playlist.length) {
      unload()
      return
    }
    if (getUrl) {
      // 第三方歌曲：通过 getUrl 获取播放链接
      const current = store.currentSong
      const url = current ? await getUrl(current) : null
      if (!url) {
        retry.value += 1
        return prevSong(getUrl)
      }
      loadByUrl(url)
      play()
      retry.value = 0
    } else {
      // 本地歌曲：沿用 store.currentSrc
      if (!store.currentSrc) {
        retry.value += 1
        return prevSong()
      }
      load()
      play()
      retry.value = 0
    }
  }

  const addSongNext = (song: Song) => {
    store.playlist.splice(store.index + 1, 0, song)
  }

  function addSongsToEnd(songs: Song[]) {
    store.playlist.push(...songs)
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
    if (store.isPlaying) {
      pause()
    } else {
      play()
    }
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

  // 设置音量
  const setVolume = (vol: number) => {
    store.volume = vol
    if (sound) {
      sound.volume(store.isMuted ? 0 : vol)
    }
    // 如果音量大于0且处于静音状态，自动取消静音
    if (vol > 0 && store.isMuted) {
      store.isMuted = false
    }
  }

  // 切换静音
  const toggleMute = () => {
    store.isMuted = !store.isMuted
    if (sound) {
      sound.volume(store.isMuted ? 0 : store.volume)
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
      retry.value = 0
    }
  }

  return {
    load,
    loadByUrl,
    play,
    playByUrl,
    pause,
    toggle,
    seek,
    setVolume,
    toggleMute,
    unload,

    setPlatlist,
    nextSong,
    prevSong,
    addSongNext,
    addSongsToEnd,
  }
}
