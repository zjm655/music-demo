<script setup lang="ts">
import { Headset } from '@element-plus/icons-vue'
interface Props {
  title?: string
  playCount?: string
  imageUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '每日推荐歌单 | 经典华语流行歌曲精选',
  playCount: '128万',
  imageUrl: '/favicon.ico',
})
</script>

<template>
  <div class="playlist-card">
    <!-- Image section with hover overlay -->
    <div class="image-wrapper">
      <el-image class="cover-image" :src="props.imageUrl" fit="cover" />
      <div class="image-overlay">
        <span class="play-icon"></span>
      </div>
    </div>
    <!-- Text section -->
    <div class="card-info">
      <p class="card-title" :title="props.title">{{ props.title }}</p>
      <span class="card-play-count"
        ><el-icon><Headset /></el-icon>{{ props.playCount }}</span
      >
    </div>
  </div>
</template>

<style scoped>
.playlist-card {
  cursor: pointer;
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
  transition: transform var(--transition-normal, 0.3s);
}

.playlist-card:hover {
  transform: translateY(-2px);
}

/* Image wrapper - maintains square aspect ratio */
.image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: var(--radius-md, 8px);
}

.cover-image {
  width: 100%;
  height: 100%;
}

/* Hover overlay */
.image-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity var(--transition-normal, 0.3s);
  border-radius: var(--radius-md, 8px);
}

.image-wrapper:hover .image-overlay {
  opacity: 1;
}

/* Play icon: white circle with black triangle */
.play-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  transition: transform var(--transition-fast, 0.15s);
}

.play-icon::after {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 8px 0 8px 14px;
  border-color: transparent transparent transparent #333;
  margin-left: 3px;
}

.image-wrapper:hover .play-icon {
  transform: scale(1.1);
}

/* Text section */
.card-info {
  padding: var(--space-sm, 8px) var(--space-xs, 4px) 0;
}

.card-title {
  margin: 0;
  font-size: var(--font-size-sm, 13px);
  color: var(--color-text-primary, #303133);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  transition: color var(--transition-fast, 0.15s);
}

.card-title:hover {
  color: var(--color-primary, #409eff);
}

.card-play-count {
  display: flex;
  align-items: center;
  font-size: var(--font-size-xs, 12px);
  color: var(--color-text-secondary, #909399);
  margin-top: var(--space-xs, 4px);
  line-height: 1.5;
  transition: color var(--transition-fast, 0.15s);
}

.card-play-count:hover {
  color: var(--color-primary-hover, #66b1ff);
}
</style>
