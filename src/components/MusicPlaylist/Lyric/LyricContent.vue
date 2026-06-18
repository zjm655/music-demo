<script setup lang="ts"></script>

<template>
  <div class="lyric-content-main">
    <el-scrollbar class="scrollbar">
      <!-- <p v-for="item in 20" :key="item" class="scrollbar-demo-item">{{ item }}</p> -->
    </el-scrollbar>
  </div>
</template>

<style scoped>
.lyric-content-main {
  /* height: 100%; */
  display: flex;
}
.scrollbar {
  flex: 1;
}
</style>
