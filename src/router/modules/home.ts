export const homeRouter = [
  {
    path: '/home',
    name: 'MusicHome',
    component: () => import('@/views/MusicHome.vue'),
  },
  {
    path: '/login',
    name: 'MusicLogin',
    component: () => import('@/views/MusicLogin.vue'),
    meta: {
      hideAudio: true,
    },
  },
  {
    path: '/user-center',
    name: 'UserCenter',
    component: () => import('@/views/UserCenter.vue'),
  },
  {
    path: '/playlist',
    name: 'MusicPlaylist',
    component: () => import('@/views/MusicPlaylist.vue'),
  },
]
