import { createRouter, createWebHistory } from 'vue-router'
import { homeRouter } from './modules/home'
import { useAudioStore } from '@/stores/audio'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    ...homeRouter,
    { path: '/:pathMatch(.*)*', redirect: '/home' },
  ],
})

router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')
  if (!token && to.meta.requireAuth) {
    return '/login'
  }

  if (to.meta.hideAudio) {
    useAudioStore().showPlaylist = false
  } else {
    useAudioStore().showPlaylist = true
  }
  // else if (to.path === '/login' && token) {
  //   return '/home'
  // }

  // if ((to.path === '/login' || to.path === '/register') && token) {
  //   return '/home'
  // }

  return true
})

export default router
