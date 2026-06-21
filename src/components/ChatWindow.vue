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
          <!-- 右侧菜单按钮，仅在单聊时展示“三个横线”，群聊时留空占位 -->
          <van-icon
            v-if="!activeChat.isGroup"
            name="bars"
            size="20"
            @click="isSettingsOpen = true"
            class="menu-btn"
          />
          <div v-else style="width: 20px;"></div>
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
              @click="!activeChat.isGroup && goToUserProfile()"
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

        <!-- 对个人用户设置的全屏抽屉面板（小红书风格） -->
        <transition name="chat-slide">
          <div v-if="isSettingsOpen && chatUser" class="chat-settings-overlay">
            <!-- 头部栏 -->
            <div class="settings-header">
              <van-icon name="arrow-left" size="20" @click="isSettingsOpen = false" class="settings-back-btn" />
              <div class="settings-header-title"></div>
              <div style="width: 20px;"></div>
            </div>

            <!-- 设置内容区 -->
            <div class="settings-content">
              <!-- 头像名字卡片 -->
              <div class="profile-card">
                <div class="settings-avatar-box" @click="goToUserProfile">
                  <div class="settings-avatar" :style="{ backgroundColor: chatUser.avatarColor || '#ccc' }">
                    {{ chatUser.nickname?.charAt(0) || '?' }}
                  </div>
                </div>
                <h2 class="settings-username" @click="goToUserProfile">{{ chatUser.nickname }}</h2>
                
                <!-- 关注按钮 -->
                <button
                  class="follow-btn"
                  :class="{ 'follow-btn--following': isFollowing }"
                  @click="toggleFollowUser"
                >
                  {{ isFollowing ? '已关注' : '关注' }}
                </button>
              </div>

              <!-- 列表卡片组一：查找聊天记录 -->
              <div class="settings-group-card">
                <div class="settings-list-item" @click="onSearchHistory">
                  <span class="item-text">查找聊天记录</span>
                  <van-icon name="arrow" size="14" color="#ccc" />
                </div>
              </div>

              <!-- 列表卡片组二：置顶与免打扰 -->
              <div class="settings-group-card">
                <div class="settings-list-item">
                  <span class="item-text">置顶聊天</span>
                  <van-switch v-model="isPinned" size="20px" active-color="var(--echo-primary)" @change="onPinnedChange" />
                </div>
                <div class="settings-list-item">
                  <span class="item-text">消息免打扰</span>
                  <van-switch v-model="isMuted" size="20px" active-color="var(--echo-primary)" @change="onMutedChange" />
                </div>
              </div>

              <!-- 列表卡片组三：黑名单与举报 -->
              <div class="settings-group-card">
                <div class="settings-list-item">
                  <span class="item-text">加入黑名单</span>
                  <van-switch v-model="isBlocked" size="20px" active-color="var(--echo-primary)" @change="onBlockedChange" />
                </div>
                <div class="settings-list-item" @click="onReportUser">
                  <span class="item-text">举报</span>
                  <van-icon name="arrow" size="14" color="#ccc" />
                </div>
              </div>

              <!-- 列表卡片组四：清空聊天记录 -->
              <div class="settings-group-card">
                <div class="settings-list-item" @click="clearChatHistory">
                  <span class="item-text">清空聊天记录</span>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { showConfirmDialog, showToast } from 'vant'

const store = useAppStore()
const router = useRouter()
const inputText = ref('')
const msgListRef = ref(null)

const isSettingsOpen = ref(false)
const isPinned = ref(false)
const isMuted = ref(false)
const isBlocked = ref(false)

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

// 监听当前聊天以初始化开关状态
watch(() => activeChat.value, (chat) => {
  if (chat) {
    isPinned.value = chat.isPinned || false
    isMuted.value = chat.isMuted || false
    isBlocked.value = chat.isBlocked || false
  }
}, { immediate: true })

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
  } else {
    isSettingsOpen.value = false
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

// 关注判定与切换
const isFollowing = computed(() => {
  if (!chatUser.value) return false
  return store.isFollowing(chatUser.value.id)
})

function toggleFollowUser() {
  if (!chatUser.value) return
  store.toggleFollow(chatUser.value.id)
  showToast(isFollowing.value ? '已关注' : '已取消关注')
}

// 选项 Switch 修改逻辑
function onPinnedChange(val) {
  if (activeChat.value) {
    activeChat.value.isPinned = val
    showToast(val ? '已设置置顶聊天' : '已取消置顶聊天')
  }
}

function onMutedChange(val) {
  if (activeChat.value) {
    activeChat.value.isMuted = val
    showToast(val ? '消息免打扰已开启' : '消息免打扰已关闭')
  }
}

function onBlockedChange(val) {
  if (activeChat.value) {
    activeChat.value.isBlocked = val
    showToast(val ? '已加入黑名单' : '已移出黑名单')
  }
}

// 模拟操作
function onSearchHistory() {
}

function onReportUser() {
  showToast('举报已提交，平台将在24小时内审核处理')
}

// 清空聊天记录
function clearChatHistory() {
  showConfirmDialog({
    title: '提示',
    message: '确定要清空与该用户的聊天记录吗？'
  }).then(() => {
    if (store.activeChatId && store.messagesMap[store.activeChatId]) {
      store.messagesMap[store.activeChatId] = []
      if (activeChat.value) {
        activeChat.value.lastMsg = '聊天记录已清空'
      }
      showToast('聊天记录已清空')
    }
  }).catch(() => {})
}

// 点击头像跳转用户主页
function goToUserProfile() {
  if (!chatUser.value) return
  const uid = chatUser.value.id
  store.closeChat()
  isSettingsOpen.value = false
  router.push(`/profile/${uid}`)
}
</script>

<style scoped>
.chat-window-overlay {
  position: fixed;
  top: 48px;
  left: 0;
  right: 0;
  bottom: 0;
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
  cursor: pointer;
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

.menu-btn {
  cursor: pointer;
  padding: 4px;
}

/* 设置界面样式 */
.chat-settings-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--echo-bg);
  z-index: 10200;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  background: var(--echo-white);
  border-bottom: 1px solid var(--echo-border);
  flex-shrink: 0;
}

.settings-back-btn {
  cursor: pointer;
}

.settings-header-title {
  font-size: 15px;
  font-weight: 600;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 头像与名字卡片 */
.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 20px;
  background: var(--echo-white);
}

.settings-avatar-box {
  cursor: pointer;
  transition: transform 0.2s;
}
.settings-avatar-box:active {
  transform: scale(0.95);
}

.settings-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 26px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.settings-username {
  font-size: 15px;
  font-weight: 600;
  color: var(--echo-text);
  margin-top: 12px;
  cursor: pointer;
}

/* 关注按钮 */
.follow-btn {
  margin-top: 12px;
  padding: 6px 26px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  background: #ff2442; /* 小红书经典红 */
  color: #fff;
  outline: none;
}
.follow-btn--following {
  background: var(--echo-bg);
  color: var(--echo-text-secondary);
}

/* 分组卡片 */
.settings-group-card {
  background: var(--echo-white);
  border-radius: 12px;
  margin: 0 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.01);
}

.settings-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  cursor: pointer;
  background: var(--echo-white);
}
.settings-list-item:active {
  background: rgba(0, 0, 0, 0.02);
}

/* 项之间的分割线 */
.settings-group-card .settings-list-item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
}

.item-text {
  font-size: 13px;
  color: var(--echo-text);
  font-weight: 500;
}
</style>
