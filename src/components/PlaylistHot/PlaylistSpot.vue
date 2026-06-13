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
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ccc;
  cursor: pointer;
  transition: all var(--transition-normal);
}
.playlist-spot-main--active {
  background-color: var(--color-primary);
  width: 14px;
  height: 14px;
}
</style>
