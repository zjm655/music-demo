<script setup lang="ts">import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import SongList from '@/components/MusicPlaylist/SongList.vue';
import SongCard from '@/components/MusicRecommend/SongCard.vue';
import { useSearchUnified } from '@/hooks/common';
import { useAudio } from '@/hooks/media';
import type { UnifiedSearchResult } from '@/hooks/common';
const route = useRoute();
const { search, isLoading } = useSearchUnified();
const audio = useAudio();
const keyword = ref('');
const searchResults = ref<UnifiedSearchResult[]>([]);
const header = ['#', '', '', '', '', '', ''];
const handleSearch = async () => {
 if (!keyword.value.trim())
 return;
 const result = await search({
 keyword: keyword.value,
 page: 1,
 pageSize: 35,
 });
 if (result.code === 200 && result.data) {
 searchResults.value = result.data.list;
 }
};
const handlePlay = (id: number | string) => {
  const song = searchResults.value.find((s) => s.id === id)
  audio.addNextAndPlay(id, {
    title: song?.title,
    artist: song?.artist ?? undefined,
    album: song?.album ?? undefined,
    duration: song?.duration,
    coverUrl: song?.coverUrl,
    vid: song?.vid ?? undefined,
  })
}
const handleAddNext = (id: number | string) => {
  const song = searchResults.value.find((s) => s.id === id)
  audio.addNext(id, {
    title: song?.title,
    artist: song?.artist ?? undefined,
    album: song?.album ?? undefined,
    duration: song?.duration,
    coverUrl: song?.coverUrl,
    vid: song?.vid ?? undefined,
  })
}
onMounted(() => {
 const urlKeyword = route.query.keyword as string;
 if (urlKeyword) {
 keyword.value = urlKeyword;
 handleSearch();
 }
});
watch(() => route.query.keyword, (newKeyword) => {
 if (newKeyword) {
 keyword.value = String(newKeyword);
 handleSearch();
 }
});
</script>

<template>
  <div class="audio-search">
    <div class="search-header">
      <div class="search-input-wrapper">
        <el-input
          v-model="keyword"
          placeholder="搜索歌曲..."
          @keyup.enter="handleSearch"
          class="search-input"
        />
        <el-button @click="handleSearch" :loading="isLoading" class="search-btn">
          搜索
        </el-button>
      </div>
    </div>

    <SongList :is-null="searchResults.length === 0" :header="header">
      <template #default>
        <SongCard
          v-for="(song, index) in searchResults"
          :key="`${song.source}-${song.id}`"
          :id="song.id"
          :title="song.title"
          :artist="song.artist"
          :album="song.album"
          :lyricist="song.lyricist ?? null"
          :composer="song.composer ?? null"
          :lyrics="song.lyrics ?? null"
          :cover-url="song.coverUrl"
          :audio-url="song.audioUrl"
          :mv-url="song.mvUrl ?? null"
          :mv-description="song.mvDescription ?? null"
          :mv-author="song.mvAuthor ?? null"
          :category="song.category ?? null"
          :category-id="song.categoryId ?? null"
          :create-time="null"
          :index="index + 1"
          @click="handlePlay"
          @add-next-click="handleAddNext"
        />
      </template>
    </SongList>
  </div>
</template>

<style scoped>
.audio-search {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-header {
  padding: var(--space-lg, 16px);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.search-input-wrapper {
  display: flex;
  gap: var(--space-sm, 8px);
  max-width: 400px;
}

.search-input {
  flex: 1;
}

.search-btn {
  flex-shrink: 0;
}
</style>