import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false)
  const userInfo = ref<UserInfo>({})

  function loadUserInfo(info: UserInfo) {
    userInfo.value.email = info?.email || userInfo.value.email
    userInfo.value.userId = info?.userId || userInfo.value.userId
    userInfo.value.username = info?.username || userInfo.value.username
    userInfo.value.nickname = info?.nickname || userInfo.value.nickname
  }

  return {
    isLogin,
    userInfo,
    loadUserInfo,
  }
})
