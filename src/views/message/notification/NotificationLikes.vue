<template>
  <div class="notif-page">
    <!-- 顶部 -->
    <div class="notif-header">
      <van-icon name="arrow-left" size="20" @click="$router.back()" class="back-icon" />
      <h1 class="notif-title">收到喜欢</h1>
      <span class="mark-read-btn" @click="markAllRead" v-if="unreadCount > 0">
        全部已读 ({{ unreadCount }})
      </span>
    </div>

    <!-- 提示条 -->
    <div class="notif-hint">
      <van-icon name="info-o" size="12" color="#999" />
      <span>仅展示帖子点赞通知，收藏消息可在对应帖子页面查看</span>
    </div>

    <!-- 通知列表 -->
    <div class="notif-list" v-if="store.likedNotifs.length">
      <div
        v-for="item in store.likedNotifs"
        :key="item.id"
        class="notif-item"
        :class="{ unread: !item.read }"
        @click="onItemClick(item)"
      >
        <div class="notif-avatar" :style="{ backgroundColor: store.getUserById(item.userId)?.avatarColor || '#ccc' }">
          <span class="notif-avatar-text">{{ store.getUserById(item.userId)?.nickname?.charAt(0) || '?' }}</span>
        </div>
        <div class="notif-body">
          <div class="notif-line1">
            <span class="notif-username">{{ store.getUserById(item.userId)?.nickname || '未知用户' }}</span>
            <span class="notif-action">{{ item.content }}</span>
            <span v-if="!item.read" class="notif-dot" />
          </div>
          <div class="notif-line2">"{{ item.postPreview }}"</div>
          <div class="notif-time">{{ item.time }}</div>
        </div>
      </div>
    </div>

    <div v-else class="notif-empty">
      <van-icon name="like-o" size="48" color="#dcdfe6" />
      <p>还没有收到点赞</p>
      <span class="notif-empty-sub">当有人赞了你的帖子时，会在这里通知你</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'

const router = useRouter()
const store = useAppStore()

// 进入页面时自动清除该分类的未读角标
onMounted(() => {
  store.markAllLikesRead()
})

const unreadCount = computed(() => store.likedNotifs.filter(n => !n.read).length)

function markAllRead() {
  store.likedNotifs.forEach(n => { n.read = true })
}

function onItemClick(item) {
  item.read = true
  if (item.postId) {
    router.push(`/post/${item.postId}`)
  }
}
</script>

<style scoped>
.notif-page {
  min-height: 100%;
  background: var(--echo-bg);
}

/* ===== 顶部 ===== */
.notif-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--echo-white);
}
.back-icon { cursor: pointer; }
.notif-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--echo-text);
  flex: 1;
  text-align: center;
}
.mark-read-btn {
  font-size: 12px;
  color: var(--echo-primary);
  cursor: pointer;
  user-select: none;
  padding: 4px 10px;
  background: var(--echo-primary-light);
  border-radius: 12px;
  white-space: nowrap;
}

/* ===== 提示条 ===== */
.notif-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #fafafa;
  border-bottom: 1px solid var(--echo-border);
}
.notif-hint span {
  font-size: 11px;
  color: #999;
}

/* ===== 列表 ===== */
.notif-list {
  background: var(--echo-white);
}
.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.15s;
}
.notif-item:active { background: var(--echo-bg); }
.notif-item.unread { background: #f8fdfa; }
.notif-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.notif-avatar-text { color: #fff; font-size: 16px; font-weight: 600; }
.notif-body { flex: 1; min-width: 0; }
.notif-line1 {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}
.notif-username { font-size: 14px; font-weight: 600; color: var(--echo-text); }
.notif-action { font-size: 13px; color: var(--echo-text-secondary); }
.notif-dot {
  width: 7px; height: 7px;
  background: var(--echo-danger);
  border-radius: 50%;
  flex-shrink: 0;
  margin-left: auto;
}
.notif-line2 {
  font-size: 13px;
  color: var(--echo-text-hint);
  margin-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}
.notif-time { font-size: 11px; color: #bbb; margin-top: 4px; }

/* ===== 空状态 ===== */
.notif-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  background: var(--echo-white);
  color: var(--echo-text-hint);
  font-size: 14px;
  gap: 8px;
}
.notif-empty-sub {
  font-size: 12px;
  color: #ccc;
}
</style>
