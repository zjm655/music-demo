<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import SongList from '@/components/MusicPlaylist/SongList.vue'
import SongCard from '@/components/MusicRecommend/SongCard.vue'
import SimplePagination from '@/components/Search/SimplePagination.vue'
import { useSearchUnified } from '@/hooks/common'
import { useAudio } from '@/hooks/media'
import { useSearchStore } from '@/stores/search'
import { useGetPlaylists, useOperatePlaylistSong, useAddExternalSong } from '@/hooks/playlist'
import type { UnifiedSearchResult } from '@/hooks/common'
import type { PlaylistItem } from '@/api/playlist'
import { popup } from '@/utils/popup'

const route = useRoute()
const searchStore = useSearchStore()
const { search, isLoading } = useSearchUnified()
const audio = useAudio()

const header = ['#', '', '', '', '', '', '']

// 批量操作模式
const isBatchMode = ref(false)

// 歌单相关
const playlists = ref<PlaylistItem[]>([])
const showPlaylistDialog = ref(false)
const selectedPlaylistId = ref<number | null>(null)
const submitting = ref(false)
const { fetchPlaylists } = useGetPlaylists()
const { operatePlaylistSong } = useOperatePlaylistSong()
const { addExternalSong } = useAddExternalSong()

// 当前页是否全选
const isAllSelected = computed(() => {
  if (searchStore.currentPageResults.length === 0) return false
  return searchStore.currentPageResults.every((song) =>
    searchStore.isSelected(song.source, song.id)
  )
})

// 搜索 - 只调用一次API，结果存入store
const handleSearch = async () => {
  if (!searchStore.keyword.trim()) return
  const result = await search({
    keyword: searchStore.keyword,
    page: 1,
    pageSize: 60, // 一次拉60条，本地分3页
  })
  if (result.code === 200 && result.data) {
    searchStore.setAllResults(result.data.list)
  }
}

// 翻页 - 只改页码，不调API
const handlePageChange = (page: number) => {
  searchStore.setPage(page)
}

const handlePlay = (id: number | string) => {
  if (isBatchMode.value) return // 批量模式下点击不播放
  const song = searchStore.allResults.find((s) => s.id === id)
  audio.addNextAndPlay(id, {
    title: song?.title,
    artist: song?.artist ?? undefined,
    album: song?.album ?? undefined,
    duration: song?.duration,
    coverUrl: song?.coverUrl,
    vid: song?.vid ?? undefined,
  })
}

// 批量操作
function toggleBatchMode() {
  isBatchMode.value = !isBatchMode.value
  if (!isBatchMode.value) {
    searchStore.clearSelection()
  }
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    // 取消全选当前页
    searchStore.currentPageResults.forEach((song) => {
      if (searchStore.isSelected(song.source, song.id)) {
        searchStore.toggle(song.source, song.id)
      }
    })
  } else {
    // 全选当前页
    searchStore.currentPageResults.forEach((song) => {
      if (!searchStore.isSelected(song.source, song.id)) {
        searchStore.toggle(song.source, song.id)
      }
    })
  }
}

// 加入播放列表
function addToPlaylist() {
  const selectedKeys = searchStore.getSelectedKeys()
  if (selectedKeys.length === 0) {
    popup.message.warning('请先选择歌曲')
    return
  }

  // 解析选中的歌曲
  const selectedSongs: UnifiedSearchResult[] = []
  selectedKeys.forEach((key) => {
    const [source, ...idParts] = key.split('-')
    const id = source === 'local' ? Number(idParts.join('-')) : idParts.join('-')
    const song = searchStore.allResults.find((s) => s.source === source && String(s.id) === String(id))
    if (song) selectedSongs.push(song)
  })

  // 批量添加到播放列表末尾
  selectedSongs.forEach((song) => {
    audio.addNext(song.id, {
      title: song.title,
      artist: song.artist ?? undefined,
      album: song.album ?? undefined,
      coverUrl: song.coverUrl ?? undefined,
      vid: song.vid ?? undefined,
    })
  })

  popup.message.success(`已添加 ${selectedSongs.length} 首歌曲到播放列表`)
  searchStore.clearSelection()
}

// 添加到歌单 - 打开弹窗
async function openPlaylistSelect() {
  if (searchStore.getSelectedKeys().length === 0) {
    popup.message.warning('请先选择歌曲')
    return
  }
  // 获取歌单列表
  const res = await fetchPlaylists()
  if (res?.code === 200 && res.data) {
    playlists.value = res.data
    if (playlists.value.length === 0) {
      popup.message.warning('暂无歌单，请先创建歌单')
      return
    }
    selectedPlaylistId.value = playlists.value[0]?.id ?? null
    showPlaylistDialog.value = true
  }
}

