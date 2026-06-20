<template>
  <div class="message-page">
    <!-- 顶部导航 -->
    <div class="msg-header">
      <h1 class="msg-title">消息</h1>
      <div class="msg-header-actions">
        <!-- 一键已读扫把图标 -->
        <span class="broom-icon" :class="{ 'is-sweeping': sweepAnimating }" @click="markAllRead">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
            <!-- 加粗扫把柄 -->
            <line x1="19" y1="5" x2="11" y2="13" />
            <!-- 扫帚头扎箍 -->
            <line x1="14" y1="10" x2="8" y2="16" />
            <!-- 扫帚毛外轮廓 -->
            <path d="M8 16L3 21h5l3-5" />
            <!-- 内部粗纹理线 -->
            <line x1="11" y1="13" x2="5" y2="19" />
          </svg>
        </span>
        <van-icon name="search" size="20" @click="$router.push('/search?from=message')" />
        <van-icon
          :name="plusMenuVisible ? 'cross' : 'plus'"
          size="20"
          class="plus-icon"
          @click="plusMenuVisible ? closePlusMenu() : openPlusMenu()"
        />
      </div>
    </div>

    <!-- 加号展开菜单 —— 右上角气泡弹出式（Teleport 到 phone-screen，锁定背景滚动）-->
    <Teleport to="#phone-screen">
      <transition name="plus-fade">
        <div v-if="plusMenuVisible" class="plus-menu-overlay" @click.self="closePlusMenu">
          <!-- 气泡卡片：右上角弹出，三角箭头指向 + 按钮 -->
          <div class="plus-bubble">
            <div class="plus-bubble-arrow"></div>
            <div class="plus-bubble-item" @click="onPlusAction('group')">
              <div class="plus-bubble-icon" style="background:#e8f5ee;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4caf7d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  <line x1="12" y1="7" x2="12" y2="13"/>
                  <line x1="9" y1="10" x2="15" y2="10"/>
                </svg>
              </div>
              <span>创建圈子</span>
            </div>
            <div class="plus-bubble-item" @click="onPlusAction('square')">
              <div class="plus-bubble-icon" style="background:#fff3e0;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <span>圈子广场</span>
            </div>
            <div class="plus-bubble-item" @click="onPlusAction('addFriend')">
              <div class="plus-bubble-icon" style="background:#e3f2fd;">
                <van-icon name="user-o" size="18" color="#3498db" />
              </div>
              <span>添加好友</span>
            </div>
            <div class="plus-bubble-item" @click="onPlusAction('scan')">
              <div class="plus-bubble-icon" style="background:#f3e5f5;">
                <van-icon name="scan" size="18" color="#9b59b6" />
              </div>
              <span>扫一扫</span>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- 一键已读扫光反馈：极简渐变条从左到右扫过，0.3s 自动消失 -->
    <Teleport to="#phone-screen">
      <transition name="sweep-fade">
        <div v-if="sweepAnimating" class="sweep-overlay">
          <div class="sweep-flash"></div>
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



    <!-- 聊天列表 -->
    <div class="chat-section">
      <div class="section-label">聊天</div>
      <div
        v-for="chat in store.visibleChatList"
        :key="chat.id"
        class="chat-item"
        :class="{
          'chat-item--pinned': chat.isPinned,
          'chat-item--removing': removingChatId === chat.id,
          'is-long-pressing': activePressTargetId === chat.id
        }"
        @click="onChatClick(chat)"
        @touchstart="onPressStart($event, 'chat', chat)"
        @touchmove="onPressMove"
        @touchend="onPressEnd"
        @touchcancel="onPressEnd"
        @mousedown="onPressStart($event, 'chat', chat)"
        @mousemove="onPressMove"
        @mouseup="onPressEnd"
        @mouseleave="onPressEnd"
      >
        <div class="chat-avatar-wrap" :class="{ 'is-group': chat.isGroup }">
          <div
            class="chat-avatar"
            :style="{ backgroundColor: chat.isStrangersFolder ? '#7f8c8d' : (chat.isGroup ? chat.avatarColor : (store.getUserById(chat.userId)?.avatarColor || '#ccc')) }"
          >
            <span class="chat-avatar-text">
              {{ chat.isStrangersFolder ? '陌' : (chat.isGroup ? chat.name.charAt(0) : (store.getUserById(chat.userId)?.nickname?.charAt(0) || '?')) }}
            </span>
          </div>
          <div v-if="chat.isGroup" class="group-badge">圈</div>
        </div>
        <div class="chat-body">
          <div class="chat-line1">
            <span class="chat-name">{{ chat.isStrangersFolder ? chat.name : (chat.isGroup ? chat.name : (store.getUserById(chat.userId)?.nickname || '未知')) }}</span>
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
    <div
      v-if="!store.hideAnonCard"
      class="anon-card"
      :class="{
        'anon-card--removing': removingAnon,
        'is-long-pressing': activePressTargetId === 'anon'
      }"
      @click="onAnonClick"
      @touchstart="onPressStart($event, 'anon')"
      @touchmove="onPressMove"
      @touchend="onPressEnd"
      @touchcancel="onPressEnd"
      @mousedown="onPressStart($event, 'anon')"
      @mousemove="onPressMove"
      @mouseup="onPressEnd"
      @mouseleave="onPressEnd"
    >
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

    <!-- 聊天详情抽屉 -->
    <ChatWindow />

    <!-- 小红书式长按悬浮菜单 -->
    <ContextMenu
      :show="contextMenuVisible"
      :x="menuX"
      :y="menuY"
      :options="activeContextMenuOptions"
      @close="closeContextMenu"
      @select="handleMenuSelect"
    />
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { showToast, showConfirmDialog } from 'vant'
import ChatWindow from '@/components/ChatWindow.vue'
import ContextMenu from '@/components/common/ContextMenu.vue'

