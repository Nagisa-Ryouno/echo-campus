<template>
  <div class="message-page">
    <!-- 顶部导航 -->
    <div class="msg-header">
      <h1 class="msg-title">消息</h1>
      <div class="msg-header-actions">
        <van-icon name="search" size="20" @click="$router.push('/search')" />
        <van-icon
          :name="plusMenuVisible ? 'cross' : 'plus'"
          size="20"
          class="plus-icon"
          @click="plusMenuVisible ? closePlusMenu() : openPlusMenu()"
        />
      </div>
    </div>

    <!-- 加号展开菜单（弹层，锁定背景滚动）-->
    <Teleport to="#phone-screen">
      <transition name="plus-fade">
        <div v-if="plusMenuVisible" class="plus-menu-overlay" @click.self="closePlusMenu">
          <div class="plus-menu-sheet">
            <div class="plus-menu-grid">
              <div class="plus-menu-item" @click="onPlusAction('group')">
                <div class="plus-menu-icon" style="background:#e8f5ee;">
                  <van-icon name="friends-o" size="22" color="#4caf7d" />
                </div>
                <span>创建圈子</span>
              </div>
              <div class="plus-menu-item" @click="onPlusAction('square')">
                <div class="plus-menu-icon" style="background:#fff3e0;">
                  <van-icon name="fire-o" size="22" color="#ff6b35" />
                </div>
                <span>圈子广场</span>
              </div>
              <div class="plus-menu-item" @click="onPlusAction('addFriend')">
                <div class="plus-menu-icon" style="background:#e3f2fd;">
                  <van-icon name="user-o" size="22" color="#3498db" />
                </div>
                <span>添加好友</span>
              </div>
              <div class="plus-menu-item" @click="onPlusAction('scan')">
                <div class="plus-menu-icon" style="background:#f3e5f5;">
                  <van-icon name="scan" size="22" color="#9b59b6" />
                </div>
                <span>扫一扫</span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- 通知分类入口 —— 无外层卡片，图标块 + 下方文字，角标在图标块右下角叠加 -->
    <div class="notif-entries">
      <!-- 收到喜欢 -->
      <div class="notif-entry" @click="$router.push('/message/likes')">
        <div class="entry-icon-area">
          <div class="entry-icon-bg" style="background:#fff0f0;">
            <van-icon name="like-o" size="26" color="#e74c3c" />
          </div>
          <span
            v-if="store.unreadLikeCount"
            class="entry-badge"
          >{{ badgeText(store.unreadLikeCount) }}</span>
        </div>
        <span class="entry-label">收到喜欢</span>
      </div>

      <!-- 评论与@ -->
      <div class="notif-entry" @click="$router.push('/message/comments')">
        <div class="entry-icon-area">
          <div class="entry-icon-bg" style="background:#fff8e1;">
            <van-icon name="chat-o" size="26" color="#ff6b35" />
          </div>
          <span
            v-if="store.unreadCommentAtCount"
            class="entry-badge"
          >{{ badgeText(store.unreadCommentAtCount) }}</span>
        </div>
        <span class="entry-label">评论与@</span>
      </div>

      <!-- 新增粉丝 -->
      <div class="notif-entry" @click="$router.push('/message/fans')">
        <div class="entry-icon-area">
          <div class="entry-icon-bg" style="background:#e8f5ff;">
            <van-icon name="friends-o" size="26" color="#3498db" />
          </div>
          <span
            v-if="store.unreadFollowerCount"
            class="entry-badge"
          >{{ badgeText(store.unreadFollowerCount) }}</span>
        </div>
        <span class="entry-label">新增粉丝</span>
      </div>
    </div>

    <!-- 分割线 -->
    <div class="section-divider" />

    <!-- 聊天列表 -->
    <div class="chat-section">
      <div class="section-label">聊天</div>
      <div
        v-for="chat in store.chatListData"
        :key="chat.id"
        class="chat-item"
        @click="onChatClick(chat)"
      >
        <div class="chat-avatar-wrap" :class="{ 'is-group': chat.isGroup }">
          <div
            class="chat-avatar"
            :style="{ backgroundColor: chat.isGroup ? chat.avatarColor : (store.getUserById(chat.userId)?.avatarColor || '#ccc') }"
          >
            <span class="chat-avatar-text">
              {{ chat.isGroup ? chat.name.charAt(0) : (store.getUserById(chat.userId)?.nickname?.charAt(0) || '?') }}
            </span>
          </div>
          <div v-if="chat.isGroup" class="group-badge">圈</div>
        </div>
        <div class="chat-body">
          <div class="chat-line1">
            <span class="chat-name">{{ chat.isGroup ? chat.name : (store.getUserById(chat.userId)?.nickname || '未知') }}</span>
            <span class="chat-time">{{ chat.lastTime }}</span>
          </div>
          <div class="chat-line2">
            <span class="chat-preview">{{ chat.lastMsg }}</span>
            <span v-if="chat.unread" class="chat-badge">{{ chat.unread > 99 ? '99+' : chat.unread }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 匿名消息卡片 -->
    <div class="anon-card" @click="$router.push('/message/anon')">
      <div class="anon-card-icon">
        <van-icon name="shield-o" size="22" color="#9b59b6" />
      </div>
      <div class="anon-card-body">
        <div class="anon-card-title">匿名消息</div>
        <div class="anon-card-desc">
          您有 <strong>{{ store.unreadAnonCount }}</strong> 条匿名消息未读
        </div>
      </div>
      <div class="anon-card-right">
        <span v-if="store.unreadAnonCount" class="anon-red-dot" />
        <van-icon name="arrow" size="14" color="#c0c4cc" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { showToast } from 'vant'

const router = useRouter()
const store = useAppStore()

const plusMenuVisible = ref(false)

function openPlusMenu() {
  plusMenuVisible.value = true
  store.lockPhoneScroll()
}

function closePlusMenu() {
  plusMenuVisible.value = false
  store.unlockPhoneScroll()
}

// 组件卸载时恢复滚动
onBeforeUnmount(() => {
  store.unlockPhoneScroll()
})

function onChatClick(chat) {
  store.markChatRead(chat.id)
  if (chat.isGroup) {
    showToast('进入群聊（原型占位）')
  } else {
    showToast(`与 ${store.getUserById(chat.userId)?.nickname || '用户'} 的私聊（原型占位）`)
  }
}

function onPlusAction(type) {
  closePlusMenu()
  const actions = {
    group: '创建群聊（原型占位）',
    square: '群聊广场（原型占位）',
    addFriend: '添加好友（原型占位）',
    scan: '扫一扫（原型占位）'
  }
  showToast(actions[type] || '功能开发中')
}

// 角标数字格式化：超过 99 显示 "99+"
function badgeText(count) {
  return count > 99 ? '99+' : String(count)
}
</script>

<style scoped>
.message-page {
  min-height: 100%;
  background: var(--echo-bg);
  padding-bottom: 8px;
}

/* ===== 顶部 ===== */
.msg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
  background: var(--echo-white);
  position: sticky;
  top: 0;
  z-index: 100;
}
.msg-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--echo-text);
}
.msg-header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.plus-icon {
  transition: transform 0.2s;
}

