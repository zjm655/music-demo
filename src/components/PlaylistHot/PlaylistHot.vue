<script setup lang="ts">
import PlaylistCard from './PlaylistCard.vue'
import PlaylistNav from './PlaylistNav.vue'
import PlaylistDots from './PlaylistDots.vue'
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

const activeTab = ref(0)
const currentPage = ref(0)
const containerWidth = ref(0)
const playlistTab = ['为你推荐', '官方歌单', '情歌', '网络歌曲', '经典', 'KTV热歌']
const cards = reactive([1, 2, 3, 4, 5])
const lists = reactive([1, 2, 3, 4, 5])

const listsRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

const translateX = computed(() => -currentPage.value * containerWidth.value)

const listsStyle = computed(() => ({
  transform: `translateX(${translateX.value}px)`,
  transition: 'transform 0.4s ease',
}))

function switchTab(index: number) {
  activeTab.value = index
}

function goToPage(index: number) {
  currentPage.value = index
}

function prevPage() {
  currentPage.value = (currentPage.value - 1 + lists.length) % lists.length
}

function nextPage() {
  currentPage.value = (currentPage.value + 1) % lists.length
}

onMounted(() => {
  if (listsRef.value) {
    containerWidth.value = listsRef.value.offsetWidth
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerWidth.value = entry.contentRect.width
      }
    })
    resizeObserver.observe(listsRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<template>
  <div class="playlist-hot">
    <div class="playlist-hot__title">
      <h2 class="playlist-hot__h2--title">热门歌单</h2>
    </div>
    <playlist-nav
      :tabs="playlistTab"
      :active-tab="activeTab"
      @tab-change="switchTab"
    />
    <div class="playlist-hot__carousel">
      <button
        class="playlist-hot__pager playlist-hot__pager--prev"
        @click="prevPage"
      >
        <span class="playlist-hot__arrow playlist-hot__arrow--left"></span>
      </button>
      <div class="platlist-hot__lists" ref="listsRef" :style="listsStyle">
        <div class="playlist-hot__list" v-for="(list, index) in lists" :key="index">
          <div class="playlist-hot__card" v-for="(card, index) in cards" :key="index">
            <playlist-card />
          </div>
        </div>
      </div>
      <button
        class="playlist-hot__pager playlist-hot__pager--next"
        @click="nextPage"
      >
        <span class="playlist-hot__arrow playlist-hot__arrow--right"></span>
      </button>
    </div>
    <playlist-dots
      :total="lists.length"
      :active-index="currentPage"
      @dot-click="goToPage"
    />
  </div>
</template>

<style scoped>
.playlist-hot {
  overflow: hidden;
  gap: var(--space-md);
  position: relative;
}

.playlist-hot__title {
  display: flex;
  justify-content: center;
  align-items: center;
}

.playlist-hot__h2--title {
  letter-spacing: 10px;
}

.playlist-hot__carousel {
  position: relative;
  overflow: hidden;
}

.playlist-hot__card {
  width: 17%;
}

.playlist-hot__list {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  align-items: center;
  width: clamp(80vw, calc(75vw + 150px), 100vw);
  flex-shrink: 0;
}

.platlist-hot__lists {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}

/* Pager buttons */
.playlist-hot__pager {
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

.playlist-hot:hover .playlist-hot__pager {
  opacity: 1;
}

.playlist-hot__pager--prev {
  left: var(--space-sm);
}

.playlist-hot__pager--next {
  right: var(--space-sm);
}

.playlist-hot__pager:hover {
  background: rgba(255, 255, 255, 0.9);
}

/* Arrow icons using CSS border trick */
.playlist-hot__arrow {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-top: 2px solid var(--color-primary);
  border-left: 2px solid var(--color-primary);
}

.playlist-hot__arrow--left {
  transform: rotate(-45deg);
  margin-left: 3px;
}

.playlist-hot__arrow--right {
  transform: rotate(135deg);
  margin-right: 3px;
}
</style>
