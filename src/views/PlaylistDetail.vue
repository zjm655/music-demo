<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useGetPlaylist, useGetPlaylists, useOperatePlaylistSong, useAddExternalSong, useRemovePlaylistSong } from '@/hooks/playlist'
import type { PlaylistDetail, PlaylistSongVO, PlaylistItem } from '@/api/playlist'
import { useAudio } from '@/hooks/media'
import { usePlaylistDetailStore } from '@/stores/playlistDetail'
import { popup } from '@/utils/popup'
import SongList from '@/components/MusicPlaylist/SongList.vue'
import SongCard from '@/components/MusicRecommend/SongCard.vue'

const route = useRoute()
const router = useRouter()
const audio = useAudio()
const store = usePlaylistDetailStore()

const playlist = ref<PlaylistDetail | null>(null)
const header = ['#', '', '', '', '', '', '']
const loading = ref(false)
const submitting = ref(false)

const { fetchPlaylist } = useGetPlaylist()
const { fetchPlaylists } = useGetPlaylists()
const { operatePlaylistSong } = useOperatePlaylistSong()
const { addExternalSong } = useAddExternalSong()
const { remove } = useRemovePlaylistSong()

// 弹窗相关
const showAddDialog = ref(false)
const showMoveDialog = ref(false)
const playlists = ref<PlaylistItem[]>([])
const targetPlaylistId = ref<number | null>(null)

// 当前页全选
const isAllSelected = computed(() => {
  const songs = playlist.value?.songs || []
  if (songs.length === 0) return false
  return songs.every((s) => store.isSelected(s.source, s.id))
})

async function loadPlaylist() {
  const id = Number(route.query.id)
  if (!id) return
  store.setPlaylistId(id)
  loading.value = true
  try {
    const res = await fetchPlaylist({ id })
    if (res?.code === 200 && res.data) {
      playlist.value = res.data
    }
  } finally {
    loading.value = false
  }
}

function handlePlay(id: number | string) {
  if (store.isBatchMode) return
  const song = playlist.value?.songs.find((s) => s.id === id)
  if (!song) return
  audio.addNextAndPlay(id, {
    title: song.title,
    artist: song.artist ?? undefined,
    album: song.album ?? undefined,
    coverUrl: song.coverUrl ?? undefined,
    vid: song.vid ?? undefined,
  })
}

function goBack() {
  store.reset()
  router.push('/playlist/my-playlists')
}

// 全选/取消全选
function toggleSelectAll() {
  const songs = playlist.value?.songs || []
  if (isAllSelected.value) {
    songs.forEach((s) => {
      if (store.isSelected(s.source, s.id)) store.toggle(s.source, s.id)
    })
  } else {
    songs.forEach((s) => {
      if (!store.isSelected(s.source, s.id)) store.toggle(s.source, s.id)
    })
  }
}

// 解析选中歌曲
function getSelectedSongs(): PlaylistSongVO[] {
  const songs = playlist.value?.songs || []
  return store.getSelectedKeys().map((key) => {
    const [source, ...idParts] = key.split('-')
    const id = source === 'local' ? Number(idParts.join('-')) : idParts.join('-')
    return songs.find((s) => s.source === source && String(s.id) === String(id))
  }).filter(Boolean) as PlaylistSongVO[]
}

// 加入播放列表
function addToPlayingList() {
  const songs = getSelectedSongs()
  if (songs.length === 0) return
  songs.forEach((song) => {
    audio.addNext(song.id, {
      title: song.title,
      artist: song.artist ?? undefined,
      album: song.album ?? undefined,
      coverUrl: song.coverUrl ?? undefined,
      vid: song.vid ?? undefined,
    })
  })
  popup.message.success(`已添加 ${songs.length} 首歌曲到播放列表`)
  store.clearSelection()
}

// 加载歌单列表并打开弹窗
async function openDialog(type: 'add' | 'move') {
  if (store.selectedCount === 0) {
    popup.message.warning('请先选择歌曲')
    return
  }
  const res = await fetchPlaylists()
  if (res?.code === 200 && res.data) {
    // 移动时排除当前歌单
    playlists.value = type === 'move'
      ? res.data.filter((p) => p.id !== store.playlistId)
      : res.data
    if (playlists.value.length === 0) {
      popup.message.warning(type === 'move' ? '没有其他歌单可移动' : '暂无歌单，请先创建歌单')
      return
    }
    targetPlaylistId.value = playlists.value[0]?.id ?? null
    if (type === 'add') showAddDialog.value = true
    else showMoveDialog.value = true
  }
}

