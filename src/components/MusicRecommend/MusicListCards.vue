<script setup lang="ts">
import MusicRecommendCard from './MusicRecommendCard.vue'
import PlaylistNav from '@/components/PlaylistHot/PlaylistNav.vue'
import PlaylistDots from '@/components/PlaylistHot/PlaylistDots.vue'
import { useCarousel } from '@/hooks/useCarousel'
import { ref, computed, onMounted } from 'vue'
import { paginate } from '@/utils/paginate'
import { useGetSongs, type GetSongsPayload, type GetSongsResPayload } from '@/hooks/song'
import { useGetCategories } from '@/hooks/category'
import type { CategoryItem } from '@/hooks/category'
import { useSearchThirdpartySongs } from '@/hooks/thirdparty'
import type { ThirdpartyMeta } from '@/hooks/common/useGetSongUnified'

const activeTab = ref(0)
const loading = ref(false)
const thirdpartyMetaMap = ref<Record<string, ThirdpartyMeta>>({})
const { fetchCategories } = useGetCategories()
const categories = ref<CategoryItem[]>([])
// 动态标签：全部 + 后端返回的分类名称
const musicTab = computed(() => ['全部', ...categories.value.map((c) => c.name)])

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

async function switchTab(index: number) {
  loading.value = true
  activeTab.value = index
  const categoryId = index === 0 ? undefined : categories.value[index - 1]?.id
  await getSongs({
    page: 1,
    pageSize: 54,
    type: 'song',
    categoryId,
  })
  await searchSongs(categories.value[index - 1]?.description || '音乐')
  loading.value = false

}

// 获取歌曲列表
async function getSongs(payload: GetSongsPayload) {
  loading.value = true
    const request = useGetSongs()
    const res = await request.fetchSongs(payload)
    if (res?.code === 200 && res?.data != undefined) {
      playlist.value = res?.data
    }
}
// 搜索第三方歌曲并合并到推荐列表
async function searchSongs(keyword: string) {
  thirdpartyMetaMap.value = {}
  const { searchThirdpartySongs } = useSearchThirdpartySongs()
  const res = await searchThirdpartySongs({ keyword, page: 1, num: 30 })
  if (res?.code === 200 && res?.data) {
    const mapped = res.data.list.map((item) => {
      thirdpartyMetaMap.value[item.id] = {
        title: item.song,
        artist: item.singer,
        album: item.album,
        coverUrl: item.cover,
        vid: item.vid,
      }
      return {
        id: item.id,
        title: item.song,
        artist: item.singer,
        album: item.album,
        coverUrl: item.cover,
        vid: item.vid,
        duration: null,
        lyricist: null,
        composer: null,
        lyrics: null,
        audioUrl: null,
        mvUrl: null,
        mvDescription: null,
        mvAuthor: null,
        category: null,
        createTime: null,
        categoryId: 0,
      }
    })
    playlist.value = {
      ...playlist.value,
      list: [...playlist.value.list, ...mapped] as GetSongsResPayload['list'],
      total: playlist.value.total + res.data.total,
    }
  }
}

// 组件挂载时获取分类列表和歌曲列表
onMounted(async () => {
  // 获取分类列表
  loading.value = true
  const catRes = await fetchCategories()
  if (catRes?.code === 200 && catRes?.data) {
    categories.value = catRes.data
  }

  // 获取歌曲列表
  await getSongs({
    page: 1,
    pageSize: 54,
    type: 'song',
  })

  await searchSongs('音乐')
  loading.value = false

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
        v-loading="loading"
        class="music-recommend__lists"
        ref="listsRef"
        :style="listsStyle"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div class="gujiaping" v-if="loading"></div>
        <!-- 外部的大卡片，一个大卡片9个小卡片，3 X 3布局 -->
        <div v-else class="music-recommend__page" v-for="(page, index) in pages" :key="index">
          <music-recommend-card :page-index="playlist.page" :size="9" :songs="page" :thirdparty-meta-map="thirdpartyMetaMap" />
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
.gujiaping {
  height: 220px;
}
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
