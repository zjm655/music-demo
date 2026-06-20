<script setup lang="ts">
import { ref, computed } from 'vue'
import SongList from '@/components/MusicPlaylist/SongList.vue'
import AudioSong from '@/components/MusicPlaylist/card/AudioSong.vue'
import { useAudioStore } from '@/stores/audio'
import { useAudioListStore } from '@/stores/audioList'
import { useGetPlaylists, useOperatePlaylistSong, useAddExternalSong } from '@/hooks/playlist'
import type { PlaylistItem } from '@/api/playlist'
import { popup } from '@/utils/popup'

const audioStore = useAudioStore()
const listStore = useAudioListStore()

const { fetchPlaylists } = useGetPlaylists()
const { operatePlaylistSong } = useOperatePlaylistSong()
const { addExternalSong } = useAddExternalSong()

// 表头配置
const header = ['#', '标题', '歌手', '作曲', '作词', '', '时长']

// 歌单弹窗
const showPlaylistDialog = ref(false)
const playlists = ref<PlaylistItem[]>([])
const targetPlaylistId = ref<number | null>(null)
const submitting = ref(false)

// 全选
const isAllSelected = computed(() => {
  if (audioStore.playlist.length === 0) return false
  return audioStore.playlist.every((s) => listStore.isSelected(s.source || 'local', s.id))
})

function toggleSelectAll() {
  if (isAllSelected.value) {
    audioStore.playlist.forEach((s) => {
      const source = s.source || 'local'
      if (listStore.isSelected(source, s.id)) listStore.toggle(source, s.id)
    })
  } else {
    audioStore.playlist.forEach((s) => {
      const source = s.source || 'local'
      if (!listStore.isSelected(source, s.id)) listStore.toggle(source, s.id)
    })
  }
}

// 获取选中的歌曲
function getSelectedSongs() {
  return listStore.getSelectedKeys().map((key) => {
    const [source, ...idParts] = key.split('-')
    const id = source === 'local' ? Number(idParts.join('-')) : idParts.join('-')
    return audioStore.playlist.find((s) => (s.source || 'local') === source && String(s.id) === String(id))
  }).filter(Boolean)
}

// 批量移除
function removeFromList() {
  const songs = getSelectedSongs()
  if (songs.length === 0) return
  // 从后往前删，避免索引变化
  const indices = songs.map((s) => audioStore.playlist.indexOf(s!)).sort((a, b) => b - a)
  indices.forEach((i) => audioStore.playlist.splice(i, 1))
  // 修正当前播放索引
  if (audioStore.index >= audioStore.playlist.length) {
    audioStore.index = Math.max(0, audioStore.playlist.length - 1)
  }
  popup.message.success(`已移除 ${songs.length} 首歌曲`)
  listStore.clearSelection()
}

// 打开歌单选择弹窗
async function openPlaylistSelect() {
  if (listStore.selectedCount === 0) {
    popup.message.warning('请先选择歌曲')
    return
  }
  const res = await fetchPlaylists()
  if (res?.code === 200 && res.data) {
    playlists.value = res.data
    if (playlists.value.length === 0) {
      popup.message.warning('暂无歌单，请先创建歌单')
      return
    }
    targetPlaylistId.value = playlists.value[0]?.id ?? null
    showPlaylistDialog.value = true
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
      if (!song) continue
      const source = song.source || 'local'
      let res: { code?: number } | null = null
      if (source === 'local') {
        res = await operatePlaylistSong({
          playlistId: targetPlaylistId.value,
          songId: Number(song.id),
          action: 'add',
        })
      } else {
        res = await addExternalSong({
          playlistId: targetPlaylistId.value,
          songId: String(song.id),
          source,
          name: song.title,
          artist: song.artist ?? undefined,
          cover: song.coverUrl ?? undefined,
        })
      }
      if (res?.code === 200) successCount++
    }
    if (successCount > 0) {
      popup.message.success(`已添加 ${successCount} 首歌曲到歌单`)
      showPlaylistDialog.value = false
      listStore.clearSelection()
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="audio-playlist">
    <!-- 批量操作栏 -->
    <div v-if="audioStore.playlist.length > 0" class="audio-playlist__batch-bar">
      <template v-if="listStore.isBatchMode">
        <el-button size="small" @click="toggleSelectAll">
          {{ isAllSelected ? '取消全选' : '全选' }}
        </el-button>
        <el-button size="small" @click="openPlaylistSelect" :disabled="listStore.selectedCount === 0">
          添加到歌单
        </el-button>
        <el-button size="small" type="danger" @click="removeFromList" :disabled="listStore.selectedCount === 0">
          移除
        </el-button>
        <el-button size="small" type="primary" @click="listStore.toggleBatchMode()">
          退出复选
        </el-button>
      </template>
      <el-button v-else size="small" @click="listStore.toggleBatchMode()">
        批量操作
      </el-button>
    </div>

    <SongList :is-null="audioStore.playlist.length === 0" :header="header">
      <template #default>
        <div
          v-for="(song, index) in audioStore.playlist"
          :key="`${song.source || 'local'}-${song.id}`"
          class="song-row-wrapper"
        >
          <el-checkbox
            v-if="listStore.isBatchMode"
            class="song-row-checkbox"
            :model-value="listStore.isSelected(song.source || 'local', song.id)"
            @change="listStore.toggle(song.source || 'local', song.id)"
            @click.stop
          />
          <AudioSong
            :id="song.id"
            :title="song.title"
            :artist="song.artist"
            :lyricist="song.lyricist"
            :composer="song.composer"
            :duration="song.duration"
            :mv-url="song.mvUrl"
            :vid="song.vid"
            :source="song.source"
            :active="index === audioStore.index"
            :index="index + 1"
            :class="{ 'audio-song--selected': listStore.isSelected(song.source || 'local', song.id) }"
          />
        </div>
      </template>
    </SongList>

    <!-- 歌单选择弹窗 -->
    <el-dialog v-model="showPlaylistDialog" title="添加到歌单" width="400px">
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
        <el-button @click="showPlaylistDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAddToPlaylist" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.audio-playlist {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.audio-playlist__batch-bar {
  display: flex;
  align-items: center;
  gap: var(--space-sm, 8px);
  padding: var(--space-sm, 8px) var(--space-lg, 16px);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  flex-wrap: wrap;
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

.song-row-wrapper :deep(.audio-song) {
  flex: 1;
}

.audio-song--selected {
  background: var(--color-bg-active, rgba(139, 92, 246, 0.22)) !important;
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
