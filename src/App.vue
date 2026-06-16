<script setup lang="ts">
import MusicHeader from '@/components/App/MusicHeader.vue'
import AudioPlayer from './components/MediaPlayer/AudioPlayer.vue'
import { useThemeStore } from './stores/theme'
import { computed } from 'vue'
const appStyle = computed(() => ({
  backgroundImage: `url(${useThemeStore().currentBackground})`,
}))
</script>

<template>
  <div class="app" :style="appStyle">
    <header class="app-header">
      <music-header />
    </header>
    <main class="app-main">
      <router-view />
    </main>
    <footer class="app-footer">
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
