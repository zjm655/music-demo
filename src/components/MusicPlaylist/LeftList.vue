<script setup lang="ts"></script>

<template>
  <div class="list-main">
    <el-scrollbar>
      <p v-for="item in 200" :key="item" class="scrollbar-demo-item">{{ item }}</p>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.list-main {
  height: 100%;
}
.list-main :deep(.el-scrollbar) {
  height: 100%;
}
</style>
