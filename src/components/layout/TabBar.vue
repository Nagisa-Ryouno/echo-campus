<template>
  <div class="tabbar-wrapper">
    <!-- 弧形分割线 -->
    <svg class="tabbar-border-svg" viewBox="0 0 375 16" preserveAspectRatio="none">
      <!-- 仅用于填充白色背景以遮挡下方内容，无边框 -->
      <path
        d="M -1 15 L 148 15 C 162 15, 168 1, 187.5 1 C 207 1, 213 15, 227 15 L 376 15 L 376 16 L -1 16 Z"
        fill="var(--echo-white)"
      />
      <!-- 仅用于描绘顶部分割线 -->
      <path
        d="M -1 15 L 148 15 C 162 15, 168 1, 187.5 1 C 207 1, 213 15, 227 15 L 376 15"
        fill="none"
        stroke="var(--echo-border)"
        stroke-width="1.2"
      />
    </svg>
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
      <!-- 消息红点 -->
      <div v-if="item.key === 'message' && totalUnread > 0" class="tabbar-badge">
        {{ totalUnread > 99 ? '99+' : totalUnread }}
      </div>
      <span class="tabbar-label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app.js'

const router = useRouter()
const route = useRoute()
const store = useAppStore()

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

const totalUnread = computed(() =>
  store.unreadChatCount + store.unreadLikeCount +
  store.unreadCommentAtCount + store.unreadFollowerCount + store.unreadAnonCount
)

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
  if (['publish', 'message', 'profile'].includes(tab.key)) {
    if (!store.checkAuth(tab.key)) {
      return
    }
  }
  router.push(tab.route)
}

defineExpose({ showTabBar })
</script>

<style scoped>
.tabbar-wrapper {
  width: 100%;
  height: 56px;
  background: var(--echo-white);
  border-top: none; /* 去掉平直的 border-top */
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: 4px;
  position: relative;
}

.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  cursor: pointer;
  transition: all var(--echo-transition-normal);
  flex: 1;
  min-width: 0;
  position: relative;
}

.tabbar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--echo-text-hint);
  transition: color var(--echo-transition-normal);
  position: relative;
}

.tabbar-label {
  font-size: 10px;
  color: var(--echo-text-hint);
  transition: color var(--echo-transition-normal);
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
  color: #ffffff;
  width: 44px;
  height: 44px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(76, 175, 125, 0.4);
  margin-top: -14px;
  z-index: 5; /* 确保层叠在弧线之上 */
}

.tabbar-item--publish .tabbar-label {
  margin-top: 2px;
}

/* 消息红点 */
.tabbar-badge {
  position: absolute;
  top: 1px;
  right: calc(50% - 20px);
  min-width: 16px;
  height: 16px;
  padding: 0 4.5px;
  background: #ff3b30;
  color: #fff;
  font-size: 9.5px;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
  border-radius: 10px;
  border: 1.5px solid #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  line-height: 1;
}

/* 弧度分割线 */
.tabbar-border-svg {
  position: absolute;
  top: -15px; /* y=15 刚好与 TabBar 的 top=0 对齐 */
  left: 0;
  right: 0;
  width: 100%;
  height: 16px;
  pointer-events: none;
  z-index: 1;
}
</style>
