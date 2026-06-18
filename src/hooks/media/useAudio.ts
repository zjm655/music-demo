import { Howl } from 'howler'
import { useAudioStore, type Song } from '@/stores/audio'
import { useGetPlayUrl } from '@/hooks/thirdparty'
import { useGetSong } from '@/hooks/song'
import { popup } from '@/utils/popup'
import { logger } from '@/utils/logger'
import { ref } from 'vue'

// Howl是外部库实例，不方便进行响应式，因此不放到store里面，而是放在这里进行隔离
let sound: Howl | null = null
let rafId: number | null = null

// 判断是否为第三方歌曲 id（非纯数字）
const isThirdpartyId = (id: string | number) => !/^\d+$/.test(String(id))

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

  // 加载音频（依赖 store.currentSrc）
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

  // 辅助函数：更新 playlist 中的歌曲信息
  function updateSongInPlaylist(song: Song) {
    const index = store.playlist.findIndex((s) => s.id === song.id)
    if (index !== -1) {
      store.playlist[index] = { ...store.playlist[index], ...song }
    }
  }

  // 通过 id 加载并播放（统一处理本地和第三方歌曲）
  const loadById = async (id?: number | string) => {
    // 1. 确定目标 id
    const targetId = id ?? store.currentSong?.id
    if (targetId == null) {
      popup.message.warning('请先选择歌曲')
      return
    }

    // 2. 从 playlist 找到歌曲并更新 index
    let songIndex = store.playlist.findIndex((s) => s.id === targetId)

    // 3. 获取播放链接
    let url: string | null = null
    let currentSong = songIndex !== -1 ? store.playlist[songIndex] : null

    // 第三方歌曲需要异步获取
    if (isThirdpartyId(targetId)) {
      const { fetchPlayUrl } = useGetPlayUrl()
      const { fetchSong } = useGetSong()

      // 并行请求播放链接和歌曲详情
      const [playRes, songRes] = await Promise.all([
        fetchPlayUrl({ mid: String(targetId) }),
        fetchSong({ id: Number(targetId) }),
      ])

      url = playRes?.data ?? null

      // 更新歌曲详情到 playlist
      if (songRes?.code === 200 && songRes?.data) {
        const fullSong = songRes.data as unknown as Song
        // 如果歌曲不在 playlist 中，先添加
        if (songIndex === -1) {
          store.playlist.push(fullSong)
          songIndex = store.playlist.length - 1
        } else {
          updateSongInPlaylist(fullSong)
        }
        // 重新获取更新后的 url
        url = fullSong.audioUrl
      }

      currentSong = songIndex !== -1 ? store.playlist[songIndex] : null

      // 缓存播放链接
      if (url && currentSong) {
        currentSong.audioUrl = url
      }
    } else {
      // 本地歌曲：直接用 audioUrl
      url = currentSong?.audioUrl ?? null
    }

    // 4. 更新 index
    store.index = songIndex

    // 5. 无链接则提示
    if (!url) {
      popup.message.warning('该歌曲暂无可用音频')
      return
    }

    // 6. 加载并播放
    load()
    play()
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

  const retry = ref(0)

  // 下一首
  const nextSong = async () => {
    if (store.playlist.length === 0) return
    const nextIndex = (store.index + 1) % store.playlist.length
    const nextId = store.playlist[nextIndex]?.id
    if (nextId == null) {
      retry.value += 1
      if (retry.value >= store.playlist.length) {
        unload()
        return
      }
      store.index = nextIndex
      return nextSong()
    }
    retry.value = 0
    await loadById(nextId)
  }

  // 上一首
  const prevSong = async () => {
    if (store.playlist.length === 0) return
    const prevIndex = (store.index - 1 + store.playlist.length) % store.playlist.length
    const prevId = store.playlist[prevIndex]?.id
    if (prevId == null) {
      retry.value += 1
      if (retry.value >= store.playlist.length) {
        unload()
        return
      }
      store.index = prevIndex
      return prevSong()
    }
    retry.value = 0
    await loadById(prevId)
  }

  // 添加歌曲到下一首并立即播放
  const addNextAndPlay = async (id: number | string) => {
    const { fetchSong } = useGetSong()
    const res = await fetchSong({ id: Number(id) })
    if (res?.code === 200 && res?.data) {
      const song = res.data as unknown as Song
      store.playlist.splice(store.index + 1, 0, song)
      await loadById(id)
    }
  }

  // 添加歌曲到下一首（不立即播放）
  const addNext = async (id: number | string) => {
    const { fetchSong } = useGetSong()
    const res = await fetchSong({ id: Number(id) })
    if (res?.code === 200 && res?.data) {
      const song = res.data as unknown as Song
      store.playlist.splice(store.index + 1, 0, song)
    }
  }

  // 添加歌曲到下一首（已有歌曲对象）
  const addSongNext = (song: Song) => {
    store.playlist.splice(store.index + 1, 0, song)
  }

  // 添加歌曲数组到末尾
  const addSongsToEnd = (songs: Song[]) => {
    store.playlist.push(...songs)
  }

  // 通过 id 数组添加歌曲到末尾
  const addSongsByIds = async (ids: number[]) => {
    const { fetchSong } = useGetSong()
    const promises = ids.map((id) => fetchSong({ id }))
    const results = await Promise.all(promises)
    const songs = results
      .filter((r) => r?.code === 200 && r?.data)
      .map((r) => r!.data as unknown as Song)
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
    loadById,
    play,
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
    addNext,
    addNextAndPlay,
    addSongsToEnd,
    addSongsByIds,
  }
}