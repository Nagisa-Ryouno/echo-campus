<template>
  <!-- 移动端布局：取消手机壳 -->
  <div v-if="isMobile" class="mobile-layout">
    <div class="mobile-content">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <!-- TabBar 固定在底部 -->
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
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
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
/* 全局控制顶部偏移变量，PC端由于包含48px刘海状态栏，偏移48px；移动端直接贴顶 0 */
:root {
  --fixed-header-top: 48px;
}
:root.is-mobile {
  --fixed-header-top: 0px;
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

/* 移动端布局样式 */
.mobile-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh; /* 适配移动端浏览器动态高度 */
  overflow-x: hidden;
}

.mobile-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  min-height: 100vh;
}

.mobile-tabbar {
  flex-shrink: 0;
  width: 100%;
  z-index: 100;
  background: var(--echo-white);
  padding-bottom: env(safe-area-inset-bottom);
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
