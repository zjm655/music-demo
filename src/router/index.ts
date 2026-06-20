import { createRouter, createWebHistory } from 'vue-router'
import { homeRouter } from './modules/home'
import { playlistRouter } from './modules/playlist'
import { useAudioStore } from '@/stores/audio'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    ...homeRouter,
    ...playlistRouter,
    { path: '/:pathMatch(.*)*', redirect: '/home' },
  ],
})

router.beforeEach((to, _from) => {
  const token = localStorage.getItem('token')
  if ((!token || !useUserStore().isLogin) && to.meta.requireAuth) {
    return '/login'
  }

  if (to.path === '/login' && token) {
    return '/home'
  }

  if (to.meta.hideAudio) {
    useAudioStore().showPlaylist = false
  } else {
    useAudioStore().showPlaylist = true
  }

  return true
})

export default router