// 确认添加到歌单
async function confirmAddToPlaylist() {
  if (!targetPlaylistId.value) return
  submitting.value = true
  try {
    const songs = getSelectedSongs()
    let successCount = 0
    for (const song of songs) {
      let res: { code?: number } | null = null
      if (song.source === 'local') {
        res = await operatePlaylistSong({
          playlistId: targetPlaylistId.value,
          songId: Number(song.id),
          action: 'add',
        })
      } else {
        res = await addExternalSong({
          playlistId: targetPlaylistId.value,
          songId: String(song.id),
          source: song.source,
          name: song.title,
          artist: song.artist ?? undefined,
          cover: song.coverUrl ?? undefined,
        })
      }
      if (res?.code === 200) successCount++
    }
    if (successCount > 0) {
      popup.message.success(`已添加 ${successCount} 首歌曲到歌单`)
      showAddDialog.value = false
      store.clearSelection()
    }
  } finally {
    submitting.value = false
  }
}

// 确认移动到歌单
async function confirmMoveToPlaylist() {
  if (!targetPlaylistId.value || !store.playlistId) return
  submitting.value = true
  try {
    const songs = getSelectedSongs()
    let successCount = 0
    for (const song of songs) {
      let addRes: { code?: number } | null = null
      if (song.source === 'local') {
        addRes = await operatePlaylistSong({
          playlistId: targetPlaylistId.value,
          songId: Number(song.id),
          action: 'add',
        })
      } else {
        addRes = await addExternalSong({
          playlistId: targetPlaylistId.value,
          songId: String(song.id),
          source: song.source,
          name: song.title,
          artist: song.artist ?? undefined,
          cover: song.coverUrl ?? undefined,
        })
      }
      if (addRes?.code === 200) {
        await remove({
          playlistId: store.playlistId,
          songId: song.id,
          source: song.source,
        })
        successCount++
      }
    }
    if (successCount > 0) {
      popup.message.success(`已移动 ${successCount} 首歌曲`)
      showMoveDialog.value = false
      store.clearSelection()
      await loadPlaylist()
    }
  } finally {
    submitting.value = false
  }
}

// 批量删除
async function confirmDelete() {
  if (store.selectedCount === 0) return
  const confirmed = await popup.confirm(`确定删除选中的 ${store.selectedCount} 首歌曲？`)
  if (!confirmed) return
  const songs = getSelectedSongs()
  let successCount = 0
  for (const song of songs) {
    const res = await remove({
      playlistId: store.playlistId!,
      songId: song.id,
      source: song.source,
    })
    if (res?.code === 200) successCount++
  }
  if (successCount > 0) {
    popup.message.success(`已删除 ${successCount} 首歌曲`)
    store.clearSelection()
    await loadPlaylist()
  }
}

onMounted(() => {
  loadPlaylist()
})
</script>

