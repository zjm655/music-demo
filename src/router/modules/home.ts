export const homeRouter = [
  {
    path: '/home',
    name: 'MyHome',
    component: () => import('@/views/MusicHome.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/MusicLogin.vue'),
  },
]
