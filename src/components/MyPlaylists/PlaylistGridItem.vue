<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'

interface Props {
  id: number | string
  name: string
  coverUrl?: string | null
  songCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  coverUrl: null,
  songCount: 0,
})

const emit = defineEmits<{
  click: [id: number | string]
  delete: [id: number | string]
}>()

function handleClick() {
  emit('click', props.id)
}

function handleDelete(e: Event) {
  e.stopPropagation()
  emit('delete', props.id)
}
</script>

<template>
  <div class="playlist-grid-item" @click="handleClick">
    <div class="playlist-grid-item__cover-wrapper">
      <el-image class="playlist-grid-item__cover" :src="props.coverUrl || '/favicon.ico'" fit="cover" loading="lazy" />
      <div class="playlist-grid-item__overlay">
        <button class="playlist-grid-item__delete" title="删除歌单" @click="handleDelete">
          <el-icon :size="14"><Delete /></el-icon>
        </button>
      </div>
    </div>
    <div class="playlist-grid-item__info">
      <p class="playlist-grid-item__name" :title="props.name">{{ props.name }}</p>
      <span class="playlist-grid-item__count">{{ props.songCount }} 首歌曲</span>
    </div>
  </div>
</template>

<style scoped>
.playlist-grid-item {
  cursor: pointer;
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
  transition: transform var(--transition-normal, 0.3s);
}

.playlist-grid-item:hover {
  transform: translateY(-2px);
}

.playlist-grid-item__cover-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: var(--radius-md, 8px);
}

.playlist-grid-item__cover {
  width: 100%;
  height: 100%;
}

.playlist-grid-item__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: var(--space-sm, 8px);
  opacity: 0;
  transition: opacity var(--transition-normal, 0.3s);
  border-radius: var(--radius-md, 8px);
  pointer-events: none;
}

.playlist-grid-item__cover-wrapper:hover .playlist-grid-item__overlay {
  opacity: 1;
}

.playlist-grid-item__delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  color: #e74c3c;
  cursor: pointer;
  pointer-events: auto;
  transition: transform var(--transition-fast, 0.15s), background var(--transition-fast, 0.15s);
}

.playlist-grid-item__delete:hover {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 1);
}

.playlist-grid-item__info {
  padding: var(--space-sm, 8px) var(--space-xs, 4px) 0;
}

.playlist-grid-item__name {
  margin: 0;
  font-size: var(--font-size-sm, 13px);
  color: var(--color-text-primary, #303133);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  transition: color var(--transition-fast, 0.15s);
}

.playlist-grid-item:hover .playlist-grid-item__name {
  color: var(--color-primary, #8b5cf6);
}

.playlist-grid-item__count {
  font-size: var(--font-size-xs, 12px);
  color: var(--color-text-secondary, #909399);
  margin-top: var(--space-xs, 4px);
  line-height: 1.5;
}
</style>
