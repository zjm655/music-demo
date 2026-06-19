<script setup lang="ts">
import { MoreFilled } from '@element-plus/icons-vue'
import { VideoCamera } from '@element-plus/icons-vue'
import { useAudio } from '@/hooks/media'
import { useRouter } from 'vue-router'

interface Props {
  id: number | string
  title: string
  artist?: string | null
  lyricist?: string | null
  composer?: string | null
  duration?: number | null
  mvUrl?: string | null
  vid?: string | null
  source?: string
  active?: boolean
  index?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '未知歌曲',
  artist: null,
  lyricist: null,
  composer: null,
  duration: null,
  mvUrl: null,
  vid: null,
  source: 'local',
  active: false,
  index: undefined,
})

const audio = useAudio()
const router = useRouter()

function handleMvClick(e: Event) {
  e.stopPropagation()
  const query: Record<string, string> = { id: String(props.id) }
  if (props.vid) query.vid = props.vid
  router.push({ path: '/video', query })
}

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
    @click="audio.loadById(props.id)"
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
    <button
      v-if="props.mvUrl || props.vid"
      class="audio-song__mv"
      title="播放 MV"
      @click="handleMvClick"
    >
      <el-icon :size="12"><VideoCamera /></el-icon>
      <span>MV</span>
    </button>
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

/* MV 标识 */
.audio-song__mv {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 1px 5px;
  border: none;
  border-radius: var(--radius-xs, 3px);
  background: rgba(0, 0, 0, 0.5);
  color: #fbbf24;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: background var(--transition-fast, 0.15s);
}

.audio-song__mv:hover {
  background: rgba(0, 0, 0, 0.75);
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
