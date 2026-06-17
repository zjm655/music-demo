<script setup lang="ts">
import { useAudioStore } from '@/stores/audio'
import { useAudio } from '@/hooks/media'
import {
  CaretRight,
  VideoPause,
  ArrowLeftBold,
  ArrowRightBold,
  Switch,
  Headset,
  Operation,
  MagicStick,
} from '@element-plus/icons-vue'

const audioStore = useAudioStore()
const audio = useAudio()

// 拖动进度条
const handleSeek = (e: Event) => {
  const val = (e.target as HTMLInputElement).valueAsNumber
  audio.seek(val)
}

// 拖动音量条
const handleVolume = (e: Event) => {
  const val = (e.target as HTMLInputElement).valueAsNumber
  audio.setVolume(val)
}
</script>

<template>
  <div class="audio-player">
    <!-- 封面 -->
    <div class="player__art">
      <img
        v-if="audioStore.coverUrl"
        :src="audioStore.coverUrl"
        :alt="audioStore.title"
        class="player__art-img"
      />
      <div v-else class="player__art-placeholder">
        <el-icon :size="20"><MagicStick /></el-icon>
      </div>
    </div>

    <!-- 歌曲信息 -->
    <div class="player__info">
      <span class="player__title">{{ audioStore.title || '等待播放...' }}</span>
      <span class="player__artist">{{ audioStore.artist || '' }}</span>
    </div>

    <!-- 播放控制 -->
    <div class="player__controls">
      <button class="player__btn" title="单曲循环">
        <el-icon><Switch /></el-icon>
      </button>
      <button class="player__btn" title="上一首" @click="audio.prevSong()">
        <el-icon><ArrowLeftBold /></el-icon>
      </button>
      <button
        class="player__btn player__btn--play"
        :title="audioStore.isPlaying ? '暂停' : '播放'"
        @click="audio.toggle()"
      >
        <el-icon v-if="audioStore.isPlaying"><VideoPause /></el-icon>
        <el-icon v-else><CaretRight /></el-icon>
      </button>
      <button class="player__btn" title="下一首" @click="audio.nextSong()">
        <el-icon><ArrowRightBold /></el-icon>
      </button>
    </div>

    <!-- 当前时间 -->
    <span class="player__time"
      >{{ Math.floor(audioStore.currentTime / 60) }}:{{
        String(Math.floor(audioStore.currentTime % 60)).padStart(2, '0')
      }}</span
    >

    <!-- 进度条 -->
    <input
      type="range"
      class="player__range"
      min="0"
      :max="audioStore.duration || 0"
      :value="audioStore.currentTime"
      step="0.1"
      @input="handleSeek"
      :style="{
        '--range-percent': audioStore.duration
          ? (audioStore.currentTime / audioStore.duration) * 100 + '%'
          : '0%',
      }"
    />

    <!-- 时间 -->
    <!-- 总时长 -->
    <span class="player__time">
      {{ Math.floor(audioStore.duration / 60) }}:{{
        String(Math.floor(audioStore.duration % 60)).padStart(2, '0')
      }}</span
    >

    <!-- 音量 -->
    <div class="player__volume">
      <button class="player__btn" title="音量" @click="audio.toggleMute()">
        <el-icon><Headset /></el-icon>
      </button>
      <input
        type="range"
        class="player__range player__range--volume"
        min="0"
        max="1"
        step="0.01"
        :value="audioStore.isMuted ? 0 : audioStore.volume"
        @input="handleVolume"
        :style="{ '--range-percent': (audioStore.isMuted ? 0 : audioStore.volume * 100) + '%' }"
      />
    </div>

    <!-- 播放列表 -->
    <button class="player__btn" title="播放列表">
      <el-icon><Operation /></el-icon>
    </button>
  </div>
</template>

<style scoped>
/* * 播放器容器 — 透明单行 */
.audio-player {
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: 0 var(--space-xl);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* * 封面（小圆形） */
.player__art {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  overflow: hidden;
}

.player__art-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player__art-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

/* * 歌曲信息 */
.player__info {
  flex-shrink: 0;
  min-width: 0;
  max-width: 140px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.player__title {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  cursor: pointer;
}

.player__artist {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  cursor: pointer;
}

/* * 播放控制 */
.player__controls {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.player__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: var(--radius-full);
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  cursor: pointer;
  transition:
    color var(--transition-fast),
    background var(--transition-fast);
}

.player__btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
}

.player__btn--play {
  font-size: 20px;
  color: #ffffff;
}

.player__btn--play:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.15);
}

/* * 时间 */
.player__time {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.7);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  user-select: none;
}

/* * 进度条 / 音量条（range input） */
.player__range {
  -webkit-appearance: none;
  appearance: none;
  flex: 1;
  min-width: 60px;
  height: 3px;
  border-radius: var(--radius-full);
  cursor: pointer;
  outline: none;
  margin: 0;
  padding: 0;
  background: linear-gradient(
    to right,
    var(--color-primary) 0%,
    var(--color-secondary) var(--range-percent, 0%),
    rgba(255, 255, 255, 0.15) var(--range-percent, 0%)
  );
  transition: height var(--transition-fast);
}

.player__range:hover {
  height: 5px;
}

.player__range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-secondary);
  cursor: pointer;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.player__range:hover::-webkit-slider-thumb {
  opacity: 1;
}

.player__range::-moz-range-track {
  height: 3px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-full);
  border: none;
}

.player__range::-moz-range-progress {
  height: 3px;
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
  border-radius: var(--radius-full);
}

.player__range::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-secondary);
  border: none;
  cursor: pointer;
}

.player__range--volume {
  flex: none;
  width: 64px;
  min-width: 0;
}

/* * 音量 */
.player__volume {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  flex-shrink: 0;
}

/* * 响应式 */
@media (max-width: 900px) {
  .audio-player {
    gap: var(--space-sm);
    padding: 0 var(--space-lg);
  }

  .player__info {
    max-width: 100px;
  }
}

@media (max-width: 768px) {
  .player__range--volume {
    display: none;
  }
}

@media (max-width: 600px) {
  .audio-player {
    gap: var(--space-xs);
    padding: 0 var(--space-md);
  }

  .player__volume {
    display: none;
  }

  .player__info {
    max-width: 80px;
  }

  .player__btn {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }

  .player__btn--play {
    font-size: 18px;
  }
}
</style>
