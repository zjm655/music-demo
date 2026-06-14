<script setup lang="ts">
import SongCard from './SongCard.vue'

interface Song {
  name: string
  artist: string
  duration: string
  coverUrl: string
}

interface Props {
  songs?: Song[]
}

const props = withDefaults(defineProps<Props>(), {
  songs: () => [
    { name: '晴天', artist: '周杰伦', duration: '4:29', coverUrl: '/favicon.ico' },
    { name: '起风了', artist: '买辣椒也用券', duration: '5:12', coverUrl: '/favicon.ico' },
    { name: '孤勇者', artist: '陈奕迅', duration: '4:16', coverUrl: '/favicon.ico' },
    { name: '稻香', artist: '周杰伦', duration: '3:43', coverUrl: '/favicon.ico' },
    { name: '光年之外', artist: '邓紫棋', duration: '3:55', coverUrl: '/favicon.ico' },
    { name: '漠河舞厅', artist: '柳爽', duration: '4:44', coverUrl: '/favicon.ico' },
    { name: '错位时空', artist: '艾辰', duration: '3:38', coverUrl: '/favicon.ico' },
    { name: '平凡之路', artist: '朴树', duration: '4:46', coverUrl: '/favicon.ico' },
    { name: '夜曲', artist: '周杰伦', duration: '3:46', coverUrl: '/favicon.ico' },
  ],
})
</script>

<template>
  <div class="music-recommend-card">
    <div class="card-header">
      <button class="play-all-btn">▶ 播放全部</button>
    </div>
    <div class="song-grid">
      <SongCard v-for="(song, index) in props.songs" :key="index" v-bind="song" />
    </div>
  </div>
</template>

<style scoped>
.music-recommend-card {
  width: 100%;
  border-radius: var(--radius-md, 12px);
  padding: var(--space-lg, 16px);
}

/* Header with play-all button */
.card-header {
  margin-bottom: var(--space-md, 12px);
}

.play-all-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs, 4px);
  padding: var(--space-xs, 4px) var(--space-md, 12px);
  font-size: var(--font-size-sm, 13px);
  color: var(--color-primary, #8b5cf6);
  background: var(--color-primary-soft, #f3e8ff);
  border: none;
  border-radius: var(--radius-sm, 6px);
  cursor: pointer;
  transition:
    background var(--transition-fast, 0.15s),
    color var(--transition-fast, 0.15s);
}

.play-all-btn:hover {
  background: var(--color-primary, #8b5cf6);
  color: #ffffff;
}

/* Song grid */
.song-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm, 8px);
}

@media (max-width: 600px) {
  .song-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 400px) {
  .song-grid {
    grid-template-columns: 1fr;
  }
}
</style>
