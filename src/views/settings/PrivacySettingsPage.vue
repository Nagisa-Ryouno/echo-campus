<template>
  <div class="privacy-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <div class="nav-back" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </div>
      <h2 class="page-title">隐私设置</h2>
    </div>

    <!-- 主体 -->
    <div class="page-body">
      <!-- 提示卡片 -->
      <div class="privacy-summary">
        <div class="summary-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <p class="summary-text">
          隐私设置会影响你的主页、帖子、评论、消息及遇见频道的展示效果
        </p>
      </div>

      <!-- 分类入口卡片组 -->
      <div class="entry-cards">

        <!-- 卡片1：学校信息可见性 -->
        <div class="entry-card" @click="$router.push('/settings/privacy/school')">
          <div class="entry-icon" style="background: #e8f5e9;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4caf7d" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div class="entry-body">
            <div class="entry-title">学校信息可见性</div>
          </div>
          <div class="entry-status">
            <span class="status-text">{{ store.visibilityLabels[store.schoolVisibility] }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

        <!-- 卡片2：搜索与推荐 -->
        <div class="entry-card" @click="$router.push('/settings/privacy/search')">
          <div class="entry-icon" style="background: #e3f2fd;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2196f3" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <div class="entry-body">
            <div class="entry-title">搜索与推荐</div>
          </div>
          <div class="entry-status">
            <span class="status-text">{{ store.scopeLabels[store.searchScope] }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

        <!-- 卡片3：互动权限 -->
        <div class="entry-card" @click="$router.push('/settings/privacy/interaction')">
          <div class="entry-icon" style="background: #fff3e0;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff9800" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div class="entry-body">
            <div class="entry-title">互动权限</div>
          </div>
          <div class="entry-status">
            <span class="status-text">{{ interactionSummary }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

        <!-- 卡片4：默认发帖偏好 -->
        <div class="entry-card" @click="$router.push('/settings/privacy/default-post')">
          <div class="entry-icon" style="background: #ede7f6;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#673ab7" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <div class="entry-body">
            <div class="entry-title">默认发帖偏好</div>
          </div>
          <div class="entry-status">
            <span class="status-text">{{ postPreferenceSummary }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

      </div>

      <!-- 底部说明 -->
      <p class="page-footer-note">
        本页仅管理账号级隐私规则，帖子可见范围等内容级权限在发帖时单独设置。
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app.js'
const store = useAppStore()

// 互动权限摘要：显示私信+关注当前设置
const interactionSummary = computed(() => {
  const msg = store.messageLabels[store.messagePermission]
  return msg.length > 8 ? msg.slice(0, 7) + '…' : msg
})

// 默认发帖偏好摘要
const postPreferenceSummary = computed(() => {
  return store.defaultAnonPost ? '匿名' : '公开身份'
})
</script>

<style scoped>
.privacy-page {
  min-height: 100%;
  background: var(--echo-bg);
}

/* ===== 头部 ===== */
.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--echo-white);
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-back {
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background var(--echo-transition-fast);
  color: var(--echo-text);
}
.nav-back:active { background: var(--echo-bg); }
.page-title {
  font-size: var(--echo-text-xl);
  font-weight: var(--echo-weight-bold);
  color: var(--echo-text);
}

/* ===== 主体 ===== */
.page-body { padding: 16px; }

/* ===== 提示卡片 ===== */
.privacy-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: #f0f7f4;
  border-radius: var(--echo-radius);
  margin-bottom: 20px;
}
.summary-icon {
  width: 40px; height: 40px;
  border-radius: 12px;
  background: var(--echo-white);
  display: flex; align-items: center; justify-content: center;
  color: var(--echo-primary);
  flex-shrink: 0;
}
.summary-text {
  font-size: var(--echo-text-sm);
  color: #4a7c5a;
  line-height: 1.5;
  margin: 0;
}

/* ===== 入口卡片 ===== */
.entry-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.entry-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--echo-white);
  border-radius: var(--echo-radius);
  cursor: pointer;
  transition: all var(--echo-transition-fast);
}
.entry-card:active { background: var(--echo-bg); transform: scale(0.985); }
.entry-icon {
  width: 44px; height: 44px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.entry-body {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}
.entry-title {
  font-size: var(--echo-text-md);
  font-weight: var(--echo-weight-semibold);
  color: var(--echo-text);
}
.entry-status {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.status-text {
  font-size: var(--echo-text-xs);
  color: var(--echo-text-hint);
  max-width: 80px;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== 底部说明 ===== */
.page-footer-note {
  font-size: var(--echo-text-xs);
  color: var(--echo-text-placeholder);
  text-align: center;
  padding: 24px 16px;
  margin: 0;
  line-height: 1.6;
}
</style>
