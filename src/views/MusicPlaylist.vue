<script setup lang="ts">
import LeftList from '@/components/MusicPlaylist/LeftList.vue'
import RightLyric from '@/components/MusicPlaylist/RightLyric.vue'
</script>

<template>
  <div class="music-playlist-main">
    <div class="music-playlist-main__left">
      <left-list />
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
  backdrop-filter: blur(1px);
  -webkit-backdrop-filter: blur(1px);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-soft);
}
.music-playlist-main__left {
  flex: 1;
}

.music-playlist-main__right {
  flex: 0.6;
}
</style>
