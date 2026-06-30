import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * 监听滚动状态 — 自动适配 PC 端（#phone-screen）和移动端（window）
 *
 * 使用 requestAnimationFrame 节流，避免阻塞主线程。
 * 只修改 ref 状态，由 CSS class/transition 处理视觉变化。
 *
 * @param {number} threshold - 判定"已滚动"的像素阈值，默认 1px
 * @returns {{ scrollY, isScrolled, direction }}
 *   - scrollY: 当前滚动偏移 (px)
 *   - isScrolled: scrollY > threshold
 *   - direction: 'up' | 'down' | 'idle'  滚动方向
 */
export function useScrollCollapse(threshold = 1) {
  const scrollY = ref(0)
  const isScrolled = ref(false)
  const direction = ref('idle')

  let scrollEl = null
  let ticking = false
  let lastY = 0
  let isWindowScroll = false

  function getScrollY() {
    if (isWindowScroll) {
      return window.scrollY || document.documentElement.scrollTop
    }
    return scrollEl ? scrollEl.scrollTop : 0
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = getScrollY()
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
    // PC 端：监听 phone-screen 容器
    scrollEl =
      document.getElementById('phone-screen') ||
      document.querySelector('.phone-screen')

    if (scrollEl) {
      // PC 端：监听 phone-screen
      isWindowScroll = false
      scrollEl.addEventListener('scroll', onScroll, { passive: true })
      scrollY.value = scrollEl.scrollTop
    } else {
      // 移动端：监听 window 滚动
      isWindowScroll = true
      window.addEventListener('scroll', onScroll, { passive: true })
      scrollY.value = window.scrollY || document.documentElement.scrollTop
    }
  })

  onBeforeUnmount(() => {
    if (isWindowScroll) {
      window.removeEventListener('scroll', onScroll)
    } else if (scrollEl) {
      scrollEl.removeEventListener('scroll', onScroll)
    }
    ticking = false
  })

  return { scrollY, isScrolled, direction }
}
