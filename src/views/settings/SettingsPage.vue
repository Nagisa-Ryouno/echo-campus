<template>
  <div class="settings-page">
    <!-- 返回栏 -->
    <div class="settings-header">
      <div class="nav-back" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </div>
      <h2 class="settings-title">设置</h2>
    </div>

    <div class="settings-body">
      <!-- 隐私设置 -->
      <div class="setting-section">
        <div class="section-label">隐私设置</div>
        <div class="setting-card">
          <div class="setting-item" @click="$router.push('/settings/privacy')">
            <div class="setting-item-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span>隐私设置</span>
            </div>
            <div class="setting-item-right">
              <span class="setting-value">管理全部隐私</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 内容可见性 -->
      <div class="setting-section">
        <div class="section-label">内容管理</div>
        <div class="setting-card">
          <div class="setting-item" @click="$router.push('/settings/content-visibility')">
            <div class="setting-item-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>内容可见性</span>
            </div>
            <div class="setting-item-right">
              <span class="setting-value">帖子/评论/收藏</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 账号安全 -->
      <div class="setting-section">
        <div class="section-label">账号安全</div>
        <div class="setting-card">
          <div class="setting-item">
            <div class="setting-item-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span>修改密码</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <div class="setting-item">
            <div class="setting-item-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1"/></svg>
              <span>绑定手机</span>
            </div>
            <div class="setting-item-right">
              <span class="setting-value">已绑定</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 通知管理 -->
      <div class="setting-section">
        <div class="section-label">通知管理</div>
        <div class="setting-card">
          <div class="setting-item">
            <div class="setting-item-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span>推送通知</span>
            </div>
            <div class="setting-item-right">
              <van-switch v-model="pushNotif" size="22" active-color="var(--echo-primary)" />
            </div>
          </div>
          <div class="setting-item">
            <div class="setting-item-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>勿扰时段</span>
            </div>
            <div class="setting-item-right">
              <span class="setting-value">23:00-07:00</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 通用 -->
      <div class="setting-section">
        <div class="section-label">通用</div>
        <div class="setting-card">
          <div class="setting-item">
            <div class="setting-item-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>语言</span>
            </div>
            <div class="setting-item-right">
              <span class="setting-value">简体中文</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
          <div class="setting-item">
            <div class="setting-item-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              <span>清除缓存</span>
            </div>
            <div class="setting-item-right">
              <span class="setting-value">128 MB</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
          <div class="setting-item">
            <div class="setting-item-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>关于校声</span>
            </div>
            <div class="setting-item-right">
              <span class="setting-value">v1.0.0</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 退出登录 -->
      <button class="logout-btn" @click="handleLogout">
        退出登录
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useAppStore } from '@/stores/app.js'

const router = useRouter()
const store = useAppStore()

const pushNotif = ref(true)

function handleLogout() {
  store.logout()
  showToast('已退出登录')
  router.replace('/login')
}
</script>

<style scoped>
.settings-page {
  min-height: 100%;
  background: var(--echo-bg);
}

/* ===== 头部 ===== */
.settings-header {
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

.settings-title {
  font-size: var(--echo-text-xl);
  font-weight: var(--echo-weight-bold);
  color: var(--echo-text);
}

/* ===== 内容 ===== */
.settings-body {
  padding: 16px;
}

.setting-section {
  margin-bottom: 20px;
}

.section-label {
  font-size: var(--echo-text-sm);
  color: var(--echo-text-hint);
  font-weight: var(--echo-weight-medium);
  margin-bottom: 8px;
  padding-left: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.setting-card {
  background: var(--echo-white);
  border-radius: var(--echo-radius);
  overflow: hidden;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  cursor: pointer;
  transition: background var(--echo-transition-fast);
  border-bottom: 1px solid var(--echo-divider);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item:active {
  background: var(--echo-bg);
}

.setting-item-left {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--echo-text-md);
  color: var(--echo-text);
}

.setting-item-left svg {
  color: var(--echo-text-secondary);
  flex-shrink: 0;
}

.setting-item-right {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--echo-text-hint);
}

.setting-value {
  font-size: var(--echo-text-sm);
  color: var(--echo-text-hint);
}

/* ===== 退出 ===== */
.logout-btn {
  width: 100%;
  padding: 14px;
  border: 1.5px solid var(--echo-border);
  border-radius: var(--echo-radius);
  background: var(--echo-white);
  color: var(--echo-danger);
  font-size: var(--echo-text-lg);
  font-weight: var(--echo-weight-medium);
  cursor: pointer;
  margin-top: 24px;
  font-family: inherit;
  transition: all var(--echo-transition-fast);
}

.logout-btn:active {
  background: #fdf2f2;
  border-color: var(--echo-danger);
}
</style>
