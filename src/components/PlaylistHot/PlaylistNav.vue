<script setup lang="ts">
defineProps<{
  tabs: string[]
  activeTab: number
}>()

const emit = defineEmits<{
  'tab-change': [index: number]
}>()
</script>

<template>
  <nav class="playlist-hot-nav">
    <span
      v-for="(tab, index) in tabs"
      :key="index"
      class="playlist-hot-nav__tab"
      :class="{ 'playlist-hot-nav__tab--active': index === activeTab }"
      @click="emit('tab-change', index)"
      >{{ tab }}</span
    >
  </nav>
</template>

<style scoped>
.playlist-hot-nav {
  display: flex;
  justify-content: center;
  margin: 15px 0;
}

.playlist-hot-nav__tab {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  margin-left: clamp(10px, calc(4%), 50px);
  transition: color var(--transition-fast);
}

.playlist-hot-nav__tab:first-child {
  margin-left: 0;
}

.playlist-hot-nav__tab:hover {
  color: var(--color-primary);
}

.playlist-hot-nav__tab--active {
  color: var(--color-secondary-hover);
}
</style>
