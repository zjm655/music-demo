<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { Moon, Sunny, ArrowDown } from '@element-plus/icons-vue'
const bgMode = ref(false)
function changeBgMode() {
  document.documentElement.classList.toggle('dark')
}

const backgroundImage = reactive([
  '/background/image1.png',
  '/background/image2.png',
  '/background/image3.png',
])

const drawer = ref(false)
</script>

<template>
  <div class="music-header">
    <h1 class="music-header__brand">音乐平台</h1>
    <nav class="music-header__nav">
      <router-link to="/home" active-class="music-header__link--active">首页</router-link>
      <router-link to="/">音乐排行</router-link>
      <router-link to="/">推荐歌单</router-link>
      <router-link to="/">我的歌单</router-link>
    </nav>
    <div class="music-header__search">
      <input type="text" class="music-header__input" placeholder="搜索歌曲、歌手" />
      <button class="music-header__btn">
        <el-icon><Search /></el-icon>
      </button>
    </div>
    <nav class="music-header__user">
      <router-link to="/">个人中心</router-link>
      <router-link to="/">登录</router-link>
      <el-dropdown>
        <el-button type="primary" style="background-color: var(--color-primary-active)">
          切换背景图片<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(imageSrc, index) in backgroundImage" :key="index"
              ><el-image style="width: 100px; height: 90px" :src="imageSrc"></el-image
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
        <router-link to="/">登录</router-link>
        <router-link to="/">音乐排行</router-link>
        <router-link to="/">推荐歌单</router-link>
        <router-link to="/">我的歌单</router-link>
        <router-link to="/">个人中心</router-link>
        <el-switch
          v-model="bgMode"
          style="--el-switch-on-color: var(--color-primary-active)"
          @click="changeBgMode"
          :active-action-icon="Moon"
          :inactive-action-icon="Sunny"
        ></el-switch>
        <el-dropdown>
          <el-button type="primary" style="background-color: var(--color-primary-active)">
            切换背景图片<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(imageSrc, index) in backgroundImage" :key="index"
                ><el-image style="width: 100px; height: 90px" :src="imageSrc"></el-image
              ></el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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

/* Search bar */
.music-header__search {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  flex-shrink: 0;
}

.music-header__input {
  width: 180px;
  height: 32px;
  padding: 0 var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-input-bg);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  outline: none;
  transition:
    border-color var(--transition-fast),
    width var(--transition-normal);
}

.music-header__input:focus {
  border-color: var(--color-border-focus);
  width: 220px;
}

.music-header__input::placeholder {
  color: var(--color-input-placeholder);
}

.music-header__btn {
  height: 32px;
  padding: 0 var(--space-md);
  border: none;
  border-radius: var(--radius-sm);
  background: var(--gradient-primary);
  color: var(--color-text-inverse);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.music-header__btn:hover {
  opacity: 0.85;
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

  .music-header__input {
    width: 120px;
  }

  .music-header__input:focus {
    width: 160px;
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

  .music-header__search {
    flex: 1;
    min-width: 0;
  }

  .music-header__input {
    width: 100%;
    flex: 1;
  }

  .music-header__input:focus {
    width: 100%;
  }

  .music-header__btn {
    flex-shrink: 0;
  }
}
</style>
