<script setup lang="ts">
import HomeFooter from '@/components/MusicHome/HomeFooter.vue'
import PlaylistHot from '@/components/PlaylistHot/PlaylistHot.vue'
import MusicListCards from '@/components/MusicRecommend/MusicListCards.vue'
import MvListCards from '@/components/MvRecommend/MvListCards.vue'
</script>

<template>
  <div class="home-main">
    <playlist-hot />
    <music-list-cards />
    <mv-list-cards />
  </div>
  <home-footer />
</template>

<style scoped>
.home-main {
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding-top: 30px;
  width: clamp(80vw, calc(75vw + 150px), 100vw);
  margin: 0 auto;
  background: var(--gradient-xuhua);
  backdrop-filter: blur(8px);
}
</style>
