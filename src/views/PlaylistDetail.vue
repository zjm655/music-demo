<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useGetPlaylist } from '@/hooks/playlist'
import type { PlaylistDetail, PlaylistSongVO } from '@/api/playlist'
import { useAudio } from '@/hooks/media'
import SongList from '@/components/MusicPlaylist/SongList.vue'
import SongCard from '@/components/MusicRecommend/SongCard.vue'

const route = useRoute()
const router = useRouter()
const audio = useAudio()

const playlist = ref<PlaylistDetail | null>(null)
const header = ['#', '', '', '', '', '', '']

const { fetchPlaylist } = useGetPlaylist()

async function loadPlaylist() {
  const id = Number(route.query.id)
  if (!id) return
  const res = await fetchPlaylist({ id })
  if (res?.code === 200 && res.data) {
    playlist.value = res.data
  }
}

function handlePlay(id: number | string) {
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
  router.push('/playlist/my-playlists')
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
    </div>

    <div class="playlist-detail__songs">
      <SongList :is-null="!playlist || playlist.songs.length === 0" :header="header">
        <template #default>
          <SongCard
            v-for="(song, index) in playlist?.songs || []"
            :key="`${song.source}-${song.id}`"
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
            @click="handlePlay"
          />
        </template>
      </SongList>
    </div>
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
  border: none;
  border-radius: var(--radius-sm, 6px);
  background: transparent;
  color: var(--color-text-secondary, #6b7280);
  font-size: var(--font-size-sm, 13px);
  cursor: pointer;
  transition: background var(--transition-fast, 0.15s), color var(--transition-fast, 0.15s);
}

.playlist-detail__back:hover {
  background: var(--color-bg-hover, #f3e8ff);
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

.playlist-detail__songs {
  flex: 1;
  min-height: 0;
}
</style>
