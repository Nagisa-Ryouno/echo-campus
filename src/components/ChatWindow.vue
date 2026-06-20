<template>
  <Teleport to="#phone-screen">
    <transition name="chat-slide">
      <div v-if="store.isChatOpen && activeChat" class="chat-window-overlay">
        <!-- 头部导航 -->
        <div class="chat-header">
          <van-icon name="arrow-left" size="20" @click="store.closeChat" class="back-btn" />
          <div class="chat-header-title">
            {{ activeChat.isGroup ? activeChat.name : (chatUser?.nickname || '未知用户') }}
            <span v-if="activeChat.isGroup" class="member-count">({{ activeChat.memberCount }}人)</span>
          </div>
          <div style="width: 20px;"></div>
        </div>

        <!-- 消息列表 -->
        <div ref="msgListRef" class="message-list">
          <!-- 单向/陌生人消息提示 -->
          <div v-if="isStrangerSession" class="stranger-banner">
            <van-icon name="info-o" size="14" color="#b78103" />
            <span>你与对方处于单向沟通状态，双方互发消息后将移出到聊天列表</span>
          </div>

          <div
            v-for="(msg, idx) in messageHistory"
            :key="idx"
            class="message-item"
            :class="msg.sender === 'me' ? 'message-item--me' : 'message-item--them'"
          >
            <!-- 头像 -->
            <div
              v-if="msg.sender !== 'me'"
              class="message-avatar"
              :style="{ backgroundColor: activeChat.isGroup ? '#9b59b6' : (chatUser?.avatarColor || '#ccc') }"
            >
              {{ activeChat.isGroup ? '群' : (chatUser?.nickname?.charAt(0) || '?') }}
            </div>
            
            <!-- 气泡 -->
            <div class="message-balloon-wrap">
              <div class="message-balloon">
                {{ msg.text }}
              </div>
              <div class="message-time">{{ msg.time }}</div>
            </div>
          </div>
        </div>

        <!-- 输入栏 -->
        <div class="chat-input-bar">
          <input
            v-model="inputText"
            type="text"
            placeholder="说点什么..."
            @keyup.enter="sendMessage"
          />
          <button :disabled="!inputText.trim()" @click="sendMessage">发送</button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useAppStore } from '@/stores/app.js'

const store = useAppStore()
const inputText = ref('')
const msgListRef = ref(null)

const activeChat = computed(() => {
  return store.chatListData.find(c => c.id === store.activeChatId)
})

const chatUser = computed(() => {
  if (!activeChat.value || activeChat.value.isGroup) return null
  return store.getUserById(activeChat.value.userId)
})

const messageHistory = computed(() => {
  if (!store.activeChatId) return []
  return store.messagesMap[store.activeChatId] || []
})

const isStrangerSession = computed(() => {
  if (!activeChat.value || activeChat.value.isGroup) return false
  return activeChat.value.sentByMeCount === 0 || activeChat.value.sentByThemCount === 0
})

// 滚动到底部
async function scrollToBottom() {
  await nextTick()
  if (msgListRef.value) {
    msgListRef.value.scrollTop = msgListRef.value.scrollHeight
  }
}

watch(() => store.isChatOpen, (val) => {
  if (val) {
    scrollToBottom()
  }
})

watch(() => messageHistory.value.length, () => {
  scrollToBottom()
})

function sendMessage() {
  const text = inputText.value.trim()
  if (!text || !store.activeChatId) return
  
  store.sendChatMessage(store.activeChatId, text)
  inputText.value = ''
}
</script>

<style scoped>
.chat-window-overlay {
  position: fixed;
  top: 48px;
  left: 0;
  right: 0;
  bottom: 32px;
  background: var(--echo-bg);
  z-index: 10100;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 头部 */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  background: var(--echo-white);
  border-bottom: 1px solid var(--echo-border);
  flex-shrink: 0;
}
.back-btn {
  cursor: pointer;
}
.chat-header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--echo-text);
  display: flex;
  align-items: center;
}
.member-count {
  font-size: 12px;
  color: var(--echo-text-hint);
  margin-left: 4px;
}

/* 消息列表 */
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stranger-banner {
  background: #fff8e1;
  border: 1px solid #ffe082;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 11px;
  color: #b78103;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  line-height: 1.4;
}

.message-item {
  display: flex;
  gap: 8px;
  max-width: 85%;
}
.message-item--them {
  align-self: flex-start;
}
.message-item--me {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.message-balloon-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.message-item--me .message-balloon-wrap {
  align-items: flex-end;
}
.message-item--them .message-balloon-wrap {
  align-items: flex-start;
}

.message-balloon {
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.5;
  word-break: break-all;
}
.message-item--them .message-balloon {
  background: var(--echo-white);
  color: var(--echo-text);
  border-top-left-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.message-item--me .message-balloon {
  background: var(--echo-primary);
  color: #fff;
  border-top-right-radius: 2px;
}

.message-time {
  font-size: 10px;
  color: var(--echo-text-hint);
}

/* 输入栏 */
.chat-input-bar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: var(--echo-white);
  border-top: 1px solid var(--echo-border);
  gap: 8px;
  flex-shrink: 0;
}
.chat-input-bar input {
  flex: 1;
  border: 1px solid var(--echo-border);
  border-radius: 20px;
  padding: 8px 14px;
  font-size: 13px;
  background: var(--echo-bg);
  outline: none;
}
.chat-input-bar button {
  background: var(--echo-primary);
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}
.chat-input-bar button:disabled {
  background: var(--echo-border);
  color: var(--echo-text-hint);
  cursor: not-allowed;
}

/* 滑动动画 */
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: transform 0.28s cubic-bezier(0.32, 0.94, 0.6, 1);
}
.chat-slide-enter-from,
.chat-slide-leave-to {
  transform: translateX(100%);
}
</style>
