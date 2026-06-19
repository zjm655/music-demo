<script setup lang="ts">
import SongList from '@/components/MusicPlaylist/SongList.vue'
import { useAudioStore } from '@/stores/audio'
import SongCard from '@/components/MusicRecommend/SongCard.vue'

const audioStore = useAudioStore()

// 表头配置
const header = ['#', '', '', '', '', '', '']

</script>

<template>
  <div class="audio-playlist">
    <SongList :is-null="audioStore.playlist.length === 0" :header="header">
      <SongCard


      />
    </SongList>
  </div>
</template>

<style scoped>
.audio-playlist {
  height: 100%;
}
</style>
