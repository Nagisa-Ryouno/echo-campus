<template>
  <!-- 移动端布局：取消手机壳，TabBar 全局 fixed 在底�?-->
  <div v-if="isMobile" id="phone-screen" class="mobile-layout">
    <!-- 页面内容区：正常文档流，不添加任何人工滚动容�?-->
    <div class="mobile-content">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <!-- TabBar：全局 fixed 在视口底部，不进入文档流 -->
    <div v-if="showTabBar" class="mobile-tabbar">
      <TabBar />
    </div>
  </div>

  <!-- PC端布局：保留手机壳 -->
  <PhoneShell v-else :show-tab-bar="showTabBar">
    <!-- 内容�?-->
    <template #content>
      <div class="app-inner">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </template>
    <!-- TabBar 固定�?phone-screen 下方，永不滚�?-->
    <template #tabbar>
      <TabBar />
    </template>
  </PhoneShell>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import PhoneShell from '@/components/layout/PhoneShell.vue'
import TabBar from '@/components/layout/TabBar.vue'

const route = useRoute()
const showTabBar = computed(() => route.meta.tabBar === true)

const isMobile = ref(false)

const checkDevice = () => {
  isMobile.value = window.innerWidth <= 768
}

watch(isMobile, (newVal) => {
  if (newVal) {
    document.documentElement.classList.add('is-mobile')
    document.documentElement.classList.remove('is-pc')
  } else {
    document.documentElement.classList.add('is-pc')
    document.documentElement.classList.remove('is-mobile')
  }
}, { immediate: true })

onMounted(() => {
  checkDevice()
  window.addEventListener('resize', checkDevice)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkDevice)
})
</script>

<style>
/* 全局控制顶部偏移变量，PC端由于包�?8px刘海状态栏，偏�?8px；移动端直接贴顶 0 */
:root {
  --fixed-header-top: 48px;
  --tabbar-height: 60px;
}
:root.is-mobile {
  --fixed-header-top: 0px;
}

/* 移动端：确保 body �?html 可以自然滚动，不被任何外层截�?*/
html.is-mobile,
html.is-mobile body {
  /* 禁止固定视口高度 �?允许页面内容自然延伸 */
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

/* ══════════════════════════════════════════════════�?   移动端布局�?   - .mobile-layout: 根容器，不要固定高度，允许内容延�?   - .mobile-content: 页面内容区，自然流，无溢出截�?   - .mobile-tabbar: position fixed，贴在视口底部，不占文档流空�?   ══════════════════════════════════════════════════�?*/

.mobile-layout {
  /* 宽度撑满，高度由内容决定，禁止裁�?*/
  width: 100%;
  /* 不设�?height/min-height，避免触发双倍高�?*/
  overflow-x: hidden;
}

.mobile-content {
  /* 内容区自然延伸，不约束高�?*/
  width: 100%;
  overflow-x: hidden;
  /* 底部留出 TabBar 高度，避免最后内容被遮挡 */
  padding-bottom: calc(var(--tabbar-height) + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.mobile-tabbar {
  /* �?核心：TabBar 必须 position: fixed，不在文档流�?*/
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  /* 安全区支�?*/
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
  /* 极高 z-index，覆盖所有页面内�?*/
  z-index: 9000;
  background: var(--echo-white);
  /* 顶部边框 */
  border-top: 1px solid var(--echo-border);
}

/* 路由切换淡入淡出（只�?opacity，禁�?transform，避免污�?fixed 定位�?*/
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.18s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
