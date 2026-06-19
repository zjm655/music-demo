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
    meta:{
      requireAuth:true,
      hideAudio:true
    },
    component: () => import('@/views/UserCenter.vue'),
  },
  {
    path: '/video',
    name: 'MvVideo',
    component: () => import('@/views/MvVideo.vue'),
    meta: {
      hideAudio: true,
    },
  },
]
