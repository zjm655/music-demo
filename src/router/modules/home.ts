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
    redirect: '/playlist/audio',
    component: () => import('@/views/MusicPlaylist.vue'),
    children: [
      {
        path: 'audio',
        name: 'AudioPlaylist',
        component: () => import('@/views/AudioPlaylist.vue'),
      },
    ],
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
