// import { useAudio } from '@/hooks/media'
// import { useAudioStore } from '@/stores/audio'
// import { markSongHistory } from '@/api/markSongHistory'
// import { logger } from '@/utils/logger'

// export interface PlayableSong {
//   id: string | number
//   title: string
//   artist: string
//   coverUrl?: string | null
//   audioUrl?: string | null
// }

// export function usePlaySong() {
//   const audio = useAudio()
//   const store = useAudioStore()

//   // 播放一首歌：加载到播放器 + 写入 store  + 记录历史（fire-and-forget）
//   const playSong = (song: PlayableSong) => {
//     if (!song.audioUrl) {
//       logger.warn('该歌曲没有可播放的音频链接')
//       return
//     }
//     // 写入元信息
//     store.title = song.title
//     store.artist = song.artist
//     store.coverUrl = song.coverUrl || ''
//     // 加载并播放
//     audio.load(song.audioUrl)
//     audio.play()
//     // 记录播放历史（不阻塞，失败静默）
//     markSongHistory({
//       songId: song.id,
//       songMeta: {
//         id: song.id,
//         title: song.title,
//         artist: song.artist,
//         coverUrl: song.coverUrl || undefined,
//         audioUrl: song.audioUrl,
//       },
//     }).catch(() => {})
//   }

//   return { playSong }
// }

// 适配的是就播放器，待修改
