<script setup lang="ts">
defineProps<{
  active?: boolean
}>()
</script>

<template>
  <div class="playlist-spot-main" :class="{ 'playlist-spot-main--active': active }"></div>
</template>

<style scoped>
.playlist-spot-main {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background-color: var(--color-border-strong, #d1d5db);
  cursor: pointer;
  transition: all var(--transition-normal);
}
.playlist-spot-main--active {
  background-color: var(--color-primary);
  width: 20px;
  border-radius: var(--radius-full);
}
</style>
