<template>
  <div class="tabbar-wrapper">
    <div
      v-for="item in tabs"
      :key="item.key"
      class="tabbar-item"
      :class="{
        'tabbar-item--active': current === item.key,
        'tabbar-item--publish': item.key === 'publish'
      }"
      @click="onTabClick(item)"
    >
      <div class="tabbar-icon" v-html="item.icon"></div>
      <span class="tabbar-label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabs = [
  {
    key: 'home',
    label: '首页',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    route: '/home'
  },
  {
    key: 'discover',
    label: '发现',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    route: '/discover'
  },
  {
    key: 'publish',
    label: '发布',
    icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    route: '/post/create'
  },
  {
    key: 'message',
    label: '消息',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    route: '/message'
  },
  {
    key: 'profile',
    label: '我',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    route: '/profile/me'
  }
]

const current = computed(() => {
  const name = route.name
  const map = {
    PostCreate: 'publish',
    Home: 'home',
    Discover: 'discover',
    Message: 'message',
    MyProfile: 'profile',
    PostDetail: 'home',
    UserProfile: 'profile'
  }
  return map[name] || ''
})

const showTabBar = computed(() => route.meta.tabBar !== false)

function onTabClick(tab) {
  if (tab.key === 'publish') {
    router.push(tab.route)
  } else {
    router.push(tab.route)
  }
}

defineExpose({ showTabBar })
</script>

<style scoped>
.tabbar-wrapper {
  width: 100%;
  height: 56px;
  background: var(--echo-white);
  border-top: 1px solid var(--echo-border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: 4px;
}

.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 0;
}

.tabbar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--echo-text-hint);
  transition: color 0.2s ease;
}

.tabbar-label {
  font-size: 10px;
  color: var(--echo-text-hint);
  transition: color 0.2s ease;
}

.tabbar-item--active .tabbar-icon {
  color: var(--echo-primary);
}

.tabbar-item--active .tabbar-label {
  color: var(--echo-primary);
  font-weight: 600;
}

.tabbar-item--publish .tabbar-icon {
  background: var(--echo-primary);
  color: var(--echo-white);
  width: 44px;
  height: 44px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(76, 175, 125, 0.4);
  margin-top: -14px;
}

.tabbar-item--publish .tabbar-label {
  margin-top: 2px;
}
</style>
