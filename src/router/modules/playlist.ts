export const playlistRouter = [
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
      {
        path: 'search',
        name: 'AudioSearch',
        component: () => import('@/views/AudioSearch.vue'),
      },
      {
        path: 'my-playlists',
        name: 'MyPlaylists',
        component: () => import('@/views/MyPlaylists.vue'),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: 'playlist-detail',
        name: 'PlaylistDetail',
        component: () => import('@/views/PlaylistDetail.vue'),
        meta: {
          requireAuth: true,
        },
      },
    ],
  },
]
