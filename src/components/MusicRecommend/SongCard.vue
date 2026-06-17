<script setup lang="ts">
interface Props {
  id: string
  title: string
  artist: string | null
  album: string | null
  duration: number | null
  lyricist: string | null
  composer: string | null
  lyrics: string | null
  audioUrl: string | null
  mvUrl: string | null
  mvDescription: string | null
  mvAuthor: string | null
  category: string | null
  coverUrl: string | null
  createTime: string
  categoryId: number | null
}

const props = withDefaults(defineProps<Props>(), {
  title: '歌曲名称',
  lyricist: '未知作词',
  composer: '未知作曲',
  coverUrl: '/favicon.ico',
  audioUrl: '',
  category: '未分类',
})
</script>

<template>
  <div class="song-card">
    <div class="song-cover-wrapper">
      <el-image class="song-cover" :src="props.coverUrl" fit="cover" />
      <div class="song-cover-overlay">
        <span class="song-play-icon"></span>
      </div>
    </div>

    <div class="song-info">
      <span class="song-name" :title="props.title || '未知'">{{ props.title }}</span>
      <span
        class="song-artist"
        :title="props.artist || props.lyricist || props.composer || props.mvAuthor || '未知'"
        >{{ props.artist || props.lyricist || props.composer || props.mvAuthor }}</span
      >
    </div>

    <span class="song-duration">{{}}</span>
  </div>
</template>

<style scoped>
.song-card {
  display: flex;
  align-items: center;
  gap: var(--space-sm, 8px);
  padding: var(--space-md, 12px) var(--space-md, 12px);
  cursor: pointer;
  transition: background var(--transition-fast, 0.15s);
}

.song-card:hover {
  background: var(--color-bg-hover, #f3e8ff);
}

.song-cover-wrapper {
  position: relative;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm, 6px);
  overflow: hidden;
}

.song-cover {
  width: 100%;
  height: 100%;
}

.song-cover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity var(--transition-fast, 0.15s);
  border-radius: var(--radius-sm, 6px);
}

.song-cover-wrapper:hover .song-cover-overlay {
  opacity: 1;
}

.song-play-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
}

.song-play-icon::after {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 0 5px 8px;
  border-color: transparent transparent transparent #333;
  margin-left: 2px;
}

.song-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs, 4px);
}

.song-name {
  font-size: var(--font-size-sm, 13px);
  color: var(--color-text-primary, #1f2937);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  transition: color var(--transition-fast, 0.15s);
}

.song-card:hover .song-name {
  color: var(--color-primary, #8b5cf6);
}

.song-artist {
  font-size: var(--font-size-xs, 12px);
  color: var(--color-text-secondary, #6b7280);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.song-duration {
  flex-shrink: 0;
  font-size: var(--font-size-xs, 12px);
  color: var(--color-text-muted, #9ca3af);
  margin-left: auto;
}
</style>
