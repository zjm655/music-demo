<script setup lang="ts"></script>

<template>
  <div class="playlist-spot-main"></div>
</template>

<style scoped>
.playlist-spot-main {
  /* 圆点基础尺寸 */
  width: 10px;
  height: 10px;
  border-radius: 50%;
  /* 默认样式 */
  background-color: #ccc;
  cursor: pointer;
  transition: all 0.2s ease;
  /* 可选：间距由父容器控制，这里不设margin */
}
</style>
