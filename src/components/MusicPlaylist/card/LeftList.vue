<script setup lang="ts">
import { useAudioStore } from '@/stores/audio'
import { useAudio } from '@/hooks/media'
import SongList from '@/components/MusicPlaylist/SongList.vue'
import AudioSong from '@/components/MusicPlaylist/card/AudioSong.vue'

const store = useAudioStore()
const audio = useAudio()

function handleSelect(index: number) {
  audio.setPlatlist(store.playlist, index)
  audio.load()
  audio.play()
}
</script>

<template>
  <div class="list-main">
    <SongList :songs="store.playlist" :active-index="store.index">
      <template #default="{ activeIndex }">
        <AudioSong
          v-for="(song, index) in store.playlist"
          :key="song.id"
          :id="song.id"
          :title="song.title"
          :artist="song.artist"
          :lyricist="song.lyricist"
          :composer="song.composer"
          :duration="song.duration"
          :active="index === activeIndex"
          :index="index + 1"
          @select="handleSelect(index)"
        />
      </template>
    </SongList>
  </div>
</template>

<style scoped>
.list-main {
  height: 100%;
}
</style>
