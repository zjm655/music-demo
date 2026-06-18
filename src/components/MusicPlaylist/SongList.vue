<script setup lang="ts">
import type { Song } from '@/stores/audio'
import SongCard from '@/components/MusicRecommend/SongCard.vue'

defineProps<{
  songs: Song[]
  activeId?: number | string
}>()

const emit = defineEmits<{
  select: [index: number]
}>()
</script>

<template>
  <div class="song-list">
    <el-scrollbar v-if="songs.length">
      <SongCard
        v-for="(song, index) in songs"
        :key="song.id"
        v-bind="song"
        :index="index + 1"
        :active="song.id === activeId"
        @click="emit('select', index)"
      />
    </el-scrollbar>
    <div v-else class="song-list__empty">暂无播放列表</div>
  </div>
</template>

<style scoped>
.song-list {
  height: 100%;
}

.song-list :deep(.el-scrollbar),
.song-list :deep(.el-scrollbar__wrap) {
  height: 100%;
}

.song-list__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}
</style>
