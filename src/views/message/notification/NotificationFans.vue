<template>
  <div class="notif-page">
    <!-- 顶部 -->
    <div class="notif-header">
      <van-icon name="arrow-left" size="20" @click="$router.back()" class="back-icon" />
      <h1 class="notif-title">新增粉丝</h1>
      <span class="mark-read-btn" @click="markAllRead" v-if="unreadCount > 0">
        全部已读 ({{ unreadCount }})
      </span>
    </div>


    <!-- 粉丝列表 -->
    <div class="notif-list" v-if="store.followerNotifs.length">
      <div
        v-for="item in store.followerNotifs"
        :key="item.id"
        class="fan-item"
        :class="{ unread: !item.read }"
      >
        <!-- 左侧：头像 + 点击跳转主页 -->
        <div class="fan-left" @click="goToProfile(item)">
          <div
            class="fan-avatar"
            :style="{ backgroundColor: store.getUserById(item.userId)?.avatarColor || '#ccc' }"
          >
            <span class="fan-avatar-text">{{ store.getUserById(item.userId)?.nickname?.charAt(0) || '?' }}</span>
          </div>
          <div class="fan-info">
            <div class="fan-line1">
              <span class="fan-nickname">{{ store.getUserById(item.userId)?.nickname || '未知用户' }}</span>
              <span v-if="!item.read" class="notif-dot" />
            </div>
            <div class="fan-line2">
              <span class="fan-action">关注了你</span>
              <span class="fan-time">{{ item.time }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧：回关/已关注按钮 -->
        <button
          class="follow-back-btn"
          :class="{ followed: store.isFollowing(item.userId) }"
          @click="handleFollowBack(item)"
        >
          <template v-if="store.isFollowing(item.userId)">
            <van-icon name="success" size="14" />
            <span>已关注</span>
          </template>
          <template v-else>
            <van-icon name="plus" size="14" />
            <span>回关</span>
          </template>
        </button>
      </div>
    </div>

    <div v-else class="notif-empty">
      <van-icon name="friends-o" size="48" color="#dcdfe6" />
      <p>暂无新增粉丝</p>
      <span class="notif-empty-sub">当有人关注你时，会在这里通知你</span>
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
  store.markAllFansRead()
})

const unreadCount = computed(() => store.followerNotifs.filter(n => !n.read).length)

function markAllRead() {
  store.followerNotifs.forEach(n => { n.read = true })
}

function handleFollowBack(item) {
  item.read = true
  store.toggleFollow(item.userId)
}

function goToProfile(item) {
  item.read = true
  router.push(`/profile/${item.userId}`)
}
</script>

<style scoped>
.notif-page {
  min-height: 100%;
  background: var(--echo-bg);
}

/* ===== 顶部 ===== */
.notif-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  background: var(--echo-white);
}
.back-icon {
  position: absolute;
  left: 16px;
  cursor: pointer;
}
.notif-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--echo-text);
  text-align: center;
}
.mark-read-btn {
  position: absolute;
  right: 16px;
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

/* ===== 粉丝列表 ===== */
.notif-list {
  background: var(--echo-white);
}
.fan-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;
}
.fan-item.unread { background: #f8fdfa; }
.fan-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  cursor: pointer;
}
.fan-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.fan-avatar-text { color: #fff; font-size: 17px; font-weight: 600; }
.fan-info { flex: 1; min-width: 0; }
.fan-line1 {
  display: flex;
  align-items: center;
  gap: 6px;
}
.fan-nickname {
  font-size: 14px;
  font-weight: 600;
  color: var(--echo-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.notif-dot {
  width: 7px; height: 7px;
  background: var(--echo-danger);
  border-radius: 50%;
  flex-shrink: 0;
}
.fan-line2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.fan-action {
  font-size: 12px;
  color: var(--echo-text-secondary);
}
.fan-time {
  font-size: 11px;
  color: #bbb;
}

/* ===== 回关按钮 ===== */
.follow-back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 16px;
  border: 1px solid var(--echo-primary);
  background: var(--echo-white);
  color: var(--echo-primary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
  user-select: none;
}
.follow-back-btn:active {
  background: var(--echo-primary);
  color: #fff;
  transform: scale(0.96);
}
.follow-back-btn.followed {
  background: var(--echo-bg);
  border-color: #ddd;
  color: #999;
}
.follow-back-btn.followed:active {
  background: #fee;
  border-color: var(--echo-danger);
  color: var(--echo-danger);
}

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
