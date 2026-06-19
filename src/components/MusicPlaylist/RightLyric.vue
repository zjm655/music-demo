<script setup lang="ts">
import LyricTop from './Lyric/LyricTop.vue'
import LyricContent from './Lyric/LyricContent.vue'
</script>

<template>
  <div class="Lyric-main">
    <div class="Lyric-main-top">
      <lyric-top />
    </div>
    <div class="Lyric-main-bottom">
      <lyric-content />
    </div>
  </div>
</template>

<style scoped>
.Lyric-main {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.Lyric-main-top {
  flex: 0.2;
}
.Lyric-main-bottom {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
