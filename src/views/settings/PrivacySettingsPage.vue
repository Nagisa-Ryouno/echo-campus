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
            <div class="entry-desc">控制别人是否能看到你的学校信息</div>
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
            <div class="entry-desc">控制别人如何找到你，以及是否出现在推荐中</div>
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
            <div class="entry-desc">控制别人如何与你互动，包括评论、私信、关注</div>
          </div>
          <div class="entry-status">
            <span class="status-text">{{ store.commentLabels[store.commentPermission] }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

        <!-- 卡片4：内容发布权限 -->
        <div class="entry-card" @click="$router.push('/settings/privacy/content')">
          <div class="entry-icon" style="background: #f3e5f5;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9c27b0" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div class="entry-body">
            <div class="entry-title">内容发布权限</div>
            <div class="entry-desc">控制发布内容时的默认可见规则与匿名设置</div>
          </div>
          <div class="entry-status">
            <span class="status-text">{{ store.publishLabels[store.defaultVisibility] }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

      </div>

      <!-- 底部说明 -->
      <p class="page-footer-note">
        以上设置将作为平台的全局隐私规则，部分页面提供发布时的临时覆盖选项。
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app.js'
const store = useAppStore()
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
.entry-body { flex: 1; min-width: 0; }
.entry-title {
  font-size: var(--echo-text-md);
  font-weight: var(--echo-weight-semibold);
  color: var(--echo-text);
  margin-bottom: 2px;
}
.entry-desc {
  font-size: var(--echo-text-sm);
  color: var(--echo-text-hint);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
