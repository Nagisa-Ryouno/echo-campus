<template>
  <div class="strangers-message-page">
    <!-- 顶部导航 -->
    <div class="strangers-header">
      <van-icon name="arrow-left" size="20" @click="$router.back()" class="back-icon" />
      <h1 class="strangers-title">陌生人消息</h1>
      <div style="width:20px" />
    </div>

    <!-- 陌生人说明 Banner -->
    <div class="strangers-banner">
      <van-icon name="info-o" size="14" color="#b78103" />
      <span>未互相发送过第一条消息（即单向发送）的用户为陌生人，双方互发消息后将移出至常规列表</span>
    </div>

    <!-- 陌生人会话列表 -->
    <div class="strangers-sessions">
      <div
        v-if="store.strangerChats.length > 0"
        class="sessions-list"
      >
        <div
          v-for="session in store.strangerChats"
          :key="session.id"
          class="session-item"
          @click="onSessionClick(session)"
        >
          <div class="session-avatar">
            <div
              class="session-avatar-inner"
              :style="{ background: store.getUserById(session.userId)?.avatarColor || '#ccc' }"
            >
              <span class="session-avatar-text">
                {{ store.getUserById(session.userId)?.nickname?.charAt(0) || '?' }}
              </span>
            </div>
          </div>

          <div class="session-body">
            <div class="session-line1">
              <span class="session-name">
                {{ store.getUserById(session.userId)?.nickname || '未知用户' }}
              </span>
              <span class="session-time">{{ session.lastTime }}</span>
            </div>
            <div class="session-line2">
              <span class="session-preview">{{ session.lastMsg }}</span>
              <span v-if="session.unread" class="session-badge">{{ session.unread }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <van-icon name="chat-o" size="48" color="#c0c4cc" />
        <p>暂无陌生人消息</p>
      </div>
    </div>

    <!-- 聊天详情抽屉 -->
    <ChatWindow />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import ChatWindow from '@/components/ChatWindow.vue'

const router = useRouter()
const store = useAppStore()

function onSessionClick(session) {
  store.openChat(session.id)
}
</script>

<style scoped>
.strangers-message-page {
  min-height: 100%;
  background: var(--echo-bg);
  padding-bottom: 20px;
}

/* 顶部导航 */
.strangers-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--echo-white);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--echo-border);
}
.back-icon { cursor: pointer; }
.strangers-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--echo-text);
}

/* 说明横幅 */
.strangers-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #fff8e1;
  border-bottom: 1px solid #ffe082;
}
.strangers-banner span {
  font-size: 11px;
  color: #b78103;
  line-height: 1.4;
}

/* 会话列表 */
.strangers-sessions {
  background: var(--echo-white);
}

.session-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--echo-border);
  transition: background 0.15s;
}
.session-item:active { background: var(--echo-bg); }

.session-avatar { flex-shrink: 0; }
.session-avatar-inner {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.session-avatar-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.session-body {
  flex: 1;
  min-width: 0;
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
  background: #ff3b30;
  color: #fff;
  border-radius: 10px;
  min-width: 18px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  padding: 0 5px;
  margin-left: 8px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(255, 59, 48, 0.2);
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: var(--echo-text-hint);
}
.empty-state p {
  margin-top: 12px;
  font-size: 14px;
}
</style>
