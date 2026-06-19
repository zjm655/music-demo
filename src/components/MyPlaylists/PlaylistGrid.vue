<script setup lang="ts">
import { FolderOpened } from '@element-plus/icons-vue'

interface Props {
  isNull?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isNull: false,
})
</script>

<template>
  <div v-if="props.isNull" class="playlist-grid-empty">
    <el-icon :size="48" color="var(--color-text-muted, #9ca3af)">
      <FolderOpened />
    </el-icon>
    <span class="playlist-grid-empty__text">暂无歌单</span>
  </div>
  <el-scrollbar v-else class="playlist-grid-scroll">
    <div class="playlist-grid">
      <slot />
    </div>
  </el-scrollbar>
</template>

<style scoped>
.playlist-grid-scroll {
  height: calc(100vh - 200px);
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: var(--space-lg, 16px);
}

.playlist-grid-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md, 12px);
  padding: 80px 0;
}

.playlist-grid-empty__text {
  font-size: var(--font-size-sm, 13px);
  color: var(--color-text-muted, #9ca3af);
}
</style>
