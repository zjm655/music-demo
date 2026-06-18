<script setup lang="ts">
import { computed } from 'vue'
import SongList from '@/components/MusicPlaylist/SongList.vue'
import AudioSong from '@/components/MusicPlaylist/AudioSong.vue'
import { useAudioStore } from '@/stores/audio'

const audioStore = useAudioStore()

// 表头配置
const header = ['#', '标题', '歌手', '', '', '', '时长']

// 当前播放歌曲 ID
const currentSongId = computed(() => audioStore.currentSong?.id)

// 处理歌曲选择
function handleSelect(index: number) {
  audioStore.index = index
  audioStore.isPlaying = true
}
</script>

<template>
  <div class="audio-playlist">
    <SongList :is-null="audioStore.playlist.length === 0" :header="header">
      <AudioSong
        v-for="(song, index) in audioStore.playlist"
        :key="song.id"
        :id="song.id"
        :title="song.title"
        :artist="song.artist"
        :lyricist="song.lyricist"
        :composer="song.composer"
        :duration="song.duration"
        :active="song.id === currentSongId"
        :index="index + 1"
        @select="handleSelect(index)"
      />
    </SongList>
  </div>
</template>

<style scoped>
.audio-playlist {
  height: 100%;
}
</style>
