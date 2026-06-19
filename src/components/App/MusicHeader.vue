<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { Moon, Sunny, ArrowDown } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const activeNames = ref(['0'])
const bgMode = ref(false)

function changeBgMode() {
  document.documentElement.classList.toggle('dark')
}

const drawer = ref(false)
</script>

<template>
  <div class="music-header">
    <h1 class="music-header__brand">音乐平台</h1>
    <nav class="music-header__nav">
      <router-link to="/home" active-class="music-header__link--active">首页</router-link>
      <router-link to="/playlist/audio" active-class="music-header__link--active"
        >播放列表</router-link
      >
      <router-link to="/playlist/search" active-class="music-header__link--active"
        >搜索</router-link
      >
      <router-link
        :to="{ name: 'MyPlaylists' }"
        active-class="music-header__link--active"
        v-if="useUserStore().isLogin"
        >我的歌单</router-link
      >
    </nav>
    <nav class="music-header__user">
      <router-link
        to="/user-center"
        active-class="music-header__link--active"
        v-if="useUserStore().isLogin"
        >个人中心</router-link
      >
      <router-link to="/login" active-class="music-header__link--active" v-else>登录</router-link>
      <el-dropdown>
        <el-button type="primary" style="background-color: var(--color-primary-active)">
          切换背景图片<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              @click="useThemeStore().setBg(Number(useThemeStore().backgrounds.length + 1))"
              >使用默认背景</el-dropdown-item
            >
            <el-dropdown-item v-for="(imageSrc, index) in useThemeStore().backgrounds" :key="index"
              ><el-image
                style="width: 100px; height: 90px; cursor: pointer"
                :src="imageSrc"
                @click="useThemeStore().setBg(Number(index))"
              ></el-image
            ></el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-switch
        v-model="bgMode"
        style="--el-switch-on-color: var(--color-primary-active)"
        @click="changeBgMode"
        :active-action-icon="Moon"
        :inactive-action-icon="Sunny"
      ></el-switch>
    </nav>
    <el-button
      type="primary"
      @click="drawer = true"
      style="background: none; border: none"
      class="is-show"
    >
      <button class="music-header__hamburger">
        <span class="music-header__bar"></span>
        <span class="music-header__bar"></span>
        <span class="music-header__bar"></span>
      </button>
    </el-button>
    <el-drawer
      v-model="drawer"
      title="导航栏"
      size="50%"
      style="
        background: var(--gradient-page);
        border-bottom: 1.5px solid var(--color-border-soft);
        transition: background var(--transition-normal);
      "
    >
      <nav class="music-header__nav--mobilphone">
        <router-link to="/home" active-class="music-header__link--active">首页</router-link>
        <router-link
          to="/login"
          active-class="music-header__link--active"
          v-if="!useUserStore().isLogin"
          >登录</router-link
        >
        <router-link to="/user-center" active-class="music-header__link--active" v-else
          >个人中心</router-link
        >
        <router-link to="/playlist/audio" active-class="music-header__link--active"
          >播放列表</router-link
        >
        <router-link to="/playlist/search" active-class="music-header__link--active"
          >搜索</router-link
        >
        <!-- <router-link to="/" active-class="music-header__link--active">音乐排行</router-link> -->
        <!-- <router-link to="/" active-class="music-header__link--active">推荐歌单</router-link> -->
        <router-link
          :to="{ name: 'MyPlaylists' }"
          active-class="music-header__link--active"
          v-if="useUserStore().isLogin"
          >我的歌单</router-link
        >
        <el-switch
          v-model="bgMode"
          style="--el-switch-on-color: var(--color-primary-active)"
          @click="changeBgMode"
          :active-action-icon="Moon"
          :inactive-action-icon="Sunny"
        ></el-switch>

        <el-collapse
          v-model="activeNames"
          @change="1 + 1"
          style="background-color: var(--color-primary-active)"
        >
          <el-collapse-item
            title="切换背景图片"
            name="1"
            style="background-color: var(--color-primary-active)"
          >
            <div
              @click="useThemeStore().setBg(useThemeStore().backgrounds.length + 1)"
              class="music-header__bg--change"
            >
              使用默认背景
            </div>
            <el-image
              v-for="(imageSrc, index) in useThemeStore().backgrounds"
              :key="index"
              style="width: 100px; height: 90px; margin: 0 5px; cursor: pointer"
              :src="imageSrc"
              @click="useThemeStore().setBg(Number(index))"
            ></el-image>
          </el-collapse-item>
        </el-collapse>
      </nav>
    </el-drawer>
  </div>
