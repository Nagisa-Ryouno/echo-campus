<template>
  <div class="circle-page">
    <!-- 返回+标题栏 -->
    <div class="circle-header">
      <div class="nav-back" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </div>
      <h2 class="circle-title">我的圈子</h2>
    </div>

    <!-- Tab 栏：固定占据真实空间 -->
    <div class="circle-tabs-fixed">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        class="circle-tab"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 圈子内容（可滚动） -->
    <div class="circle-scroll-area">
    <div class="circle-body">
      <!-- 我加入的 -->
      <div v-if="activeTab === 'joined'" class="circle-list">
        <div v-if="joinedCircles.length === 0" class="echo-empty">
          <div class="echo-empty-icon">🌐</div>
          <p class="echo-empty-text">还没有加入任何圈子</p>
          <p class="echo-empty-hint">去发现更多圈子吧</p>
        </div>
        <div
          v-for="circle in joinedCircles"
          :key="circle.id"
          class="circle-card"
          @click="$router.push('/circle/' + circle.id)"
        >
          <div class="circle-card-header">
            <div class="circle-icon" :style="{ background: circle.color }">
              {{ circle.icon }}
            </div>
            <div class="circle-info">
              <div class="circle-name">
                {{ circle.name }}
                <span v-if="circle.official" class="circle-badge-official">官方</span>
                <span v-if="circle.isAnon" class="circle-badge-anon">匿名</span>
              </div>
              <div class="circle-meta">{{ circle.memberCount }} 成员 · {{ circle.postCount }} 帖子</div>
            </div>
            <div class="circle-new-badge" v-if="circle.unread > 0">{{ circle.unread }}</div>
          </div>
          <p class="circle-desc">{{ circle.description }}</p>
          <div class="circle-latest" v-if="circle.latestPost">
            <span class="latest-label">最新：</span>
            <span class="latest-text">{{ circle.latestPost }}</span>
          </div>
        </div>
      </div>
 
      <!-- 推荐圈子 -->
      <div v-if="activeTab === 'recommend'" class="circle-list">
        <div
          v-for="circle in recommendCircles"
          :key="circle.id"
          class="circle-card"
          @click="$router.push('/circle/' + circle.id)"
        >
          <div class="circle-card-header">
            <div class="circle-icon" :style="{ background: circle.color }">
              {{ circle.icon }}
            </div>
            <div class="circle-info">
              <div class="circle-name">
                {{ circle.name }}
                <span v-if="circle.official" class="circle-badge-official">官方</span>
                <span v-if="circle.isAnon" class="circle-badge-anon">匿名</span>
              </div>
              <div class="circle-meta">{{ circle.memberCount }} 成员 · {{ circle.postCount }} 帖子</div>
            </div>
            <button class="join-btn" @click.stop="onJoin(circle.id)">
              {{ circle.joined ? '已加入' : '+ 加入' }}
            </button>
          </div>
          <p class="circle-desc">{{ circle.description }}</p>
        </div>
      </div>
    </div>
    </div><!-- /circle-scroll-area -->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useAppStore } from '@/stores/app.js'

const store = useAppStore()

onMounted(() => { store.lockPhoneScroll() })
onBeforeUnmount(() => { store.unlockPhoneScroll() })

const activeTab = ref('joined')

const tabs = [
  { key: 'joined', label: '已加入' },
  { key: 'recommend', label: '推荐' }
]

import { computed } from 'vue'
import { showToast } from 'vant'

const joinedCircles = computed(() => {
  return store.circles.filter(c => c.joined)
})

const recommendCircles = computed(() => {
  return store.circles.filter(c => !c.joined)
})

function onJoin(circleId) {
  const success = store.joinCircle(circleId)
  if (success) {
    showToast('加入圈子成功')
  }
}
</script>

<style scoped>
/* ===== 页面容器：absolute 填满 + flex column ===== */
.circle-page {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--echo-bg);
}

/* ===== 返回+标题栏 ===== */
.circle-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: var(--echo-white);
  flex-shrink: 0;
}

.nav-back {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--echo-transition-fast);
  color: var(--echo-text);
}

.nav-back:active {
  background: var(--echo-bg);
}

.circle-title {
  font-size: var(--echo-text-xl);
  font-weight: var(--echo-weight-bold);
  color: var(--echo-text);
}

/* ===== Tab 栏：固定占据真实空间，纯白底+阴影+分割线 ===== */
.circle-tabs-fixed {
  display: flex;
  flex-shrink: 0;
  background: #fff;
  border-bottom: 1px solid var(--echo-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  z-index: 2;
}

.circle-tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: var(--echo-text-base);
  color: var(--echo-text-secondary);
  cursor: pointer;
  position: relative;
  transition: all var(--echo-transition-fast);
}

.circle-tab.active {
  color: var(--echo-primary);
  font-weight: var(--echo-weight-semibold);
}

.circle-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  border-radius: 2px;
  background: var(--echo-primary);
}

/* ===== 可滚动内容区 ===== */
.circle-scroll-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  min-height: 0;
  position: relative;
  z-index: 1;
}

/* ===== 列表 ===== */
.circle-body {
  padding: 0 0 20px 0;
}

.circle-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ===== 圈子卡片 ===== */
.circle-card {
  background: var(--echo-white);
  border-radius: 0;
  padding: 16px;
  border-bottom: 1px solid var(--echo-border);
  transition: background-color var(--echo-transition-fast);
}

.circle-card:active {
  background: var(--echo-bg);
}

.circle-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.circle-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.circle-info {
  flex: 1;
  min-width: 0;
}

.circle-name {
  font-size: var(--echo-text-lg);
  font-weight: var(--echo-weight-semibold);
  color: var(--echo-text);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.circle-badge-official {
  font-size: var(--echo-text-2xs);
  padding: 1px 6px;
  border-radius: var(--echo-radius-xs);
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  font-weight: var(--echo-weight-semibold);
}

.circle-badge-anon {
  font-size: var(--echo-text-2xs);
  padding: 1px 6px;
  border-radius: var(--echo-radius-xs);
  background: #f0e6ff;
  color: #7c3aed;
  font-weight: var(--echo-weight-semibold);
}

.circle-meta {
  font-size: var(--echo-text-sm);
  color: var(--echo-text-hint);
  margin-top: 2px;
}

.circle-new-badge {
  min-width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  padding: 0 6px;
  background: var(--echo-danger);
  color: #fff;
  font-size: var(--echo-text-2xs);
  font-weight: var(--echo-weight-bold);
  border-radius: 10px;
  flex-shrink: 0;
}

.join-btn {
  padding: 6px 14px;
  border: 1.5px solid var(--echo-primary);
  border-radius: var(--echo-radius-full);
  background: transparent;
  color: var(--echo-primary);
  font-size: var(--echo-text-sm);
  font-weight: var(--echo-weight-medium);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--echo-transition-fast);
  white-space: nowrap;
  flex-shrink: 0;
}

.join-btn:active {
  background: var(--echo-primary-light);
  transform: scale(0.95);
}

.circle-desc {
  font-size: var(--echo-text-sm);
  color: var(--echo-text-secondary);
  line-height: 1.5;
  margin-bottom: 8px;
}

.circle-latest {
  font-size: var(--echo-text-sm);
  color: var(--echo-text-hint);
  padding-top: 8px;
  border-top: 1px solid var(--echo-divider);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.latest-label {
  color: var(--echo-primary);
  font-weight: var(--echo-weight-medium);
}

.latest-text {
  color: var(--echo-text-hint);
}
</style>