// 确认添加到歌单
async function confirmAddToPlaylist() {
  if (!selectedPlaylistId.value) {
    popup.message.warning('请选择歌单')
    return
  }

  submitting.value = true
  try {
    const selectedKeys = searchStore.getSelectedKeys()
    let successCount = 0

    for (const key of selectedKeys) {
      const [source, ...idParts] = key.split('-')
      const id = source === 'local' ? Number(idParts.join('-')) : idParts.join('-')
      const song = searchStore.allResults.find((s) => s.source === source && String(s.id) === String(id))
      if (!song) continue

      let res: { code?: number } | null = null
      if (source === 'local') {
        res = await operatePlaylistSong({
          playlistId: selectedPlaylistId.value,
          songId: Number(id),
          action: 'add',
        })
      } else {
        res = await addExternalSong({
          playlistId: selectedPlaylistId.value,
          songId: String(id),
          source: 'tencent',
          name: song.title,
          artist: song.artist ?? undefined,
          cover: song.coverUrl ?? undefined,
        })
      }
      if (res?.code === 200) successCount++
    }

    if (successCount > 0) {
      popup.message.success(`已添加 ${successCount} 首歌曲到歌单`)
      searchStore.clearSelection()
      showPlaylistDialog.value = false
    } else {
      popup.message.error('添加失败，请重试')
    }
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  const urlKeyword = route.query.keyword as string
  if (urlKeyword && !searchStore.keyword) {
    searchStore.setKeyword(urlKeyword)
  }
  if (searchStore.keyword) {
    handleSearch()
  }
})

watch(() => route.query.keyword, (newKeyword) => {
  if (newKeyword && newKeyword !== searchStore.keyword) {
    searchStore.setKeyword(String(newKeyword))
    handleSearch()
  }
})
</script>

<template>
  <div class="audio-search">
    <div class="search-header">
      <div class="search-row">
        <div class="search-input-wrapper">
          <el-input
            v-model="searchStore.keyword"
            placeholder="搜索歌曲..."
            @keyup.enter="handleSearch"
            class="search-input"
          />
          <el-button @click="handleSearch" :loading="isLoading" class="search-btn">
            搜索
          </el-button>
        </div>
        <!-- 批量操作按钮 -->
        <div v-if="searchStore.allResults.length > 0" class="batch-actions">
          <template v-if="isBatchMode">
            <el-button size="small" @click="toggleSelectAll">
              {{ isAllSelected ? '取消全选' : '全选当前页' }}
            </el-button>
            <el-button size="small" @click="addToPlaylist" :disabled="searchStore.selectedCount === 0">
              加入播放列表
            </el-button>
            <el-button size="small" @click="openPlaylistSelect" :disabled="searchStore.selectedCount === 0">
              添加到歌单
            </el-button>
            <el-button size="small" type="primary" @click="toggleBatchMode">
              退出复选
            </el-button>
          </template>
          <el-button v-else size="small" @click="toggleBatchMode">
            批量操作
          </el-button>
        </div>
      </div>
      <div v-if="searchStore.allResults.length > 0" class="search-pagination-row">
        <simple-pagination
          :current-page="searchStore.page"
          :total-pages="searchStore.totalPages"
          @page-change="handlePageChange"
        />
      </div>
    </div>

    <SongList :is-null="searchStore.allResults.length === 0" :header="header">
      <template #default>
        <div
          v-for="(song, index) in searchStore.currentPageResults"
          :key="`${song.source}-${song.id}`"
          class="song-row-wrapper"
        >
          <el-checkbox
            v-if="isBatchMode"
            class="song-row-checkbox"
            :model-value="searchStore.isSelected(song.source, song.id)"
            @change="searchStore.toggle(song.source, song.id)"
            @click.stop
          />
          <SongCard
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
            :vid="song.vid ?? null"
            :category="song.category ?? null"
            :category-id="song.categoryId ?? null"
            :create-time="null"
            :index="(searchStore.page - 1) * searchStore.pageSize + index + 1"
            :class="{ 'song-card--selected': searchStore.isSelected(song.source, song.id) }"
            @click="handlePlay"
          />
        </div>
      </template>
    </SongList>

    <!-- 歌单选择弹窗 -->
    <el-dialog
      v-model="showPlaylistDialog"
      title="选择歌单"
      width="400px"
    >
      <el-radio-group v-model="selectedPlaylistId" class="playlist-radio-group">
        <el-radio
          v-for="playlist in playlists"
          :key="playlist.id"
          :value="playlist.id"
          class="playlist-radio-item"
        >
          {{ playlist.name }}
          <span class="playlist-song-count">({{ playlist.songCount }} 首)</span>
        </el-radio>
      </el-radio-group>
      <template #footer>
        <el-button @click="showPlaylistDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAddToPlaylist" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
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
  display: flex;
  flex-direction: column;
  gap: var(--space-md, 12px);
}

.search-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md, 12px);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-xs, 8px);
  max-width: 400px;
  flex: 1;
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

/* 批量操作按钮 */
.batch-actions {
  display: flex;
  align-items: center;
  gap: var(--space-xs, 8px);
}

/* 分页器行 */
.search-pagination-row {
  display: flex;
  align-items: center;
}

/* 歌曲行包装 */
.song-row-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-sm, 8px);
  padding: 0 var(--space-sm, 8px);
}

.song-row-checkbox {
  flex-shrink: 0;
}

.song-row-wrapper :deep(.song-card) {
  flex: 1;
  padding-left: 0;
}

/* 选中状态 */
.song-card--selected {
  background: var(--color-bg-active, #ede9fe) !important;
}

/* 歌单选择弹窗 */
.playlist-radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm, 8px);
  max-height: 300px;
  overflow-y: auto;
}

.playlist-radio-item {
  width: 100%;
  margin-right: 0;
}

.playlist-song-count {
  color: var(--color-text-muted, #9ca3af);
  font-size: var(--font-size-xs, 12px);
  margin-left: var(--space-xs, 4px);
}
</style>
