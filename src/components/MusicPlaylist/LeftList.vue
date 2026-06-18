<script setup lang="ts">
import { useAudioStore } from '@/stores/audio'
import { useAudio } from '@/hooks/media'
import SongList from '@/components/MusicPlaylist/SongList.vue'

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
    <SongList :songs="store.playlist" :active-id="store.currentSong?.id" @select="handleSelect" />
  </div>
</template>

<style scoped>
.list-main {
  height: 100%;
}
</style>
