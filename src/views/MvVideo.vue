<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import VideoPlayer from '@/components/MediaPlayer/VideoPlayer.vue'
import { useGetSong } from '@/hooks/song'
import { popup } from '@/utils/popup'
import type { SongItem } from '@/api/song'

const route = useRoute()
const router = useRouter()
const { fetchSong } = useGetSong()

// VideoPlayer 组件引用
const videoPlayerRef = ref<InstanceType<typeof VideoPlayer> | null>(null)

// 歌曲详情
const song = ref<SongItem | null>(null)
// 加载状态
const isLoading = ref(true)
// 错误信息
const error = ref('')

// 获取歌曲详情
async function loadSong() {
  const id = route.query.id
  if (!id) {
    error.value = '缺少歌曲 ID 参数'
    isLoading.value = false
    popup.message.error('缺少歌曲 ID 参数')
    return
  }

  isLoading.value = true
  error.value = ''

  const res = await fetchSong({ id: Number(id) })

  if (res?.code === 200 && res?.data) {
    song.value = res.data
    // 如果没有 MV 地址，提示用户
    if (!song.value.mvUrl) {
      error.value = '该歌曲暂无 MV'
      popup.message.warning('该歌曲暂无 MV')
    } else {
      // 加载 MV
      videoPlayerRef.value?.load(song.value.mvUrl)
    }
  } else {
    error.value = res?.message || '获取歌曲详情失败'
    popup.message.error('资源加载失败，请稍后重试')
  }

  isLoading.value = false
}

// 返回上一页
function goBack() {
  router.back()
}

// 监听 id 变化，重新加载
watch(
  () => route.query.id,
  () => {
    loadSong()
  },
)

onMounted(() => {
  loadSong()
})
</script>

<template>
  <div class="mv-video">
    <!-- 返回按钮 -->
    <div class="mv-video__header">
      <button class="mv-video__back" @click="goBack">
        <span class="mv-video__back-icon"></span>
        <span>返回</span>
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="mv-video__loading">
      <div class="mv-video__spinner"></div>
      <span>加载中...</span>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="mv-video__error">
      <div class="mv-video__error-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <p class="mv-video__error-text">{{ error }}</p>
      <button class="mv-video__retry" @click="loadSong">重试</button>
    </div>

    <!-- 视频播放器 -->
    <div v-else-if="song?.mvUrl" class="mv-video__player">
      <VideoPlayer ref="videoPlayerRef" />
    </div>

    <!-- 歌曲信息 -->
    <div v-if="song && !error" class="mv-video__info">
      <h1 class="mv-video__title">{{ song.title }}</h1>
      <p class="mv-video__author">
        <span class="mv-video__author-label">MV 作者：</span>
        {{ song.mvAuthor ?? '未知作者' }}
      </p>
      <p v-if="song.mvDescription" class="mv-video__desc">{{ song.mvDescription }}</p>
    </div>
  </div>
</template>

<style scoped>
.mv-video {
  min-height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
}

/* 返回按钮 */
.mv-video__header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: var(--space-md);
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
}

.mv-video__back {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: var(--radius-sm);
  color: #fff;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.mv-video__back:hover {
  background: rgba(255, 255, 255, 0.2);
}

.mv-video__back-icon {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(45deg);
}

/* 加载状态 */
.mv-video__loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--font-size-md);
}

.mv-video__spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 错误提示 */
.mv-video__error {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  color: rgba(255, 255, 255, 0.7);
}

.mv-video__error-icon {
  width: 64px;
  height: 64px;
  color: rgba(255, 255, 255, 0.4);
}

.mv-video__error-icon svg {
  width: 100%;
  height: 100%;
}

.mv-video__error-text {
  font-size: var(--font-size-md);
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.mv-video__retry {
  padding: var(--space-xs) var(--space-lg);
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-sm);
  color: #fff;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.mv-video__retry:hover {
  background: var(--color-primary-hover);
}

/* 播放器容器 */
.mv-video__player {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 歌曲信息 - 改为底部固定 */
.mv-video__info {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-md) var(--space-lg);
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  color: #fff;
}

.mv-video__title {
  margin: 0 0 var(--space-xs);
  font-size: var(--font-size-lg);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mv-video__author {
  margin: 0 0 var(--space-xs);
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.7);
}

.mv-video__author-label {
  color: rgba(255, 255, 255, 0.5);
}

.mv-video__desc {
  margin: 0;
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.4);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