/* ===== 加号菜单弹层 ===== */
.plus-menu-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 500;
  display: flex;
  max-width: 375px;
  box-sizing: border-box;
}
.plus-menu-sheet {
  width: 100%;
  max-width: 375px;
  background: var(--echo-white);
  border-radius: 0 0 16px 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  box-sizing: border-box;
}
.plus-menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 14px 8px;
  gap: 4px;
}
.plus-menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.15s;
}
.plus-menu-item:active { background: var(--echo-bg); }
.plus-menu-item span { font-size: 11px; color: var(--echo-text-secondary); }
.plus-menu-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 弹层过渡动画 */
.plus-fade-enter-active { animation: plusFadeIn 0.25s ease; }
.plus-fade-leave-active { animation: plusFadeOut 0.2s ease; }
@keyframes plusFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes plusFadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
.plus-fade-enter-active .plus-menu-sheet {
  animation: plusSlideDown 0.25s ease;
}
.plus-fade-leave-active .plus-menu-sheet {
  animation: plusSlideUp 0.2s ease;
}
@keyframes plusSlideDown {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes plusSlideUp {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-100%); opacity: 0; }
}

/* ===== 通知分类入口 —— 无外层卡片，图标块在上 + 文字在下 ===== */
.notif-entries {
  background: var(--echo-white);
  padding: 14px 16px 14px;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
}
.notif-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.15s;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.notif-entry:active {
  transform: scale(0.94);
}

/* 图标区：相对定位容器，用于角标叠加 */
.entry-icon-area {
  position: relative;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
}
.entry-icon-bg {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 分类文字 */
.entry-label {
  font-size: 11px;
  font-weight: 500;
  color: #555;
  text-align: center;
  white-space: nowrap;
  line-height: 1;
}

/* 未读角标 —— 绝对定位在图标块右下角，与块边缘叠加 */
.entry-badge {
  position: absolute;
  right: -6px;
  bottom: -6px;
  min-width: 20px;
  height: 20px;
  line-height: 20px;
  padding: 0 6px;
  background: var(--echo-danger);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  border-radius: 11px;
  text-align: center;
  white-space: nowrap;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(231, 76, 60, 0.4);
  z-index: 2;
}

/* ===== 分割线 ===== */
.section-divider {
  height: 8px;
  background: var(--echo-bg);
}

/* ===== 聊天列表 ===== */
.chat-section {
  background: var(--echo-white);
}
.section-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--echo-text-secondary);
  padding: 12px 16px 6px;
}
.chat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.15s;
}
.chat-item:active { background: var(--echo-bg); }
.chat-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}
.chat-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-avatar-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}
.group-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: var(--echo-primary);
  color: #fff;
  font-size: 9px;
  padding: 1px 4px;
  border-radius: 6px;
  border: 1px solid #fff;
}
.chat-body {
  flex: 1;
  min-width: 0;
  padding-bottom: 2px;
}
.chat-line1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chat-name { font-size: 14px; font-weight: 500; color: var(--echo-text); }
.chat-time { font-size: 11px; color: var(--echo-text-hint); flex-shrink: 0; }
.chat-line2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}
.chat-preview {
  font-size: 12px;
  color: var(--echo-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
.chat-badge {
  font-size: 10px;
  background: var(--echo-danger);
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

/* ===== 匿名消息卡片 ===== */
.anon-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  margin: 8px 12px;
  background: linear-gradient(135deg, #f8f4fc, #fef5ff);
  border-radius: 14px;
  border: 1px dashed #e1bee7;
  cursor: pointer;
  transition: all 0.2s;
}
.anon-card:active {
  background: linear-gradient(135deg, #f3e5f5, #fce4ec);
  transform: scale(0.98);
}
.anon-card-icon {
  width: 42px;
  height: 42px;
  background: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(155,89,182,0.15);
  flex-shrink: 0;
}
.anon-card-body { flex: 1; }
.anon-card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--echo-text);
}
.anon-card-desc {
  font-size: 12px;
  color: var(--echo-text-secondary);
  margin-top: 3px;
}
.anon-card-desc strong { color: #9b59b6; }
.anon-card-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.anon-red-dot {
  width: 8px; height: 8px;
  background: var(--echo-danger);
  border-radius: 50%;
}
</style>