const router = useRouter()
const store = useAppStore()

const plusMenuVisible = ref(false)
const sweepAnimating = ref(false)

// 长按悬浮菜单相关状态
const contextMenuVisible = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const currentPressTarget = ref(null) // { type: 'chat' | 'anon', item: chatObj }
const activePressTargetId = ref(null) // chat.id or 'anon'
const preventNextClick = ref(false)
const removingChatId = ref(null)
const removingAnon = ref(false)

let pressTimer = null
let startX = 0
let startY = 0

// SVG outline Icons
const unreadIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
const readIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M9 10l2 2 4-4"/></svg>`
const pinIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22" /><path d="M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.78-3.5A2 2 0 0 1 15 9.26V5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4.26a2 2 0 0 1-.78 1.56l-2.78 3.5A2 2 0 0 0 5 15.24z" /></svg>`
const hideIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
const deleteIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`

const activeContextMenuOptions = computed(() => {
  const target = currentPressTarget.value
  if (!target) return []
  
  if (target.type === 'chat') {
    const chat = target.item
    if (!chat) return []
    const isPinned = chat.isPinned
    const hasUnread = chat.unread > 0
    
    if (chat.isStrangersFolder) {
      return [
        {
          label: hasUnread ? '标为已读' : '标为未读',
          value: 'toggle-unread',
          icon: hasUnread ? readIcon : unreadIcon
        },
        {
          label: '不显示',
          value: 'hide',
          icon: hideIcon
        },
        {
          label: '删除',
          value: 'delete',
          icon: deleteIcon,
          danger: true
        }
      ]
    }
    
    return [
      {
        label: hasUnread ? '标为已读' : '标为未读',
        value: 'toggle-unread',
        icon: hasUnread ? readIcon : unreadIcon
      },
      {
        label: isPinned ? '取消置顶' : '置顶聊天',
        value: 'toggle-pin',
        icon: pinIcon
      },
      {
        label: '不显示',
        value: 'hide',
        icon: hideIcon
      },
      {
        label: '删除',
        value: 'delete',
        icon: deleteIcon,
        danger: true
      }
    ]
  } else if (target.type === 'anon') {
    const hasUnread = store.unreadAnonCount > 0
    return [
      {
        label: hasUnread ? '标为已读' : '标为未读',
        value: 'toggle-unread',
        icon: hasUnread ? readIcon : unreadIcon
      },
      {
        label: '不显示',
        value: 'hide',
        icon: hideIcon
      },
      {
        label: '删除',
        value: 'delete',
        icon: deleteIcon,
        danger: true
      }
    ]
  }
  return []
})

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
  if (pressTimer) clearTimeout(pressTimer)
})

// 一键已读：确认弹窗 → 立即清除未读 → 极简扫光动画（0.3s）
async function markAllRead() {
  try {
    await showConfirmDialog({
      title: '一键已读',
      message: '确定将所有消息标记为已读吗？\n生效范围：通知入口、聊天列表、匿名消息',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      confirmButtonColor: '#4caf7d'
    })
    // 立即清除全部未读标记
    store.markAllMessagesRead()
    // 触发扫光反馈
    sweepAnimating.value = true
    setTimeout(() => {
      sweepAnimating.value = false
    }, 600)
  } catch (_) {
    // 用户取消，不执行任何操作
  }
}

// 统一的双端长按事件处理逻辑
function onPressStart(e, type, item = null) {
  if (e.type === 'mousedown' && e.button !== 0) return
  
  const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX
  const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY
  
  startX = clientX
  startY = clientY
  
  currentPressTarget.value = { type, item }
  
  if (pressTimer) clearTimeout(pressTimer)
  
  pressTimer = setTimeout(() => {
    preventNextClick.value = true
    
    const phoneBody = document.querySelector('.phone-body')
    if (phoneBody) {
      const rect = phoneBody.getBoundingClientRect()
      menuX.value = clientX - rect.left
      menuY.value = clientY - rect.top
    } else {
      menuX.value = clientX
      menuY.value = clientY
    }
    
    activePressTargetId.value = type === 'chat' ? item.id : 'anon'
    
    try {
      if (navigator.vibrate) {
        navigator.vibrate(15)
      }
    } catch (_) {}
    
    contextMenuVisible.value = true
    store.lockPhoneScroll()
  }, 400)
}

function onPressMove(e) {
  if (!pressTimer) return
  const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX
  const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY
  
  if (Math.abs(clientX - startX) > 6 || Math.abs(clientY - startY) > 6) {
    clearTimeout(pressTimer)
    pressTimer = null
    activePressTargetId.value = null
  }
}

function onPressEnd() {
  if (pressTimer) {
    clearTimeout(pressTimer)
    pressTimer = null
  }
  activePressTargetId.value = null
}

function closeContextMenu() {
  contextMenuVisible.value = false
  store.unlockPhoneScroll()
}

function handleMenuSelect(value) {
  const target = currentPressTarget.value
  if (!target) return
  
  if (value === 'toggle-unread') {
    if (target.type === 'chat') {
      if (target.item.isStrangersFolder) {
        const hasUnread = store.strangerChats.some(c => c.unread > 0)
        if (hasUnread) {
          store.strangerChats.forEach(c => { c.unread = 0 })
        } else {
          if (store.strangerChats.length > 0) {
            store.strangerChats[0].unread = 1
          }
        }
      } else {
        store.toggleChatUnread(target.item.id)
      }
    } else if (target.type === 'anon') {
      store.toggleAnonUnread()
    }
    showToast('已标记')
  } else if (value === 'toggle-pin') {
    if (target.type === 'chat' && !target.item.isStrangersFolder) {
      store.toggleChatPin(target.item.id)
      showToast(target.item.isPinned ? '已取消置顶' : '已置顶')
    }
  } else if (value === 'hide') {
    if (target.type === 'chat') {
      removingChatId.value = target.item.id
      setTimeout(() => {
        if (target.item.isStrangersFolder) {
          store.strangerChats.forEach(c => { store.hideChat(c.id) })
        } else {
          store.hideChat(target.item.id)
        }
        removingChatId.value = null
      }, 200)
    } else if (target.type === 'anon') {
      removingAnon.value = true
      setTimeout(() => {
        store.hideAnonSession()
        removingAnon.value = false
      }, 200)
    }
  } else if (value === 'delete') {
    if (target.type === 'chat') {
      removingChatId.value = target.item.id
      setTimeout(() => {
        if (target.item.isStrangersFolder) {
          store.strangerChats.forEach(c => { store.deleteChat(c.id) })
        } else {
          store.deleteChat(target.item.id)
        }
        removingChatId.value = null
      }, 200)
    } else if (target.type === 'anon') {
      removingAnon.value = true
      setTimeout(() => {
        store.deleteAnonSessions()
        removingAnon.value = false
      }, 200)
    }
  }
}

function onChatClick(chat) {
  if (preventNextClick.value) {
    preventNextClick.value = false
    return
  }
  if (chat.isStrangersFolder) {
    router.push('/message/strangers')
  } else {
    store.openChat(chat.id)
  }
}

function onAnonClick() {
  if (preventNextClick.value) {
    preventNextClick.value = false
    return
  }
  router.push('/message/anon')
}

function onPlusAction(type) {
  closePlusMenu()
  if (type === 'square') {
    router.push('/circle/plaza')
    return
  }
  const actions = {
    group: '创建圈子（原型占位）',
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
  padding-bottom: 12px;
}

/* ===== 顶部：普通文档流，随页面滚动消失 ===== */
.msg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 10px;
  background: var(--echo-white);
  border-bottom: 1px solid var(--echo-border);
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

/* 一键已读扫把图标：与搜索/加号图标风格统一 */
.broom-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--echo-text);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.2s ease, color 0.2s ease;
}
.broom-icon:active {
  transform: scale(0.85);
  color: var(--echo-primary);
}
/* 刷子点击动效 —— 模拟真实清扫动作 */
.broom-icon.is-sweeping {
  color: var(--echo-primary);
  animation: broomSweep 0.55s ease-in-out;
}
@keyframes broomSweep {
  0%   { transform: rotate(0deg) translateX(0); }
  15%  { transform: rotate(-20deg) translateX(-4px); }
  40%  { transform: rotate(-20deg) translateX(6px); }
  55%  { transform: rotate(-20deg) translateX(6px); }
  70%  { transform: rotate(5deg) translateX(0); }
  85%  { transform: rotate(-8deg) translateX(-2px); }
  100% { transform: rotate(0deg) translateX(0); }
}

/* ===== 加号菜单弹层 —— 全屏半透明蒙层 + 右上角气泡 ===== */
.plus-menu-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9999;
}

/* 气泡卡片：右上角弹出，三角箭头指向 + 按钮 */
.plus-bubble {
  position: absolute;
  top: 46px;
  right: 8px;
  min-width: 136px;
  z-index: 10000;
  background: #ffffff;
  border-radius: 12px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.18),
    0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 6px 0;
  overflow: visible;
  transform-origin: top right;
}

/* 三角箭头 —— 指向上方的 + 按钮 */
.plus-bubble-arrow {
  position: absolute;
  top: -7px;
  right: 16px;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 8px solid #ffffff;
}

/* 竖向菜单项 */
.plus-bubble-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.12s;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.plus-bubble-item:first-child {
  border-radius: 12px 12px 0 0;
}
.plus-bubble-item:last-child {
  border-radius: 0 0 12px 12px;
}
.plus-bubble-item:active {
  background: var(--echo-bg);
}
.plus-bubble-item span {
  font-size: 14px;
  font-weight: 500;
  color: var(--echo-text);
  white-space: nowrap;
}

/* 菜单项左侧圆形图标 */
.plus-bubble-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ===== 弹出 / 隐藏动画 ===== */
.plus-fade-enter-active {
  transition: opacity 0.2s ease;
}
.plus-fade-leave-active {
  transition: opacity 0.18s ease;
}
.plus-fade-enter-from,
.plus-fade-leave-to {
  opacity: 0;
}

/* 气泡卡片：从右上角缩放弹出 */
.plus-fade-enter-active .plus-bubble {
  animation: bubblePopIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.plus-fade-leave-active .plus-bubble {
  animation: bubblePopOut 0.16s ease;
}
@keyframes bubblePopIn {
  from {
    opacity: 0;
    transform: scale(0.75);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes bubblePopOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.75);
  }
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

/* 未读角标 —— 绝对定位在图标块右上角，防止覆盖文字 */
.entry-badge {
  position: absolute;
  right: -4px;
  top: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: #ff3b30;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(255, 59, 48, 0.3);
  z-index: 2;
  box-sizing: border-box;
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
  background: #ff3b30;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  height: 18px;
  min-width: 18px;
  border-radius: 9px;
  padding: 0 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(255, 59, 48, 0.25);
  margin-left: 8px;
  flex-shrink: 0;
  box-sizing: border-box;
}

/* ===== 匿名消息卡片 ===== */
.anon-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  margin: 8px 12px 104px; /* 底部预留 104px 外边距，使卡片滑动到最底下时距离底栏有优雅的间隔，不显得局促贴死 */
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
  width: 8px;
  height: 8px;
  background: #ff3b30;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #fff, 0 1px 4px rgba(255, 59, 48, 0.4);
}

/* ===== 一键已读扫光反馈：增强版渐变扫光 + 粒子尾迹 ===== */
.sweep-overlay {
  position: absolute;
  inset: 0;
  z-index: 10001;
  pointer-events: none;
  overflow: hidden;
}
.sweep-flash {
  position: absolute;
  inset: 0;
  /* 更明显的主扫光条 */
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(76, 175, 125, 0.08) 25%,
    rgba(76, 175, 125, 0.18) 45%,
    rgba(76, 175, 125, 0.15) 55%,
    rgba(76, 175, 125, 0.05) 75%,
    transparent 100%
  );
  animation: sweepFlash 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.sweep-flash::after {
  content: '';
  position: absolute;
  top: 0; bottom: 0;
  width: 3px;
  left: 0;
  /* 扫光前沿亮线 */
  background: linear-gradient(
    90deg,
    rgba(76, 175, 125, 0.35),
    rgba(76, 175, 125, 0.55),
    rgba(76, 175, 125, 0.2)
  );
  animation: sweepEdge 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes sweepFlash {
  0%   { transform: translateX(-100%); opacity: 0; }
  8%   { opacity: 1; }
  85%  { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
}
@keyframes sweepEdge {
  0%   { transform: translateX(-20vw); opacity: 0; }
  10%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { transform: translateX(110vw); opacity: 0; }
}

/* 蒙层淡入淡出 */
.sweep-fade-enter-active { transition: opacity 0.1s ease; }
.sweep-fade-leave-active { transition: opacity 0.4s ease; }
.sweep-fade-enter-from,
.sweep-fade-leave-to { opacity: 0; }

/* 置顶聊天背景色 */
.chat-item--pinned {
  background-color: #fafafc !important;
}

/* 长按时的缩放与触感反馈 */
.chat-item, .anon-card {
  transition: transform 0.15s ease, background-color 0.15s ease, opacity 0.2s ease, height 0.2s cubic-bezier(0.4, 0, 0.2, 1), padding 0.2s ease, margin 0.2s ease;
}
.chat-item.is-long-pressing, .anon-card.is-long-pressing {
  transform: scale(0.97) !important;
  background-color: rgba(0, 0, 0, 0.02) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

/* 不显示或删除时的淡出与塌陷折叠动画 */
.chat-item--removing, .anon-card--removing {
  opacity: 0 !important;
  transform: translateX(12px) !important;
  height: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  overflow: hidden !important;
  border: none !important;
}
</style>
