<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useGetPlaylists, useCreatePlaylist, useDeletePlaylist } from '@/hooks/playlist'
import type { PlaylistItem } from '@/api/playlist'
import { popup } from '@/utils/popup'
import PlaylistGrid from '@/components/MyPlaylists/PlaylistGrid.vue'
import PlaylistGridItem from '@/components/MyPlaylists/PlaylistGridItem.vue'

const router = useRouter()
const playlists = ref<PlaylistItem[]>([])
const loading = ref(false)

const { fetchPlaylists } = useGetPlaylists()
const { createPlaylist } = useCreatePlaylist()
const { deletePlaylist } = useDeletePlaylist()

async function loadPlaylists() {
  loading.value = true
  try {
    const res = await fetchPlaylists()
    if (res?.code === 200 && res.data) {
      playlists.value = res.data
    }
  } finally {
    loading.value = false
  }
}

async function handleCreate() {
  try {
    const { value } = await ElMessageBox.prompt('请输入歌单名称', '新建歌单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /\S+/,
      inputErrorMessage: '歌单名称不能为空',
    })
    const res = await createPlaylist({ name: value })
    if (res?.code === 200) {
      popup.message.success('歌单创建成功')
      loadPlaylists()
    } else {
      popup.message.error(res?.message || '创建失败')
    }
  } catch {
    // 用户取消，不处理
  }
}

async function handleDelete(id: number | string) {
  try {
    await ElMessageBox.confirm('确定要删除这个歌单吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const res = await deletePlaylist({ id: Number(id) })
    if (res?.code === 200) {
      popup.message.success('歌单已删除')
      loadPlaylists()
    } else {
      popup.message.error(res?.message || '删除失败')
    }
  } catch {
    // 用户取消，不处理
  }
}

function handleClick(id: number | string) {
  router.push({ path: '/playlist/playlist-detail', query: { id: String(id) } })
}

onMounted(() => {
  loadPlaylists()
})
</script>

<template>
  <div class="my-playlists-main">
    <div class="my-playlists-header">
      <h2 class="my-playlists-title">我的歌单</h2>
      <button class="my-playlists-create-btn" @click="handleCreate">
        <el-icon :size="14"><Plus /></el-icon>
        <span>新建歌单</span>
      </button>
    </div>
    <playlist-grid :is-null="playlists.length === 0" v-loading="loading">
      <playlist-grid-item
        v-for="p in playlists"
        :key="p.id"
        :id="p.id"
        :name="p.name"
        :cover-url="p.coverUrl"
        :song-count="p.songCount"
        @click="handleClick"
        @delete="handleDelete"
      />
    </playlist-grid>
  </div>
</template>

<style scoped>
.my-playlists-main {
  padding: var(--space-xl, 24px);
}

.my-playlists-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xl, 24px);
}

.my-playlists-title {
  margin: 0;
  font-size: var(--font-size-xl, 20px);
  font-weight: 600;
  color: var(--color-text-primary, #1f2937);
}

.my-playlists-create-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs, 4px);
  padding: var(--space-sm, 8px) var(--space-md, 12px);
  border: none;
  border-radius: var(--radius-md, 8px);
  background: var(--color-primary, #8b5cf6);
  color: #fff;
  font-size: var(--font-size-sm, 13px);
  font-weight: 500;
  cursor: pointer;
  transition: background var(--transition-fast, 0.15s), transform var(--transition-fast, 0.15s);
}

.my-playlists-create-btn:hover {
  background: var(--color-primary-hover, #7c3aed);
  transform: translateY(-1px);
}

.my-playlists-create-btn:active {
  transform: translateY(0);
}
</style>
