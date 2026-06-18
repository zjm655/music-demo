<script setup lang="ts">
import MusicRecommendCard from './MusicRecommendCard.vue'
import PlaylistNav from '@/components/PlaylistHot/PlaylistNav.vue'
import PlaylistDots from '@/components/PlaylistHot/PlaylistDots.vue'
import { useCarousel } from '@/hooks/useCarousel'
import { ref, computed } from 'vue'
import { paginate } from '@/utils/paginate'
import { useGetSongs, type GetSongsPayload, type GetSongsResPayload } from '@/hooks/song'

const activeTab = ref(0)
const musicTab = ['最新', '内地', '港台', '欧美', '韩国', '日本']
// const pages = reactive([1, 2, 3, 4, 5, 6])
const playlist = ref<GetSongsResPayload>({
  list: [],
  total: 1,
  page: 1,
  pageSize: 1,
})

const pages = computed(() => {
  return paginate(playlist.value.list, 9)
})
const {
  currentPage,
  listsRef,
  listsStyle,
  prevPage,
  nextPage,
  goToPage,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
} = useCarousel({ totalPages: computed(() => pages.value.length) })

function switchTab(index: number) {
  activeTab.value = index
}

async function getSongs(payload: GetSongsPayload) {
  const request = useGetSongs()
  const res = await request.fetchSongs(payload)
  if (res?.code === 200 && res?.data != undefined) {
    playlist.value = res?.data
  }
}

getSongs({
  page: 1,
  pageSize: 54,
  type: 'song',
})
</script>

<template>
  <div class="music-recommend">
    <!-- 标题 -->
    <div class="music-recommend__title">
      <h2 class="music-recommend__h2--title">歌曲推荐</h2>
    </div>
    <!-- 导航 -->
    <playlist-nav :tabs="musicTab" :active-tab="activeTab" @tab-change="switchTab" />
    <!-- 左边的翻页器 -->
    <div class="music-recommend__carousel">
      <button class="music-recommend__pager music-recommend__pager--prev" @click="prevPage">
        <span class="music-recommend__arrow music-recommend__arrow--left"></span>
      </button>
      <!-- 歌曲列表 -->
      <div
        class="music-recommend__lists"
        ref="listsRef"
        :style="listsStyle"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <!-- 外部的大卡片，一个大卡片9个小卡片，3 X 3布局 -->
        <div class="music-recommend__page" v-for="(page, index) in pages" :key="index">
          <music-recommend-card :page-index="playlist.page" :size="9" :songs="page" />
        </div>
      </div>
      <button class="music-recommend__pager music-recommend__pager--next" @click="nextPage">
        <span class="music-recommend__arrow music-recommend__arrow--right"></span>
      </button>
    </div>
    <playlist-dots :total="pages.length" :active-index="currentPage" @dot-click="goToPage" />
  </div>
</template>

<style scoped>
.music-recommend {
  overflow: hidden;
  gap: var(--space-lg, 16px);
  position: relative;
}

.music-recommend__title {
  display: flex;
  justify-content: center;
  align-items: center;
}

.music-recommend__h2--title {
  letter-spacing: 10px;
}

.music-recommend__carousel {
  position: relative;
  overflow: hidden;
}

.music-recommend__page {
  width: clamp(80vw, calc(75vw + 150px), 100vw);
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}

.music-recommend__lists {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}

.music-recommend__pager {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.music-recommend:hover .music-recommend__pager {
  opacity: 1;
}

.music-recommend__pager--prev {
  left: var(--space-sm);
}

.music-recommend__pager--next {
  right: var(--space-sm);
}

.music-recommend__pager:hover {
  background: rgba(255, 255, 255, 0.9);
}

.music-recommend__arrow {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-top: 2px solid var(--color-primary);
  border-left: 2px solid var(--color-primary);
}

.music-recommend__arrow--left {
  transform: rotate(-45deg);
  margin-left: 3px;
}

.music-recommend__arrow--right {
  transform: rotate(135deg);
  margin-right: 3px;
}
</style>
