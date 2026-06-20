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
    userInfo.value.bio = info?.bio ?? userInfo.value.bio
    userInfo.value.gender = info?.gender ?? userInfo.value.gender
    userInfo.value.hobby = info?.hobby ?? userInfo.value.hobby
    userInfo.value.avatar = info?.avatar || userInfo.value.avatar
    userInfo.value.createTime = info?.createTime || userInfo.value.createTime
  }

  return {
    isLogin,
    userInfo,
    loadUserInfo,
  }
})
