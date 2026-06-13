<script setup lang="ts"></script>

<template>
  <div class="app-header">
    <h1 class="app-header__top--title">音乐平台</h1>
    <nav class="app-nav">
      <div class="app-nav__link">
        <router-link to="/home" active-class="app-nav__link--active">首页</router-link>
        <router-link to="/">音乐排行</router-link>
        <router-link to="/">推荐歌单</router-link>
        <router-link to="/">我的歌单</router-link>
      </div>
      <div class="app-header__input--serch">
        <input type="text" name="" id="" />
        <button>搜索</button>
      </div>
      <div class="app-nav__link">
        <router-link to="/">个人中心</router-link>
        <router-link to="/">登陆</router-link>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  gap: 5px;
  width: clamp(80vw, calc(75vw + 150px), 93vw);
  border-bottom: 1px solid var(--color-border-soft);
  height: 90px;
  display: flex;
}
.app-header__top--title {
  padding: 5px;
  font-size: clamp(var(--font-size-base), 5vw, var(--font-size-2xl));
  color: var(--color-text-primary);
  cursor: pointer;
}

.app-nav {
  display: flex;
  gap: 10px;
  width: 80%;
}

.app-nav__link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex: 1;
}

.app-nav__link--active {
  color: var(--color-secondary-hover);
}

.app-header__input--serch {
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
