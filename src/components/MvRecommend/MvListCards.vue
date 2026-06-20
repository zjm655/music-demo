<script setup lang="ts">
import MvCard from './MvCard.vue'
import PlaylistNav from '@/components/PlaylistHot/PlaylistNav.vue'
import PlaylistDots from '@/components/PlaylistHot/PlaylistDots.vue'
import { useCarousel } from '@/hooks/useCarousel'
import { paginate } from '@/utils/paginate'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGetSongs, type GetSongsPayload } from '@/hooks/song'
import { useGetCategories } from '@/hooks/category'
import type { CategoryItem } from '@/hooks/category'
import type { SongItem } from '@/api/song'
import { useSearchThirdpartySongs } from '@/hooks/thirdparty'

const router = useRouter()

const activeTab = ref(0)
const loading = ref(false)
const thirdpartyVidMap = ref<Record<string, string>>({})
const { fetchCategories } = useGetCategories()
const categories = ref<CategoryItem[]>([])
// 动态标签：全部 + 后端返回的分类名称
const mvTab = computed(() => ['全部', ...categories.value.map((c) => c.name)])

// 有 MV 的歌曲列表
const mvPlaylist = ref<SongItem[]>([])

// 分页：每页 6 个 MV
const pages = computed(() => paginate(mvPlaylist.value, 6))

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

// 获取有 MV 的歌曲列表
async function getSongs(payload: GetSongsPayload) {
  const request = useGetSongs()
  const res = await request.fetchSongs(payload)
  if (res?.code === 200 && res?.data) {
    mvPlaylist.value = res.data.list.filter((song) => song.mvUrl != null)
  }
}

// 搜索第三方 MV 并合并到推荐列表
async function searchMvSongs(keyword: string) {
  loading.value = true
  thirdpartyVidMap.value = {}
  const { searchThirdpartySongs } = useSearchThirdpartySongs()
  const res = await searchThirdpartySongs({ keyword, page: 1, num: 30 })
  if (res?.code === 200 && res?.data) {
    const mapped = res.data.list
      .filter((item) => item.vid)
      .map((item) => {
        thirdpartyVidMap.value[item.id] = item.vid
        return {
          id: item.id,
          mvDescription: item.song,
          mvAuthor: item.singer,
          coverUrl: item.cover,
          mvUrl: '__thirdparty__',
          duration: null,
          title: item.song,
          artist: item.singer,
          album: item.album,
          lyricist: null,
          composer: null,
          lyrics: null,
          audioUrl: null,
          category: null,
          createTime: null,
          categoryId: 0,
        }
      })
    mvPlaylist.value = [...mvPlaylist.value, ...mapped] as SongItem[]
  }
  loading.value = false
}

// 切换 tab
async function switchTab(index: number) {
  loading.value = true
  activeTab.value = index
  goToPage(0)
  const categoryId = index === 0 ? undefined : categories.value[index - 1]?.id
  await getSongs({
    page: 1,
    pageSize: 54,
    type: 'song',
    categoryId,
  })
  await searchMvSongs(categories.value[index - 1]?.description || '音乐')
  loading.value = false
}

// 组件挂载时获取分类列表和 MV 列表
onMounted(async () => {
  // 获取分类列表
  const catRes = await fetchCategories()
  if (catRes?.code === 200 && catRes?.data) {
    categories.value = catRes.data
  }
  // 获取 MV 列表（全部）
  switchTab(0)
})

// 跳转到 MV 播放页
function goToMvVideo(id: number | string, vid?: string) {
  const query: Record<string, string> = { id: String(id) }
  if (vid) query.vid = vid
  router.push({ path: '/video', query })
}
</script>

<template>
  <div class="mv-recommend">
    <div class="mv-recommend__title">
      <h2 class="mv-recommend__h2--title">MV</h2>
    </div>
    <playlist-nav
      :tabs="mvTab"
      :active-tab="activeTab"
      @tab-change="switchTab"
    />
    <div class="mv-recommend__carousel">
      <button
        class="mv-recommend__pager mv-recommend__pager--prev"
        @click="prevPage"
      >
        <span class="mv-recommend__arrow mv-recommend__arrow--left"></span>
      </button>
      <div
        v-loading="loading"
        class="mv-recommend__lists"
        ref="listsRef"
        :style="listsStyle"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div class="guijiap" v-if="loading"></div>
        <div v-else class="mv-recommend__page" v-for="(page, index) in pages" :key="index">
          <div class="mv-recommend__row">
            <div class="mv-recommend__card" v-for="song in page.slice(0, 3)" :key="song.id">
              <mv-card
                :mv-description="song.mvDescription"
                :mv-author="song.mvAuthor"
                :cover-url="song.coverUrl"
                :mv-url="song.mvUrl"
                :duration="song.duration"
                :song-id="song.id"
                :vid="thirdpartyVidMap[String(song.id)]"
                @click="goToMvVideo"
              />
            </div>
          </div>
          <div class="mv-recommend__row" v-if="page.length > 3">
            <div class="mv-recommend__card" v-for="song in page.slice(3, 6)" :key="song.id">
              <mv-card
                :mv-description="song.mvDescription"
                :mv-author="song.mvAuthor"
                :cover-url="song.coverUrl"
                :mv-url="song.mvUrl"
                :duration="song.duration"
                :song-id="song.id"
                :vid="thirdpartyVidMap[String(song.id)]"
                @click="goToMvVideo"
              />
            </div>
          </div>
        </div>
      </div>
      <button
        class="mv-recommend__pager mv-recommend__pager--next"
        @click="nextPage"
      >
        <span class="mv-recommend__arrow mv-recommend__arrow--right"></span>
      </button>
    </div>
    <playlist-dots
      :total="pages.length"
      :active-index="currentPage"
      @dot-click="goToPage"
    />
  </div>
</template>

<style scoped>
.guijiap {
  height: 400px;
}
.mv-recommend {
  overflow: hidden;
  gap: var(--space-lg);
  position: relative;
}

.mv-recommend__title {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mv-recommend__h2--title {
  letter-spacing: 10px;
}

.mv-recommend__carousel {
  position: relative;
  overflow: hidden;
}

.mv-recommend__lists {
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
}

.mv-recommend__page {
  width: clamp(80vw, calc(75vw + 150px), 100vw);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.mv-recommend__row {
  display: flex;
  gap: var(--space-lg);
  justify-content: center;
}

.mv-recommend__card {
  width: 30%;
}

/* Pager buttons */
.mv-recommend__pager {
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

.mv-recommend:hover .mv-recommend__pager {
  opacity: 1;
}

.mv-recommend__pager--prev {
  left: var(--space-sm);
}

.mv-recommend__pager--next {
  right: var(--space-sm);
}

.mv-recommend__pager:hover {
  background: rgba(255, 255, 255, 0.9);
}

/* Arrow icons using CSS border trick */
.mv-recommend__arrow {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-top: 2px solid var(--color-primary);
  border-left: 2px solid var(--color-primary);
}

.mv-recommend__arrow--left {
  transform: rotate(-45deg);
  margin-left: 3px;
}

.mv-recommend__arrow--right {
  transform: rotate(135deg);
  margin-right: 3px;
}
</style>
