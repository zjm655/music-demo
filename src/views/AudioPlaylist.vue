<script setup lang="ts">
import SongList from '@/components/MusicPlaylist/SongList.vue'
import AudioSong from '@/components/MusicPlaylist/card/AudioSong.vue'
import { useAudioStore } from '@/stores/audio'

const audioStore = useAudioStore()

// 表头配置
const header = ['#', '标题', '歌手', '作曲', '作词', '', '时长']
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
        :mv-url="song.mvUrl"
        :vid="song.vid"
        :active="index === audioStore.index"
        :index="index + 1"
      />
    </SongList>
  </div>
</template>

<style scoped>
.audio-playlist {
  height: 100%;
}
</style>
