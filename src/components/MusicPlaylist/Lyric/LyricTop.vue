<script setup lang="ts">
import { computed } from 'vue'
import { useAudioStore } from '@/stores/audio'
import { useAudio } from '@/hooks/media'

const audioStore = useAudioStore()
const audio = useAudio()

const coverUrl = computed(() => audioStore.coverUrl || '/music.png')
const songTitle = computed(() => audioStore.title || 'Your Music Name')
const statusText = computed(() => {
  if (!audioStore.currentSong) return '等待播放...'
  return audioStore.isPlaying ? '正在播放' : '已暂停'
})
</script>

<template>
  <div class="lyric-top-main">
    <div class="lyric-top-main__disc" :class="{ 'lyric-top-main__disc--playing': audioStore.isPlaying }">
      <div class="lyric-top-main__disc-inner">
        <el-image :src="coverUrl" class="lyric-top-main__cover" />
      </div>
    </div>
    <h3 class="lyric-top-main__title">{{ songTitle }}</h3>
    <p class="lyric-top-main__status">{{ statusText }}</p>
  </div>
</template>

<style scoped>
.lyric-top-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: var(--space-sm);
  transition: color var(--transition-normal);
}

/* ── 唱片外圈*/
.lyric-top-main__disc {
  width: clamp(60px, 28vh, 140px);
  aspect-ratio: 1 / 1;
  border-radius: var(--radius-full);
  background: #1a1028;
  /* border: 1px solid var(--color-border); */
  box-shadow: var(--shadow-md);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3%;
  flex-shrink: 0;
  transition:
    border-color var(--transition-normal),
    box-shadow var(--transition-normal);
}

:root.dark .lyric-top-main__disc {
  background: #120e1e;
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-glow);
}

/* ── 唱片内圈，放封面 ── */
.lyric-top-main__disc-inner {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: var(--radius-full);
  background: #2a2035;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: background var(--transition-normal);
}

:root.dark .lyric-top-main__disc-inner {
  background: #1e1630;
}

.lyric-top-main__cover {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-full);
  object-fit: cover;
}

/* ── 标题 ── */
.lyric-top-main__title {
  margin: 0;
  font-size: clamp(var(--font-size-base), 2.5vh, var(--font-size-lg));
  color: var(--color-text-primary);
  line-height: var(--line-height-tight);
  text-align: center;
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color var(--transition-normal);
}

/* ── 状态文字 ── */
.lyric-top-main__status {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  line-height: var(--line-height-normal);
  transition: color var(--transition-normal);
}

/* ── 播放时唱片旋转（后续接 audio store 的 isPlaying 控制 class 切换） ── */
@keyframes disc-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.lyric-top-main__disc--playing {
  animation: disc-spin 8s linear infinite;
}
</style>
