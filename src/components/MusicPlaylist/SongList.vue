<script setup lang="ts">
defineProps<{
  isNull?: boolean
  header?: string[]
  activeIndex?: number
}>()
</script>

<template>
  <!-- 空状态 -->
  <div v-if="isNull" class="song-list__empty">
    <span class="song-list__empty-icon">♪</span>
    <span>暂无播放列表</span>
  </div>

  <!-- 歌曲列表 -->
  <div v-else class="song-list">
    <!-- 表头 -->
    <div v-if="header && header.length" class="song-list__header">
      <span
        v-for="(col, i) in header"
        :key="i"
        class="song-list__header-cell"
        :class="{
          'song-list__header-cell--index': i === 0,
          'song-list__header-cell--title': i === 1,
          'song-list__header-cell--artist': i >= 2 && i <= 4,
          'song-list__header-cell--action': i === 5,
          'song-list__header-cell--duration': i === 6,
        }"
      >{{ col }}</span>
    </div>

    <!-- 滚动内容区 -->
    <el-scrollbar>
      <slot :active-index="activeIndex" />
    </el-scrollbar>
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

.song-list :deep(.el-scrollbar__view) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 空状态 */
.song-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md, 12px);
  height: 100%;
  color: rgba(255, 255, 255, 0.45);
  font-size: var(--font-size-sm, 13px);
}

.song-list__empty-icon {
  font-size: 36px;
  opacity: 0.5;
}

/* 表头 */
.song-list__header {
  display: flex;
  align-items: center;
  padding: 0 var(--space-lg, 16px) var(--space-sm, 8px);
  gap: var(--space-md, 12px);
  border-bottom: 1px solid;
  border-image: linear-gradient(
      90deg,
      transparent 0%,
      var(--color-border-soft, #f3f4f6) 10%,
      var(--color-border-soft, #f3f4f6) 90%,
      transparent 100%
    )
    1;
}

.song-list__header-cell {
  font-size: var(--font-size-xs, 12px);
  color: rgba(255, 255, 255, 0.45);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.song-list__header-cell--index {
  flex-shrink: 0;
  width: 28px;
  text-align: center;
}

.song-list__header-cell--title {
  flex: 2;
  min-width: 0;
}

.song-list__header-cell--artist {
  flex: 1.5;
  min-width: 0;
}

.song-list__header-cell--action {
  flex-shrink: 0;
  width: 20px;
}

.song-list__header-cell--duration {
  flex-shrink: 0;
  min-width: 36px;
  text-align: right;
}
</style>
