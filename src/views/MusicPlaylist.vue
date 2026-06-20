<script setup lang="ts">
import RightLyric from '@/components/MusicPlaylist/RightLyric.vue'
</script>

<template>
  <div class="music-playlist-main">
    <div class="music-playlist-main__left">
      <router-view />
    </div>
    <div class="music-playlist-main__right">
      <right-lyric />
    </div>
  </div>
</template>

<style scoped>
.music-playlist-main {
  display: flex;
  height: 70vh;
  padding: calc(50px - 4vh);
  background: var(--gradient-glass);
  width: 100vw;
  margin: 0 auto;
}
.music-playlist-main__left {
  flex: 1;
}

.music-playlist-main__right {
  flex: 0.6;
  height: 100%;
  overflow: hidden;
}
</style>
