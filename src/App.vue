<template>
  <PhoneShell :show-tab-bar="showTabBar">
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PhoneShell from '@/components/layout/PhoneShell.vue'
import TabBar from '@/components/layout/TabBar.vue'

const route = useRoute()
const showTabBar = computed(() => route.meta.tabBar !== false)
</script>

<style scoped>
.app-inner {
  min-height: 100%;
  max-width: 375px;
  overflow-x: hidden;
  box-sizing: border-box;
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
