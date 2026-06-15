import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'

export const homeRouter = [
  {
    path: '/home',
    name: 'MyHome',
    component: () => import('@/views/MusicHome.vue'),
  },
  {
    path: '/login',
    name: 'MusicLogin',
    component: () => import('@/views/MusicLogin.vue'),
  },
  {
    path: '/user-center',
    name: 'UserCenter',
    component: () => import('@/views/UserCenter.vue'),
  },
]
