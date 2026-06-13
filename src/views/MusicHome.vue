<script setup lang="ts">
import HomeHeader from '@/components/MusicHome/HomeHeader.vue'
import HomeFooter from '@/components/MusicHome/HomeFooter.vue'
import PlaylistHot from '@/components/PlaylistHot/PlaylistHot.vue'
import MusicListCards from '@/components/MusicRecommend/MusicListCards.vue'
import MvListCards from '@/components/MvRecommend/MvListCards.vue'
</script>

<template>
  <home-header />
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
  gap: 30px;
  margin-top: 50px;
}
</style>
