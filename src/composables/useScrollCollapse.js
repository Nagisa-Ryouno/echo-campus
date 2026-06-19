import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * 监听 .phone-screen 的滚动状态
 *
 * 使用 requestAnimationFrame 节流，避免阻塞主线程。
 * 所有页面共享同一个滚动容器 (#phone-screen)，因此
 * 该 composable 在各页面独立挂载/卸载是安全的。
 *
 * @param {number} threshold - 判定"已滚动"的像素阈值，默认 4px
 * @returns {{ scrollY, isScrolled, direction }}
 *   - scrollY: 当前滚动偏移 (px)
 *   - isScrolled: scrollY > threshold
 *   - direction: 'up' | 'down' | 'idle'  滚动方向
 */
export function useScrollCollapse(threshold = 4) {
  const scrollY = ref(0)
  const isScrolled = ref(false)
  const direction = ref('idle')

  let scrollEl = null
  let ticking = false
  let lastY = 0

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = scrollEl.scrollTop
        scrollY.value = y
        isScrolled.value = y > threshold

        if (y > lastY + 2) direction.value = 'down'
        else if (y < lastY - 2) direction.value = 'up'
        else direction.value = 'idle'

        lastY = y
        ticking = false
      })
      ticking = true
    }
  }

  onMounted(() => {
    scrollEl =
      document.getElementById('phone-screen') ||
      document.querySelector('.phone-screen')
    if (scrollEl) {
      scrollEl.addEventListener('scroll', onScroll, { passive: true })
      // 初始化时读取一次当前滚动位置
      scrollY.value = scrollEl.scrollTop
    }
  })

  onBeforeUnmount(() => {
    if (scrollEl) {
      scrollEl.removeEventListener('scroll', onScroll)
    }
    ticking = false
  })

  return { scrollY, isScrolled, direction }
}
