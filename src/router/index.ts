import { createRouter, createWebHistory } from 'vue-router'
import { homeRouter } from './modules/home'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    ...homeRouter,
    { path: '/:pathMatch(.*)*', redirect: '/home' },
  ],
})

export default router
