<script setup lang="ts">
import SongCard from './SongCard.vue'
import type { GetSongsResPayload } from '@/hooks/song'
import { useAudio } from '@/hooks/media'

// 如果需要默认值，必须搭配 withDefaults
const props = withDefaults(
  defineProps<{
    songs: GetSongsResPayload['list']
    pageIndex: number | string
    size: number | string
  }>(),
  {
    size: 9,
    pageIndex: 1,
  },
)

async function openAudio(id: number) {
  useAudio().setPlatlist(props.songs, Number(id))
  useAudio().load()
  useAudio().play()
}
</script>

<template>
  <div class="music-recommend-card">
    <div class="card-header">
      <!-- <button class="play-all-btn">▶ 播放全部</button> -->
    </div>
    <!-- 小卡片 -->
    <div class="song-grid">
      <SongCard
        v-for="(song, index) in props.songs"
        :key="song.id"
        v-bind="song"
        @click="openAudio(index)"
      />
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
