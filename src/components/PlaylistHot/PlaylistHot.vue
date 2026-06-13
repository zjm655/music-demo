<script setup lang="ts">
import PlaylistCard from './PlaylistCard.vue'
import PlaylistSpot from './PlaylistSpot.vue'
import { ref, reactive } from 'vue'
const activeTab = ref(0)
const activeSpot = ref(0)
const playlistTab = ['为你推荐', '官方歌单', '情歌', '网络歌曲', '经典', 'KTV热歌']
const cards = reactive([1, 2, 3, 4, 5])
const lists = reactive([1, 2, 3, 4, 5])
function switchTab(index: number) {
  activeTab.value = index
}
</script>

<template>
  <div class="playlist-hot">
    <div class="playlist-hot__title">
      <h2 class="playlist-hot__h2--title">热门歌单</h2>
    </div>
    <nav class="playlist-hot-nav">
      <span
        class="playlist-hot-nav__tab"
        v-for="(tab, index) in playlistTab"
        :key="index"
        :class="{ 'playlist-hot-nav__tab--active': activeTab === Number(index) }"
        @click="switchTab(Number(index))"
        >{{ tab }}
      </span>
    </nav>
    <div class="platlist-hot__lists">
      <div class="playlist-hot__list" v-for="(list, index) in lists" :key="index">
        <div class="playlist-hot__card" v-for="(card, index) in cards" :key="index">
          <playlist-card />
        </div>
      </div>
    </div>
    <div class="playlist-hot__spots">
      <playlist-spot
        class="playlist-hot__spot"
        v-for="(list, index) in lists"
        :key="index"
        :class="{ '.playlist-spot-main--active': activeSpot === Number(index) }"
      />
    </div>
  </div>
</template>

<style scoped>
.playlist-hot {
  /* height: calc(0.8 * clamp(80vw, 75vw + 150px, 100vw)); */
  overflow: hidden;
  gap: 10px;
}

.playlist-hot__title {
  display: flex;
  justify-content: center;
  align-items: center;
}

.playlist-hot__h2--title {
  letter-spacing: 10px;
}

.playlist-hot-nav {
  display: flex;
  justify-content: center;
}

.playlist-hot-nav__tab {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  margin-left: clamp(10px, calc(4%), 50px);
}

.playlist-hot-nav__tab--active {
  color: var(--color-secondary-hover);
}

.playlist-hot__card {
  width: 18%;
}

.playlist-hot__list {
  display: flex;
  gap: 10px;
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

.playlist-hot__spots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
