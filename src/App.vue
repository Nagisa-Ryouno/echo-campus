<template>
  <!-- 移动端布局：取消手机壳，TabBar 全局 fixed 在底部 -->
  <div v-if="isMobile" id="phone-screen" class="mobile-layout">
    <!-- 页面内容区：正常文档流，不添加任何人工滚动容器 -->
    <div class="mobile-content">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
    <!-- TabBar：全局 fixed 在视口底部，不进入文档流 -->
    <div v-if="showTabBar" class="mobile-tabbar">
      <TabBar />
    </div>
  </div>

  <!-- PC端布局：保留手机壳 -->
  <PhoneShell v-else :show-tab-bar="showTabBar">
    <!-- 内容区 -->
    <template #content>
      <div class="app-inner">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
    </template>
    <!-- TabBar 固定在 phone-screen 下方，永不滚动 -->
    <template #tabbar>
      <TabBar />
    </template>
  </PhoneShell>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import PhoneShell from '@/components/layout/PhoneShell.vue'
import TabBar from '@/components/layout/TabBar.vue'

const route = useRoute()

// 根据路由 meta 属性判定是否展示 TabBar 导航栏
// tabBar === true 且 hideTabBar !== true 时显示
const store = useAppStore()
const showTabBar = computed(() => route.meta.tabBar === true && route.meta.hideTabBar !== true && !store.isChatOpen)

// 仅在应用初始化时检测一次设备类型，禁止在 resize 时动态销毁重建布局树和组件树，从源头上保障运行稳定性
const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false

// 初始化时一次性向 html 元素注入相应的设备类名，用于全局媒体和滚动偏移样式适配
if (isMobile) {
  document.documentElement.classList.add('is-mobile')
  document.documentElement.classList.remove('is-pc')
} else {
  document.documentElement.classList.add('is-pc')
  document.documentElement.classList.remove('is-mobile')
}
</script>

<style>
/* 全局控制顶部偏移变量，PC端由于包含48px刘海状态栏，偏移48px；移动端直接贴顶 0 */
:root {
  --fixed-header-top: 48px;
  --tabbar-height: 56px;
}
:root.is-mobile {
  --fixed-header-top: 0px;
}

/* 移动端：确保 body 和 html 可以自然滚动，不被任何外层截断 */
html.is-mobile,
html.is-mobile body {
  height: auto;
  min-height: 100%;
  overflow-x: hidden;
}
</style>

<style scoped>
.app-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
  max-width: 375px;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* ═══════════════════════════════════════════════════
   移动端布局：
   - .mobile-layout: 根容器，不要固定高度，允许内容延伸
   - .mobile-content: 页面内容区，自然流，无溢出截断
   - .mobile-tabbar: position fixed，贴在视口底部，不占文档流空间，规范层级
   ═══════════════════════════════════════════════════ */

.mobile-layout {
  width: 100%;
  overflow-x: hidden;
}

.mobile-content {
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* 动态给 mobile-content 添加 padding-bottom，避免内容被 fixed 底部导航遮挡 */
/* 仅在展示 TabBar 时添加 */
.mobile-layout:has(.mobile-tabbar) .mobile-content {
  padding-bottom: calc(var(--tabbar-height) + env(safe-area-inset-bottom));
}

.mobile-tabbar {
  /* TabBar 必须使用规范的 fixed 底部固定，不占文档流空间 */
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
  z-index: 1000; /* Z_INDEX.TABBAR */
  background: var(--echo-white);
  border-top: 1px solid var(--echo-border);
}
</style>
