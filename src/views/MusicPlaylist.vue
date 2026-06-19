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
  height: 87vh;
  padding: calc(50px - 4vh);
  background: var(--gradient-glass);
  backdrop-filter: blur(0.1px);
  -webkit-backdrop-filter: blur(0.1px);
  /* border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-soft); */
      width: 100vw;
    margin: 0 auto;
}
.music-playlist-main__left {
  flex: 1;
}

.music-playlist-main__right {
  flex: 0.6;
}
</style>
