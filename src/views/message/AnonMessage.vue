<template>
  <div class="anon-message-page">
    <!-- 顶部导航 -->
    <div class="anon-header">
      <van-icon name="arrow-left" size="20" @click="$router.back()" class="back-icon" />
      <h1 class="anon-title">匿名消息</h1>
      <div style="width:20px" />
    </div>

    <!-- 隐私提示条 -->
    <div class="privacy-banner">
      <van-icon name="info-o" size="14" color="#9b59b6" />
      <span>你的匿名身份受到保护，对方不会看到你的真实信息</span>
    </div>

    <!-- 匿名会话列表 -->
    <div class="anon-sessions">
      <div
        v-for="session in store.anonSessionData"
        :key="session.id"
        class="anon-session-item"
        @click="onSessionClick(session)"
      >
        <div class="session-avatar" :class="{ 'is-circle': session.isAnonCircle }">
          <div
            class="session-avatar-inner"
            :style="{ background: session.isAnonCircle ? (session.avatarColor || '#9b59b6') : '#9b59b6' }"
          >
            <van-icon
              v-if="session.isAnonCircle"
              name="friends-o"
              size="18"
              color="#fff"
            />
            <span v-else class="session-avatar-text">
              {{ session.sessionName?.charAt(session.sessionName.length - 1) || '匿' }}
            </span>
          </div>
        </div>

        <div class="session-body">
          <div class="session-line1">
            <span class="session-name">{{ session.isAnonCircle ? session.name : session.sessionName }}</span>
            <span class="session-time">{{ session.lastTime }}</span>
          </div>
          <div class="session-line2">
            <span class="session-preview">{{ session.lastMsg }}</span>
            <span v-if="session.unread" class="session-badge">{{ session.unread }}</span>
          </div>
          <div v-if="session.sourcePostPreview" class="session-source">
            来自：{{ session.sourcePostPreview }}
          </div>
        </div>
      </div>
    </div>

    <!-- 匿名保护说明 -->
    <div class="anon-info">
      <div class="anon-info-title">
        <van-icon name="shield-o" size="16" color="#9b59b6" />
        <span>匿名保护机制</span>
      </div>
      <ul class="anon-info-list">
        <li>匿名会话中，双方均无法看到对方真实身份</li>
        <li>匿名消息不会出现在你的公开聊天列表中</li>
        <li>你可以随时结束匿名会话，对方不会收到通知</li>
        <li>匿名圈中的消息在圈内也是匿名的</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { showToast } from 'vant'

const router = useRouter()
const store = useAppStore()

function onSessionClick(session) {
  // 标记已读
  session.unread = 0
}
</script>

<style scoped>
.anon-message-page {
  min-height: 100%;
  background: var(--echo-bg);
  padding-bottom: 20px;
}

/* ===== 顶部导航 ===== */
.anon-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--echo-white);
  position: sticky;
  top: 0;
  z-index: 100;
}
.back-icon { cursor: pointer; }
.anon-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--echo-text);
}

/* ===== 隐私提示条 ===== */
.privacy-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #f8f4fc, #fef5ff);
  border-bottom: 1px solid #f3e5f5;
}
.privacy-banner span {
  font-size: 12px;
  color: #7b1fa2;
  line-height: 1.4;
}

/* ===== 匿名会话列表 ===== */
.anon-sessions {
  background: var(--echo-white);
}
.anon-session-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--echo-border);
  transition: background 0.15s;
}
.anon-session-item:active { background: var(--echo-bg); }
.session-avatar { flex-shrink: 0; }
.session-avatar-inner {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.session-avatar-inner::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 14px;
  border: 2px dashed #d1c4e9;
  opacity: 0.6;
}
.session-avatar-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}
.session-body {
  flex: 1;
  min-width: 0;
  padding-top: 2px;
}
.session-line1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.session-name { font-size: 14px; font-weight: 500; color: var(--echo-text); }
.session-time { font-size: 11px; color: var(--echo-text-hint); flex-shrink: 0; }
.session-line2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}
.session-preview {
  font-size: 12px;
  color: var(--echo-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
.session-badge {
  font-size: 10px;
  background: #9b59b6;
  color: #fff;
  border-radius: 10px;
  min-width: 18px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  padding: 0 5px;
  margin-left: 8px;
  flex-shrink: 0;
}
.session-source {
  font-size: 11px;
  color: var(--echo-text-hint);
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== 匿名保护说明 ===== */
.anon-info {
  margin: 16px 12px;
  padding: 16px;
  background: #faf8fc;
  border-radius: 12px;
  border: 1px solid #f3e5f5;
}
.anon-info-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #7b1fa2;
  margin-bottom: 10px;
}
.anon-info-list {
  list-style: none;
  padding: 0;
}
.anon-info-list li {
  font-size: 11px;
  color: var(--echo-text-secondary);
  line-height: 1.8;
  padding-left: 12px;
  position: relative;
}
.anon-info-list li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: #d1c4e9;
  font-weight: bold;
}
</style>
