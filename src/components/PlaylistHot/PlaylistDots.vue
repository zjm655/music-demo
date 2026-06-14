<script setup lang="ts">
import PlaylistSpot from './PlaylistSpot.vue'

defineProps<{
  total: number
  activeIndex: number
}>()

const emit = defineEmits<{
  'dot-click': [index: number]
}>()
</script>

<template>
  <div class="playlist-hot__spots">
    <PlaylistSpot
      v-for="index in total"
      :key="index - 1"
      :active="index - 1 === activeIndex"
      @click="emit('dot-click', index - 1)"
    />
  </div>
</template>

<style scoped>
.playlist-hot__spots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
  margin-bottom: 15px;
}
</style>