<template>
  <div class="playlist-detail">
    <div class="playlist-detail__header">
      <button class="playlist-detail__back" @click="goBack">
        <el-icon :size="16"><ArrowLeft /></el-icon>
        <span>返回歌单</span>
      </button>
      <div v-if="playlist" class="playlist-detail__info">
        <el-image
          class="playlist-detail__cover"
          :src="playlist.coverUrl || '/favicon.ico'"
          fit="cover"
        />
        <div class="playlist-detail__meta">
          <h2 class="playlist-detail__name">{{ playlist.name }}</h2>
          <p v-if="playlist.description" class="playlist-detail__desc">
            {{ playlist.description }}
          </p>
          <span class="playlist-detail__count">{{ playlist.songs.length }} 首歌曲</span>
        </div>
      </div>

      <!-- 批量操作栏 -->
      <div v-if="playlist && playlist.songs.length > 0" class="playlist-detail__batch-bar">
        <template v-if="store.isBatchMode">
          <el-button size="small" @click="toggleSelectAll">
            {{ isAllSelected ? '取消全选' : '全选' }}
          </el-button>
          <el-button size="small" @click="addToPlayingList" :disabled="store.selectedCount === 0">
            加入播放列表
          </el-button>
          <el-button size="small" @click="openDialog('add')" :disabled="store.selectedCount === 0">
            添加到歌单
          </el-button>
          <el-button size="small" @click="openDialog('move')" :disabled="store.selectedCount === 0">
            移动到歌单
          </el-button>
          <el-button size="small" type="danger" @click="confirmDelete" :disabled="store.selectedCount === 0">
            删除
          </el-button>
          <el-button size="small" type="primary" @click="store.toggleBatchMode()">
            退出复选
          </el-button>
        </template>
        <el-button v-else size="small" @click="store.toggleBatchMode()">
          批量操作
        </el-button>
      </div>
    </div>

    <div class="playlist-detail__songs" v-loading="loading">
      <SongList :is-null="!playlist || playlist.songs.length === 0" :header="header">
        <template #default>
          <div
            v-for="(song, index) in playlist?.songs || []"
            :key="`${song.source}-${song.id}`"
            class="song-row-wrapper"
          >
            <el-checkbox
              v-if="store.isBatchMode"
              class="song-row-checkbox"
              :model-value="store.isSelected(song.source, song.id)"
              @change="store.toggle(song.source, song.id)"
              @click.stop
            />
            <SongCard
              :id="song.id"
              :title="song.title"
              :artist="song.artist"
              :album="song.album"
              :lyricist="null"
              :composer="null"
              :lyrics="null"
              :cover-url="song.coverUrl"
              :audio-url="song.audioUrl"
              :mv-url="null"
              :mv-description="null"
              :mv-author="null"
              :vid="song.vid"
              :category="null"
              :category-id="null"
              :create-time="null"
              :index="index + 1"
              :class="{ 'song-card--selected': store.isSelected(song.source, song.id) }"
              @click="handlePlay"
            />
          </div>
        </template>
      </SongList>
    </div>

    <!-- 添加到歌单弹窗 -->
    <el-dialog v-model="showAddDialog" title="添加到歌单" width="400px">
      <el-radio-group v-model="targetPlaylistId" class="playlist-radio-group">
        <el-radio
          v-for="p in playlists"
          :key="p.id"
          :value="p.id"
          class="playlist-radio-item"
        >
          {{ p.name }}
          <span class="playlist-song-count">({{ p.songCount }} 首)</span>
        </el-radio>
      </el-radio-group>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAddToPlaylist" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>

    <!-- 移动到歌单弹窗 -->
    <el-dialog v-model="showMoveDialog" title="移动到歌单" width="400px">
      <el-radio-group v-model="targetPlaylistId" class="playlist-radio-group">
        <el-radio
          v-for="p in playlists"
          :key="p.id"
          :value="p.id"
          class="playlist-radio-item"
        >
          {{ p.name }}
          <span class="playlist-song-count">({{ p.songCount }} 首)</span>
        </el-radio>
      </el-radio-group>
      <template #footer>
        <el-button @click="showMoveDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmMoveToPlaylist" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.playlist-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.playlist-detail__header {
  padding: var(--space-lg, 16px);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.playlist-detail__back {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs, 4px);
  padding: var(--space-xs, 4px) var(--space-sm, 8px);
  margin-bottom: var(--space-md, 12px);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius-sm, 6px);
  background: var(--color-bg-card, #ffffff);
  color: var(--color-text-primary, #1f2937);
  font-size: var(--font-size-sm, 13px);
  cursor: pointer;
  transition: background var(--transition-fast, 0.15s), border-color var(--transition-fast, 0.15s);
}

.playlist-detail__back:hover {
  background: var(--color-bg-hover, #f3e8ff);
  border-color: var(--color-primary, #8b5cf6);
  color: var(--color-primary, #8b5cf6);
}

.playlist-detail__info {
  display: flex;
  align-items: center;
  gap: var(--space-lg, 16px);
}

.playlist-detail__cover {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-md, 8px);
  flex-shrink: 0;
}

.playlist-detail__meta {
  flex: 1;
  min-width: 0;
}

.playlist-detail__name {
  margin: 0 0 var(--space-xs, 4px);
  font-size: var(--font-size-xl, 20px);
  font-weight: 600;
  color: var(--color-text-primary, #1f2937);
}

.playlist-detail__desc {
  margin: 0 0 var(--space-xs, 4px);
  font-size: var(--font-size-sm, 13px);
  color: var(--color-text-secondary, #6b7280);
  line-height: 1.5;
}

.playlist-detail__count {
  font-size: var(--font-size-xs, 12px);
  color: var(--color-text-muted, #9ca3af);
}

.playlist-detail__batch-bar {
  display: flex;
  align-items: center;
  gap: var(--space-sm, 8px);
  margin-top: var(--space-md, 12px);
  flex-wrap: wrap;
}

.playlist-detail__songs {
  flex: 1;
  min-height: 0;
}

.song-row-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
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

.song-card--selected {
  background: var(--color-bg-active, #ede9fe) !important;
}

.playlist-radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm, 8px);
  width: 100%;
}

.playlist-radio-item {
  width: 100%;
}

.playlist-song-count {
  color: var(--color-text-muted, #9ca3af);
  font-size: var(--font-size-xs, 12px);
}
</style>
