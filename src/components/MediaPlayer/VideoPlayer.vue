<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useVideo } from '@/hooks/media'

const videoRef = useTemplateRef<HTMLVideoElement>('video')
const {
  currentSrc,
  currentTime,
  duration,
  playing,
  ended,
  load,
  play,
  pause,
  toggle,
  seek,
  setVolume,
  setMuted,
  unload,
} = useVideo(videoRef)

defineExpose({
  load,
  play,
  pause,
  toggle,
  seek,
  setVolume,
  setMuted,
  unload,
  currentSrc,
  playing,
  currentTime,
  duration,
  ended,
})
</script>

<template>
  <div class="video-player">
    <video
      ref="video"
      class="video-player__video"
      :src="currentSrc"
      controls
      playsinline
      autoplay
    />
  </div>
</template>

<style scoped>
.video-player {
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-player__video {
  width: 100%;
  max-height: 80vh;
  outline: none;
}
</style>
