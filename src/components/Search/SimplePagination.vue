<script setup lang="ts">
import { ref, watch } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

interface Props {
  currentPage: number
  totalPages: number
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  totalPages: 1,
})

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const inputVal = ref(String(props.currentPage))
const isEditing = ref(false)

// 同步外部页码变化
watch(
  () => props.currentPage,
  (val) => {
    if (!isEditing.value) {
      inputVal.value = String(val)
    }
  }
)

function handlePrev() {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1)
  }
}

function handleNext() {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1)
  }
}

function handleInputClick() {
  isEditing.value = true
}

function handleInputBlur() {
  isEditing.value = false
  inputVal.value = String(props.currentPage)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    const num = parseInt(inputVal.value, 10)
    if (!isNaN(num) && num >= 1 && num <= props.totalPages) {
      emit('page-change', num)
    } else {
      inputVal.value = String(props.currentPage)
    }
    isEditing.value = false
  }
}
</script>

<template>
  <div class="simple-pagination">
    <button
      class="simple-pagination__btn"
      :disabled="props.currentPage <= 1"
      @click="handlePrev"
    >
      <el-icon :size="14"><ArrowLeft /></el-icon>
    </button>

    <input
      class="simple-pagination__input"
      :value="inputVal"
      @input="inputVal = ($event.target as HTMLInputElement).value"
      @click="handleInputClick"
      @blur="handleInputBlur"
      @keydown="handleKeydown"
    />

    <button
      class="simple-pagination__btn"
      :disabled="props.currentPage >= props.totalPages"
      @click="handleNext"
    >
      <el-icon :size="14"><ArrowRight /></el-icon>
    </button>
  </div>
</template>

<style scoped>
.simple-pagination {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm, 8px);
}

.simple-pagination__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius-sm, 6px);
  background: var(--color-bg-card, #fff);
  color: var(--color-text-primary, #1f2937);
  cursor: pointer;
  transition: all var(--transition-fast, 0.15s);
}

.simple-pagination__btn:hover:not(:disabled) {
  border-color: var(--color-primary, #8b5cf6);
  color: var(--color-primary, #8b5cf6);
}

.simple-pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.simple-pagination__input {
  width: 40px;
  height: 28px;
  text-align: center;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius-sm, 6px);
  background: var(--color-bg-card, #fff);
  color: var(--color-text-primary, #1f2937);
  font-size: var(--font-size-sm, 13px);
  outline: none;
  transition: border-color var(--transition-fast, 0.15s);
}

.simple-pagination__input:focus {
  border-color: var(--color-primary, #8b5cf6);
}
</style>
