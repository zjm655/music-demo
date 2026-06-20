import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import type { UnifiedSearchResult } from '@/hooks/common'

export const useSearchStore = defineStore('search', () => {
  // 搜索关键词
  const keyword = ref('')
  // 当前页码
  const page = ref(1)
  // 每页条数
  const pageSize = ref(20)
  // 所有搜索结果（本地分页用）
  const allResults = ref<UnifiedSearchResult[]>([])

  // 批量选择状态（响应式对象当集合用）
  const selectedMap = reactive<Record<string, true>>({})

  // 总页数（从实际结果计算）
  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(allResults.value.length / pageSize.value))
  })

  // 当前页显示的结果
  const currentPageResults = computed(() => {
    const start = (page.value - 1) * pageSize.value
    const end = start + pageSize.value
    return allResults.value.slice(start, end)
  })

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

  // 获取选中的key列表
  function getSelectedKeys(): string[] {
    return Object.keys(selectedMap)
  }

  // 设置搜索关键词（重置页码）
  function setKeyword(val: string) {
    keyword.value = val
    page.value = 1
  }

  // 设置页码
  function setPage(val: number) {
    page.value = Math.max(1, Math.min(val, totalPages.value))
  }

  // 设置所有结果
  function setAllResults(results: UnifiedSearchResult[]) {
    allResults.value = results
    page.value = 1
  }

  return {
    keyword,
    page,
    pageSize,
    allResults,
    totalPages,
    currentPageResults,
    selectedMap,
    selectedCount,
    isSelected,
    toggle,
    clearSelection,
    getSelectedKeys,
    setKeyword,
    setPage,
    setAllResults,
  }
})
