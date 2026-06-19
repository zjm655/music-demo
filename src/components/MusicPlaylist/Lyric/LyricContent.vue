<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useAudioStore } from '@/stores/audio'
import { useAudio } from '@/hooks/media'
import { useGetLyric } from '@/hooks/thirdparty'
import { parseLrc, type LrcLine } from '@/utils/lrc'

const audioStore = useAudioStore()
const audio = useAudio()
const { fetchLyric } = useGetLyric()

// 歌词数据
const lyrics = ref<LrcLine[]>([])
const transLyrics = ref<LrcLine[]>([])
const isLoading = ref(false)
const hasError = ref(false)

// 滚动控制
const lyricScrollRef = ref<HTMLElement | null>(null)
const lyricContainerRef = ref<HTMLElement | null>(null)
const lineRefs = ref<HTMLElement[]>([])
const isUserScrolling = ref(false)
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

// 设置每行 ref
function setLineRef(el: HTMLElement, index: number) {
  if (el) lineRefs.value[index] = el
}

// 当前激活的歌词索引
const activeIndex = computed(() => {
  const time = audioStore.currentTime
  if (lyrics.value.length === 0) return -1
  let index = lyrics.value.findIndex((l) => l.time > time) - 1
  if (index === -2) index = lyrics.value.length - 1
  return index
})

// 获取当前歌曲的 mid（第三方歌曲用 vid 或 id）
const currentMid = computed(() => {
  const song = audioStore.currentSong
  if (!song) return null
  // 第三方歌曲优先用 vid，其次用 id
  if (song.source === 'tencent') {
    return song.vid || String(song.id)
  }
  // 本地歌曲用 id
  return String(song.id)
})

// 获取歌词
async function loadLyrics() {
  const mid = currentMid.value
  if (!mid) {
    lyrics.value = []
    transLyrics.value = []
    return
  }

  isLoading.value = true
  hasError.value = false

  try {
    // 先尝试从当前歌曲的 lyrics 字段获取（本地歌曲）
    const song = audioStore.currentSong
    if (song?.lyrics) {
      lyrics.value = parseLrc(song.lyrics)
      transLyrics.value = []
      return
    }

    // 第三方歌曲调用 API
    if (song?.source === 'tencent') {
      const res = await fetchLyric({ mid })
      if (res?.code === 200 && res.data) {
        lyrics.value = parseLrc(res.data.lrc)
        transLyrics.value = res.data.trans ? parseLrc(res.data.trans) : []
      } else {
        hasError.value = true
      }
    } else {
      // 本地歌曲没有歌词 API
      hasError.value = true
    }
  } catch (e) {
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

// 自动滚动到当前歌词
function scrollToActive() {
  if (isUserScrolling.value || !lyricScrollRef.value) return
  const activeEl = lineRefs.value[activeIndex.value]
  if (!activeEl) return

  const scrollEl = lyricScrollRef.value
  const containerHeight = scrollEl.clientHeight
  const elementTop = activeEl.offsetTop
  const elementHeight = activeEl.offsetHeight
  const scrollTo = elementTop - containerHeight / 2 + elementHeight / 2

  scrollEl.scrollTo({ top: scrollTo, behavior: 'smooth' })
}

// 用户滚动检测
function handleScroll() {
  isUserScrolling.value = true
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    isUserScrolling.value = false
  }, 3000)
}

// 点击歌词跳转
function seekToLyric(time: number) {
  audio.seek(time)
}

// 监听歌曲变化
watch(
  () => audioStore.currentSong?.id,
  () => {
    loadLyrics()
  }
)

// 监听时间变化，自动滚动
watch(
  () => audioStore.currentTime,
  () => {
    nextTick(() => scrollToActive())
  }
)

onMounted(() => {
  loadLyrics()
  // 等歌词容器渲染后添加滚动监听
  nextTick(() => {
    if (lyricScrollRef.value) {
      lyricScrollRef.value.addEventListener('scroll', handleScroll)
    }
  })
})

onUnmounted(() => {
  if (scrollTimeout) clearTimeout(scrollTimeout)
  if (lyricScrollRef.value) {
    lyricScrollRef.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div class="lyric-content-main">
    <!-- 加载中 -->
    <div v-if="isLoading" class="lyric-loading">
      <span>加载歌词中...</span>
    </div>

    <!-- 无歌词 -->
    <div v-else-if="hasError || lyrics.length === 0" class="lyric-empty">
      <span>暂无歌词 / 纯音乐</span>
    </div>

    <!-- 歌词列表 -->
    <div
      v-else
      ref="lyricScrollRef"
      class="lyric-box"
    >
      <div ref="lyricContainerRef" class="lyric-inner">
        <div class="lyric-spacer"></div>
        <div
          v-for="(line, index) in lyrics"
          :key="index"
          :ref="(el) => setLineRef(el as HTMLElement, index)"
          class="lyric-line-group"
          :class="{ active: index === activeIndex }"
          @click="seekToLyric(line.time)"
        >
          <div class="lyric-line-main">{{ line.text }}</div>
          <div v-if="transLyrics[index]" class="lyric-line-trans">
            {{ transLyrics[index].text }}
          </div>
        </div>
        <div class="lyric-spacer"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lyric-content-main {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 0;
  overflow: hidden;
}

.lyric-loading,
.lyric-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.lyric-box {
  flex: 1;
  overflow-y: auto;
  /* 上下渐变遮罩 */
  mask-image: linear-gradient(transparent, #000 10%, #000 90%, transparent);
  -webkit-mask-image: linear-gradient(transparent, #000 10%, #000 90%, transparent);
}

.lyric-inner {
  padding: 0 20px;
  text-align: center;
}

.lyric-spacer {
  height: 40%;
}

.lyric-line-group {
  margin-bottom: 12px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.6;
  transform: scale(1);
}

.lyric-line-group:hover {
  opacity: 0.85;
}

.lyric-line-group.active {
  opacity: 1;
  transform: scale(1.05);
}

.lyric-line-main {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
  transition: all 0.3s ease;
  line-height: 1.5;
}

.lyric-line-trans {
  font-size: 13px;
  color: var(--color-text-secondary);
  opacity: 0.8;
  line-height: 1.4;
}

/* 激活状态渐变文字 */
.lyric-line-group.active .lyric-line-main {
  background: linear-gradient(
    90deg,
    #00e1ff 0%,
    #11ff7c 25%,
    #ffe600 50%,
    #ff8c00 75%,
    #ff4d4f 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.lyric-line-group.active .lyric-line-trans {
  background: linear-gradient(
    90deg,
    #00e1ff 0%,
    #11ff7c 25%,
    #ffe600 50%,
    #ff8c00 75%,
    #ff4d4f 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0.9;
}

/* 深色模式适配 */
:root.dark .lyric-line-main {
  color: var(--color-text-primary);
}

:root.dark .lyric-line-trans {
  color: var(--color-text-secondary);
}
</style>
