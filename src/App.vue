<script setup lang="ts">
import MusicHeader from '@/components/App/MusicHeader.vue'
import AudioPlayer from './components/MediaPlayer/AudioPlayer.vue'
import { useAudioStore } from './stores/audio'
import { useThemeStore } from './stores/theme'
import { useUserStore } from './stores/user'
import { useGetUserProfile } from './hooks/user'
import { computed, onMounted } from 'vue'

const appStyle = computed(() => ({
  backgroundImage: `url(${useThemeStore().currentBackground})`,
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
