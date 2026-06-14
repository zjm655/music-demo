<script setup lang="ts">
import MusicHeader from '@/components/App/MusicHeader.vue'
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
    <footer class="app-footer"></footer>
  </div>
</template>

<style scoped>
.app-header {
  margin: 0 auto;
  background: var(--gradient-page);
  border-bottom: 1.5px solid var(--color-border-soft);
  transition: background var(--transition-normal);
}
.app-main {
  width: clamp(80vw, calc(75vw + 150px), 100vw);
  margin: 0 auto;
  background: var(--gradient-xuhua);

  backdrop-filter: blur(8px);
  /* opacity: 0.5; */
}
.app-footer {
  width: 100%;
  height: clamp(240px, calc(300px + 10vh), 500px);
}
</style>
