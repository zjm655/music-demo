<script setup lang="ts">
import MusicHeader from '@/components/App/MusicHeader.vue'
import AudioPlayer from './components/MediaPlayer/AudioPlayer.vue'
import { useAudioStore } from './stores/audio'
import { useThemeStore } from './stores/theme'
import { useUserStore } from './stores/user'
import { useGetUserProfile } from './hooks/user'
import { computed, onMounted } from 'vue'

const appStyle = computed(() => ({
  backgroundImage: `url(${useThemeStore().currentBackground}) `,
}))

// 启动时验证 token 并获取用户信息
onMounted(async () => {
  if (localStorage.getItem('token')) {
    const { fetchUserProfile } = useGetUserProfile()
    const res = await fetchUserProfile()
    if (res?.code === 200 && res.data) {
      const userStore = useUserStore()
      userStore.loadUserInfo(res.data)
      userStore.isLogin = true
    } else {
      localStorage.setItem('token', '')
    }
    // 失败静默处理，不弹提示
  }
})
</script>

<template>
  <div class="app" :style="appStyle">
    <header class="app-header">
      <music-header />
    </header>
    <main class="app-main">
      <router-view />
    </main>
    <footer class="app-footer" v-if="useAudioStore().showPlaylist">
      <audio-player />
    </footer>
  </div>
</template>

<style scoped>
.app {
  /* width: 100vw; */
  background-size: 100vw auto;
  min-height: 100vh;
  background-attachment: fixed;
}
.app-header {
  margin: 0 auto;
  background: var(--gradient-page);
  border-bottom: 1.5px solid var(--color-border-soft);
  transition: background var(--transition-normal);
}
/* .app-main {
  width: clamp(80vw, calc(75vw + 150px), 100vw);
  margin: 0 auto;
  background: var(--gradient-xuhua);
  backdrop-filter: blur(8px);
} */
.app-footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  background: inherit;
}
</style>

<style>
/* Element Plus 弹窗主题覆盖（非 scoped，运行时注入，确保在 el 按需 CSS 之后） */
.el-dialog {
  background-color: var(--color-bg-elevated) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: var(--radius-lg) !important;
  box-shadow: var(--shadow-lg) !important;
  overflow: hidden;
}
.el-dialog__header {
  border-bottom: 1px solid var(--color-border-soft);
  margin-right: 0 !important;
  padding: 16px 24px !important;
}
.el-dialog__title {
  color: var(--color-text-primary) !important;
  font-weight: 600;
}
.el-dialog__headerbtn .el-dialog__close {
  color: var(--color-text-muted) !important;
}
.el-dialog__headerbtn:hover .el-dialog__close {
  color: var(--color-primary) !important;
}
.el-dialog__body {
  color: var(--color-text-primary) !important;
  padding: 24px !important;
}
.el-dialog__footer {
  border-top: 1px solid var(--color-border-soft);
  padding: 16px 24px !important;
}
.el-overlay {
  background: rgba(0, 0, 0, 0.45) !important;
  backdrop-filter: blur(4px);
}

/* Element Plus v-loading 主题覆盖 */
.el-loading-mask {
  background-color: rgba(15, 10, 31, 0.35) !important;
}
.el-loading-spinner .path {
  stroke: var(--color-primary) !important;
}
.el-loading-spinner .el-loading-text {
  color: var(--color-primary) !important;
}
</style>