</template>

<style scoped>
.music-header {
  display: flex;
  align-items: center;
  gap: var(--space-xl);
  height: 64px;
  padding: 0 var(--space-xl);
  width: clamp(80vw, calc(75vw + 150px), 100vw);
  max-width: 100vw;
  position: relative;
  margin: 0 auto;
}

.music-header__brand {
  margin: 0;
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  letter-spacing: 2px;
  cursor: pointer;
  white-space: nowrap;
  transition: color var(--transition-fast);
}

.music-header__brand:hover {
  color: var(--color-primary-hover);
}

/* Main nav links */
.music-header__nav {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  flex: 1;
  min-width: 0;
}

.music-header__nav a,
.music-header__user a {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  white-space: nowrap;
  transition: color var(--transition-fast);
  text-decoration: none;
}

.music-header__nav a:hover,
.music-header__user a:hover {
  color: var(--color-primary);
}

.music-header__link--active {
  color: var(--color-secondary-hover) !important;
}

.music-header__user {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-shrink: 0;
}

.is-show {
  display: none;
}

.music-header__hamburger {
  display: none;
  width: 32px;
  height: 32px;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.music-header__bar {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--color-text-primary);
  border-radius: 1px;
  transition:
    transform var(--transition-fast),
    opacity var(--transition-fast);
}

.music-header__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 90;
}

.music-header__drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 100vh;
  background: var(--color-bg-card);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding: var(--space-xl) var(--space-lg);
  transform: translateX(-100%);
  transition: transform var(--transition-normal);
  box-shadow: var(--shadow-lg);
}

.music-header__drawer--open {
  transform: translateX(0);
}

.music-header__drawer a {
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
  text-decoration: none;
  padding: var(--space-sm) 0;
  transition: color var(--transition-fast);
}

.music-header__drawer a:hover {
  color: var(--color-primary);
}

.music-header__nav--mobilphone {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 15px;
}

.music-header__bg--change {
  padding: 10px;
  box-shadow: var(--color-border);
  font-size: var(--font-size-base);
  cursor: pointer;
  border: var(--color-border) 2px solid;
  color: var(--color-primary-hover);
}

.music-header__bg--change:hover {
  background: rgba(187, 126, 198, 0.322);
}

:deep(.el-collapse-item__header) {
  background: var(--gradient-page);
  color: #fff;
  border-bottom: none;
}

:deep(.el-collapse-item__wrap) {
  background: var(--gradient-page);
  border-bottom: none;
}

:deep(.el-collapse-item__title) {
  color: var(--color-text-primary);
}

@media (max-width: 900px) {
  .music-header {
    gap: var(--space-md);
    padding: 0 var(--space-md);
    height: 56px;
  }

  .music-header__brand {
    font-size: var(--font-size-lg);
  }

  .music-header__nav {
    gap: var(--space-sm);
  }

  .music-header__nav a,
  .music-header__user a {
    font-size: var(--font-size-sm);
  }
}

@media (max-width: 600px) {
  .is-show {
    display: inline-flex;
  }
  .music-header {
    gap: var(--space-md);
    padding: 0 var(--space-md);
    height: 56px;
  }

  .music-header__nav,
  .music-header__user {
    display: none;
  }

  .music-header__hamburger {
    display: flex;
    margin-left: auto;
  }
}
</style>
