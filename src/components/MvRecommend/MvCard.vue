<script setup lang="ts">
import { VideoPlay } from '@element-plus/icons-vue'
interface Props {
  name?: string
  artist?: string
  playCount?: number
  imageUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  name: '搬家',
  artist: '张震岳',
  playCount: 6005,
  imageUrl: '/favicon.ico',
})

function formatPlayCount(count: number): string {
  if (count >= 10000) {
    const wan = count / 10000
    return wan >= 10 ? `${Math.round(wan)}万` : `${wan.toFixed(1)}万`
  }
  return String(count)
}
</script>

<template>
  <div class="mv-card">
    <div class="mv-card__cover">
      <el-image class="mv-card__image" :src="props.imageUrl" fit="cover" />
      <div class="mv-card__overlay">
        <span class="mv-card__play-icon"></span>
      </div>
      <span class="mv-card__count">
        <el-icon><VideoPlay /></el-icon>{{ formatPlayCount(props.playCount) }}</span
      >
    </div>
    <div class="mv-card__info">
      <p class="mv-card__name" :title="props.name">{{ props.name }}</p>
      <span class="mv-card__artist">{{ props.artist }}</span>
    </div>
  </div>
</template>

<style scoped>
.mv-card {
  cursor: pointer;
  transition: transform var(--transition-normal);
}

.mv-card:hover {
  transform: translateY(-2px);
}

/* Cover area - 16:10 video thumbnail ratio */
.mv-card__cover {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: var(--radius-md);
}

.mv-card__image {
  width: 100%;
  height: 100%;
}

/* Hover overlay */
.mv-card__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity var(--transition-normal);
  border-radius: var(--radius-md);
}

.mv-card__cover:hover .mv-card__overlay {
  opacity: 1;
}

/* Play icon: white circle + triangle */
.mv-card__play-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  transition: transform var(--transition-fast);
}

.mv-card__play-icon::after {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 8px 0 8px 14px;
  border-color: transparent transparent transparent #333;
  margin-left: 3px;
}

.mv-card__cover:hover .mv-card__play-icon {
  transform: scale(1.1);
}

/* Play count badge on cover */
.mv-card__count {
  position: absolute;
  bottom: var(--space-xs);
  right: var(--space-xs);
  font-size: var(--font-size-xs);
  color: var(--color-text-inverse);
  background: rgba(0, 0, 0, 0.5);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  line-height: var(--line-height-tight);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Text section */
.mv-card__info {
  padding: var(--space-sm) var(--space-xs) 0;
}

.mv-card__name {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: var(--line-height-normal);
  transition: color var(--transition-fast);
}

.mv-card__name:hover {
  color: var(--color-primary);
}

.mv-card__artist {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  transition: color var(--transition-fast);
}

.mv-card__artist:hover {
  color: var(--color-primary-hover);
}
</style>
