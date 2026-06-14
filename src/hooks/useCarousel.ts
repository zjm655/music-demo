import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue'

interface CarouselOptions {
  totalPages: number
}

export function useCarousel(options: CarouselOptions) {
  const { totalPages } = options

  const currentPage = ref(0)
  const containerWidth = ref(0)
  const listsRef = ref<HTMLElement | null>(null) as Ref<HTMLElement | null>

  // Touch / drag state
  const touchStartX = ref(0)
  const touchDeltaX = ref(0)
  const isDragging = ref(false)
  let finalDelta = 0

  let resizeObserver: ResizeObserver | null = null

  // translateX = base page offset + live drag offset
  const listsStyle = computed(() => {
    const base = -currentPage.value * containerWidth.value
    const offset = base + touchDeltaX.value
    const transition = isDragging.value ? 'none' : 'transform 0.4s ease'
    return {
      transform: `translateX(${offset}px)`,
      transition,
    }
  })

  function prevPage() {
    currentPage.value = (currentPage.value - 1 + totalPages) % totalPages
  }

  function nextPage() {
    currentPage.value = (currentPage.value + 1) % totalPages
  }

  function goToPage(index: number) {
    currentPage.value = index
  }

  // function onTouchStart(e: TouchEvent) {
  //   isDragging.value = true
  //   touchStartX.value = e.touches[0].clientX
  //   touchDeltaX.value = 0
  //   finalDelta = 0
  // }
  function onTouchStart(e: TouchEvent) {
    const touch = e.changedTouches[0]
    if (!touch) return

    isDragging.value = true
    touchStartX.value = touch.clientX
    touchDeltaX.value = 0
    finalDelta = 0
  }

  // function onTouchMove(e: TouchEvent) {
  //   if (!isDragging.value) return
  //   finalDelta = e.touches[0].clientX - touchStartX.value
  //   touchDeltaX.value = finalDelta
  // }

  function onTouchMove(e: TouchEvent) {
    if (!isDragging.value) return
    const touch = e.changedTouches[0]
    if (!touch) return

    finalDelta = touch.clientX - touchStartX.value
    touchDeltaX.value = finalDelta
  }

  function onTouchEnd() {
    if (!isDragging.value) return
    isDragging.value = false
    touchDeltaX.value = 0

    const threshold = 50
    if (finalDelta < -threshold) {
      nextPage()
    } else if (finalDelta > threshold) {
      prevPage()
    }
    // Else: snap back (transition restores current page position)
  }

  // ResizeObserver
  onMounted(() => {
    if (listsRef.value) {
      containerWidth.value = listsRef.value.offsetWidth
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          containerWidth.value = entry.contentRect.width
        }
      })
      resizeObserver.observe(listsRef.value)
    }
  })

  onBeforeUnmount(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  })

  return {
    currentPage,
    listsRef,
    listsStyle,
    prevPage,
    nextPage,
    goToPage,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}
