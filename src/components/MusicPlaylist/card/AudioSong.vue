<script setup lang="ts">
import { MoreFilled } from '@element-plus/icons-vue'

interface Props {
  id: number | string
  title: string
  artist?: string | null
  lyricist?: string | null
  composer?: string | null
  duration?: number | null
  active?: boolean
  index?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '未知歌曲',
  artist: null,
  lyricist: null,
  composer: null,
  duration: null,
  active: false,
  index: undefined,
})

const emit = defineEmits<{
  select: []
}>()

function formatDuration(seconds: number | null): string {
  if (typeof seconds !== 'number' || seconds <= 0) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <div
    class="audio-song"
    :class="{ 'audio-song--active': props.active }"
    @click="emit('select')"
  >
    <span class="audio-song__index">{{ props.index ?? '' }}</span>
    <span class="audio-song__title">{{ props.title }}</span>
    <span class="audio-song__artist">{{ props.artist || '' }}</span>
    <span class="audio-song__sep">{{ props.artist && (props.lyricist || props.composer) ? '·' : '' }}</span>
    <span class="audio-song__artist">{{ props.lyricist || '' }}</span>
    <span class="audio-song__sep">{{ props.lyricist && props.composer ? '·' : '' }}</span>
    <span class="audio-song__artist">{{ props.composer || '' }}</span>
    <el-icon class="audio-song__action" :size="16" @click.stop>
      <MoreFilled />
    </el-icon>
    <span class="audio-song__duration">{{ formatDuration(props.duration) }}</span>
  </div>
</template>

<style scoped>
.audio-song {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md, 12px);
  padding: 10px var(--space-lg, 16px);
  cursor: pointer;
}

.audio-song:hover {
  background: rgba(139, 92, 246, 0.08);
  transform: scaleX(1.004);
}

.audio-song--active {
  background: rgba(139, 92, 246, 0.2);
  box-shadow:
    0 0 16px rgba(139, 92, 246, 0.12),
    inset 0 0 0 1px rgba(139, 92, 246, 0.08);
}

.audio-song--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: linear-gradient(180deg, var(--color-primary, #8b5cf6), var(--color-secondary, #ec4899));
}

.audio-song--active .audio-song__title {
  color: var(--color-secondary-hover);
}

/* 序号 */
.audio-song__index {
  flex-shrink: 0;
  width: 28px;
  text-align: center;
  font-size: var(--font-size-xs, 12px);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  font-variant-numeric: tabular-nums;
}

/* 歌曲名 */
.audio-song__title {
  flex: 2;
  min-width: 0;
  font-size: var(--font-size-sm, 13px);
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 歌手 */
.audio-song__artist {
  flex: 1.5;
  min-width: 0;
  font-size: var(--font-size-xs, 12px);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.903);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 分隔符 */
.audio-song__sep {
  flex-shrink: 0;
  font-size: var(--font-size-xs, 12px);
  color: rgba(255, 255, 255, 0.4);
}

/* 操作按钮 */
.audio-song__action {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  opacity: 0;
  transition:
    opacity var(--transition-fast, 0.15s),
    color var(--transition-fast, 0.15s);
}

.audio-song:hover .audio-song__action {
  opacity: 1;
}

.audio-song__action:hover {
  color: var(--color-primary, #8b5cf6);
}

/* 时长 */
.audio-song__duration {
  flex-shrink: 0;
  font-size: var(--font-size-xs, 12px);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  font-variant-numeric: tabular-nums;
  min-width: 36px;
  text-align: right;
}
</style>
