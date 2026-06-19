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
  align-items: center;
  gap: var(--space-xs, 8px);
  max-width: 400px;
}

.search-input {
  flex: 1;
}

/* 搜索输入框 */
.search-input :deep(.el-input__wrapper) {
  height: 32px;
  padding: 0 var(--space-sm, 12px);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius-sm, 6px);
  background: var(--color-input-bg, #f9fafb);
  transition: border-color var(--transition-fast, 0.15s);
  box-shadow: none;
}

.search-input :deep(.el-input__wrapper:focus),
.search-input :deep(.el-input__wrapper:hover) {
  border-color: var(--color-border-focus, #8b5cf6);
}

.search-input :deep(.el-input__inner) {
  color: var(--color-text-primary, #1f2937);
  font-size: var(--font-size-sm, 13px);
}

.search-input :deep(.el-input__inner::placeholder) {
  color: var(--color-input-placeholder, #9ca3af);
}

/* 搜索按钮 */
.search-btn {
  height: 32px;
  padding: 0 var(--space-md, 16px);
  border: none;
  border-radius: var(--radius-sm, 6px);
  background: var(--gradient-primary, linear-gradient(135deg, #8b5cf6, #ec4899));
  color: #fff;
  font-size: var(--font-size-sm, 13px);
  cursor: pointer;
  transition: opacity var(--transition-fast, 0.15s);
}

.search-btn:hover {
  opacity: 0.85;
}
</style>