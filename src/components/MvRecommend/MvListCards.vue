<script setup lang="ts">
import MvCard from './MvCard.vue'
import PlaylistNav from '@/components/PlaylistHot/PlaylistNav.vue'
import PlaylistDots from '@/components/PlaylistHot/PlaylistDots.vue'
import { useCarousel } from '@/hooks/useCarousel'
import { ref, reactive } from 'vue'

const activeTab = ref(0)
const mvTab = ['最新', '内地', '港台', '欧美', '韩国', '日本']
const pages = reactive([1, 2, 3, 4, 5, 6])

const { currentPage, listsRef, listsStyle, prevPage, nextPage, goToPage, onTouchStart, onTouchMove, onTouchEnd } = useCarousel({ totalPages: pages.length })

function switchTab(index: number) {
  activeTab.value = index
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
        class="mv-recommend__lists"
        ref="listsRef"
        :style="listsStyle"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div class="mv-recommend__page" v-for="(page, index) in pages" :key="index">
          <div class="mv-recommend__row">
            <div class="mv-recommend__card">
              <mv-card />
            </div>
            <div class="mv-recommend__card">
              <mv-card name="退潮" artist="南征北战NZBZ" :play-count="7281" />
            </div>
            <div class="mv-recommend__card">
              <mv-card name="I Knew It, I Knew You" artist="Taylor Swift" :play-count="65000" />
            </div>
          </div>
          <div class="mv-recommend__row">
            <div class="mv-recommend__card">
              <mv-card name="BIRTHDAY" artist="Faouzia" :play-count="5869" />
            </div>
            <div class="mv-recommend__card">
              <mv-card name="粉钻" artist="戚薇" :play-count="14000" />
            </div>
            <div class="mv-recommend__card">
              <mv-card name="常常因为夕阳好美而得救" artist="蒋敦豪" :play-count="18000" />
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
