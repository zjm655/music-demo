<script setup lang="ts">
// 适配 SongItem 的 MV 字段
interface Props {
  mvDescription?: string | null
  mvAuthor?: string | null
  coverUrl?: string | null
  mvUrl?: string | null
  duration?: number | null
  songId?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  mvDescription: null,
  mvAuthor: null,
  coverUrl: '/favicon.ico',
  mvUrl: null,
  duration: null,
  songId: null,
})

// 定义点击事件
const emit = defineEmits<{
  click: [id: number]
}>()

// 处理点击
function handleClick() {
  if (props.songId != null) {
    emit('click', props.songId)
  }
}

// 格式化时长
function formatDuration(seconds: number | null): string {
  if (seconds == null) return '--:--'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="mv-card" @click="handleClick">
    <div class="mv-card__cover">
      <el-image class="mv-card__image" :src="props.coverUrl ?? '/favicon.ico'" fit="cover" />
      <div class="mv-card__overlay">
        <span class="mv-card__play-icon"></span>
      </div>
      <span class="mv-card__duration">{{ formatDuration(props.duration) }}</span>
    </div>
    <div class="mv-card__info">
      <p class="mv-card__name" :title="props.mvDescription ?? ''">{{ props.mvDescription ?? '未知 MV' }}</p>
      <span class="mv-card__artist">{{ props.mvAuthor ?? '未知作者' }}</span>
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

/* Duration badge on cover */
.mv-card__duration {
  position: absolute;
  bottom: var(--space-xs);
  right: var(--space-xs);
  font-size: var(--font-size-xs);
  color: var(--color-text-inverse);
  background: rgba(0, 0, 0, 0.5);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  line-height: var(--line-height-tight);
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
