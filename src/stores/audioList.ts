import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'

export const useAudioListStore = defineStore('audioList', () => {
  // 批量选择状态
  const selectedMap = reactive<Record<string, true>>({})

  // 批量操作模式
  const isBatchMode = ref(false)

  // 选中数量
  const selectedCount = computed(() => Object.keys(selectedMap).length)

  // 判断是否选中
  function isSelected(source: string, id: number | string): boolean {
    return !!selectedMap[`${source}-${id}`]
  }

  // 切换选中状态
  function toggle(source: string, id: number | string) {
    const key = `${source}-${id}`
    selectedMap[key] ? delete selectedMap[key] : (selectedMap[key] = true)
  }

  // 清空选中
  function clearSelection() {
    Object.keys(selectedMap).forEach((key) => delete selectedMap[key])
  }

  // 获取选中的 key 列表
  function getSelectedKeys(): string[] {
    return Object.keys(selectedMap)
  }

  // 切换批量模式
  function toggleBatchMode() {
    isBatchMode.value = !isBatchMode.value
    if (!isBatchMode.value) {
      clearSelection()
    }
  }

  // 重置所有状态
  function reset() {
    isBatchMode.value = false
    clearSelection()
  }

  return {
    isBatchMode,
    selectedMap,
    selectedCount,
    isSelected,
    toggle,
    clearSelection,
    getSelectedKeys,
    toggleBatchMode,
    reset,
  }
})
