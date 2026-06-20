import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 定义背景图列表
  const backgrounds = ref([
    '/background/image1.png',
    '/background/image2.png',
    '/background/image3.png',
  ])

  // 当前选中的背景索引
  const currentBgIndex = ref(0)

  // 是否是暗黑模式
  // const isDark = ref(false)

  // 计算属性：获取当前背景 URL
  const currentBackground = computed(() => backgrounds.value[currentBgIndex.value])

  // 切换背景的方法
  function setBg(index: number) {
    currentBgIndex.value = index
  }

  // // 切换暗黑模式
  // function toggleDark() {
  //   isDark.value = !isDark.value
  //   // 在这里直接操作 DOM，保证 Store 和 UI 同步
  //   if (isDark.value) {
  //     document.documentElement.classList.add('dark')
  //   } else {
  //     document.documentElement.classList.remove('dark')
  //   }
  // }

  return {
    backgrounds,
    currentBackground,
    setBg,
  }
})
