<template>
  <div class="user-profile-page">

    <!-- ===== 三点「更多」弹出菜单（Teleport 到 phone-screen） ===== -->
    <Teleport to="#phone-screen">
      <transition name="more-fade">
        <div v-if="showMoreMenu" class="more-menu-overlay" @click.self="closeMoreMenu">
          <div class="more-bubble">
            <div class="more-bubble-arrow"></div>
            <div class="more-bubble-item" @click="onBlock">
              <div class="more-bubble-icon" style="background:#fdecea;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="4" x2="20" y2="20"/><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <span>拉黑</span>
            </div>
            <div class="more-bubble-item" @click="onForwardFromProfile">
              <div class="more-bubble-icon" style="background:#e3f2fd;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1976d2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              </div>
              <span>转发</span>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- 站内转发面板（仅好友 / 圈子，移除本校信息流） -->
    <van-action-sheet
      v-model:show="showForwardSheet"
      title="站内转发"
      :actions="forwardActions"
      teleport="#phone-screen"
      @select="onForwardSelect"
      cancel-text="取消"
    />

    <!-- ===== 大卡片：贴边，包含顶部操作栏 + 所有个人信息 ===== -->
    <div class="profile-hero-card">

      <!-- 顶部操作栏 -->
      <div class="hero-action-bar">
        <div class="action-bar-left">
          <div class="icon-btn" @click="$router.back()">
            <van-icon name="arrow-left" size="19" />
          </div>
        </div>
        <div class="action-bar-right">
          <button
            class="action-btn follow-btn"
            :class="{ followed: isFollowed }"
            @click="onFollow"
          >
            <van-icon :name="isFollowed ? 'success' : 'add-o'" size="14" />
            <span>{{ isFollowed ? '已关注' : '关注' }}</span>
          </button>
          <button class="action-btn chat-btn" @click="onChat">
            <van-icon name="chat-o" size="14" />
            <span>私信</span>
          </button>
          <div class="icon-btn" @click="onMore">
            <van-icon name="ellipsis" size="19" />
          </div>
        </div>
      </div>

      <!-- 头像 + 基础信息 -->
      <div class="user-card-top">
        <div
          class="profile-avatar"
          :style="{ backgroundColor: profileUser?.avatarColor || '#ccc' }"
        >
          <span class="profile-avatar-text">
            {{ profileUser?.nickname?.charAt(0) || '?' }}
          </span>
        </div>
        <div class="user-card-info">
          <div class="uname-row">
            <span class="uname">{{ profileUser?.nickname || '未知用户' }}</span>
            <span class="gender-tag" :class="profileUser?.gender || 'male'">
              {{ profileUser?.gender === 'female' ? '♀' : '♂' }}
            </span>
          </div>
          <div class="uecho">回声号：{{ profileUser?.echoId || '---' }}</div>
          <div class="uschool" v-if="showSchoolToVisitor">
            学校：{{ profileUser?.school }}
          </div>
        </div>
      </div>

      <!-- 计数行 -->
      <div class="counts-row">
        <div class="count-item">
          <span class="count-num">{{ profileUser?.followCount || 0 }}</span>
          <span class="count-label">关注</span>
        </div>
        <div class="count-divider" />
        <div class="count-item">
          <span class="count-num">{{ profileUser?.fanCount || 0 }}</span>
          <span class="count-label">粉丝</span>
        </div>
        <div class="count-divider" />
        <div class="count-item">
          <span class="count-num">{{ profileUser?.postCount || 0 }}</span>
          <span class="count-label">发帖</span>
        </div>
      </div>

      <!-- 个人简介 -->
      <div class="bio-section" v-if="profileUser?.bio">
        <span class="bio-text">{{ profileUser.bio }}</span>
      </div>

      <!-- 统一标签区：年龄 + 兴趣标签 -->
      <div class="tags-row">
        <span class="unified-tag">{{ profileUser?.age }}岁</span>
        <span v-for="tag in profileUser?.tags || []" :key="tag" class="unified-tag">{{ tag }}</span>
      </div>

    </div>
    <!-- /profile-hero-card -->

    <!-- 内容 Tab -->
    <div class="content-tabs" :class="{ 'is-scrolled': isScrolled }">
      <div class="tabs-inner">
        <div
          v-for="tab in contentTabs"
          :key="tab.key"
          class="content-tab"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <span>{{ tab.label }}</span>
          <span class="tab-count">{{ tab.count }}</span>
        </div>
      </div>
      <div class="tab-search" @click="$router.push(`/profile-search?from=user&uid=${uid}`)">
        <van-icon name="search" size="17" color="#999" />
      </div>
    </div>

    <!-- 帖子 -->
    <div class="profile-posts" v-if="activeTab === 'posts'">
      <div v-if="visiblePosts.length" class="post-grid">
        <div
          v-for="post in visiblePosts"
          :key="post.id"
          class="grid-post-card"
          @click="$router.push(`/post/${post.id}`)"
        >
          <div class="grid-post-img" v-if="post.images?.[0]">
            <img :src="post.images[0]" alt="" />
          </div>
          <div class="grid-post-body">
            <div class="grid-post-text">{{ post.content }}</div>
            <div class="grid-post-meta">
              <span class="grid-post-tag">{{ post.categoryTag }}</span>
              <span class="grid-post-counts">
                <van-icon name="like-o" size="12" />{{ post.likeCount }}
                <van-icon name="chat-o" size="12" />{{ post.commentCount }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-content">
        <van-icon name="lock" size="36" color="#dcdfe6" />
        <p>暂无可见内容</p>
        <p class="empty-sub">对方设置了隐私保护</p>
      </div>
    </div>

    <!-- 评论过的 -->
    <div class="profile-posts" v-if="activeTab === 'comments'">
      <div v-if="commentedPosts.length" class="post-grid">
        <div
          v-for="post in commentedPosts"
          :key="post.id"
          class="grid-post-card"
          @click="$router.push(`/post/${post.id}`)"
        >
          <div class="grid-post-img" v-if="post.images?.[0]">
            <img :src="post.images[0]" alt="" />
          </div>
          <div class="grid-post-body">
            <div class="grid-post-text">{{ post.content }}</div>
            <div class="grid-post-meta">
              <span class="grid-post-tag">{{ post.categoryTag }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-content">
        <p>暂无可见内容</p>
      </div>
    </div>

    <!-- 收藏的 -->
    <div class="profile-posts" v-if="activeTab === 'collects'">
      <div class="empty-content">
        <van-icon name="lock" size="36" color="#dcdfe6" />
        <p>收藏夹仅自己可见</p>
      </div>
    </div>

    <!-- 赞过 -->
    <div class="profile-posts" v-if="activeTab === 'likes'">
      <div class="empty-content">
        <van-icon name="lock" size="36" color="#dcdfe6" />
        <p>赞过内容仅自己可见</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { useScrollCollapse } from '@/composables/useScrollCollapse.js'
import { showToast, showConfirmDialog } from 'vant'

const route = useRoute()
const router = useRouter()
const store = useAppStore()

const { isScrolled } = useScrollCollapse(0)

const activeTab = ref('posts')
const uid = computed(() => route.params.uid)

// 三点菜单
const showMoreMenu = ref(false)

// 站内转发
const showForwardSheet = ref(false)
const forwardActions = [
  { name: '站内好友', value: 'friend' },
  { name: '已加入的圈子', value: 'circle' }
]

const profileUser = computed(() => {
  if (uid.value === 'demo' || !uid.value) return store.users[1] || store.currentUser
  return store.getUserById(uid.value)
})

const isFollowed = computed(() => {
  if (!profileUser.value) return false
  return store.isFollowing(profileUser.value.id)
})

// 学校可见性：public 所有人可见 / school_only 仅同校可见 / hidden 完全隐藏
const showSchoolToVisitor = computed(() => {
  if (!profileUser.value) return false
  const setting = profileUser.value.showSchool
  if (setting === 'public') return true
  if (setting === 'hidden') return false
  if (setting === 'school_only') {
    return store.currentUser?.school === profileUser.value.school
  }
  return false
})

// 可见帖子（过滤私密和匿名）
const visiblePosts = computed(() => {
  if (!profileUser.value) return []
  return store.posts.filter(p =>
    p.authorId === profileUser.value.id &&
    p.visibility !== 'private' &&
    !p.isAnon
  )
})

const commentedPosts = computed(() => {
  if (!profileUser.value) return []
  return store.getUserCommentedPosts(profileUser.value.id)
})

const contentTabs = computed(() => [
  { key: 'posts', label: '帖子', count: visiblePosts.value.length },
  { key: 'comments', label: '评论', count: commentedPosts.value.length },
  { key: 'collects', label: '收藏', count: 0 },
  { key: 'likes', label: '赞过', count: 0 }
])

function onFollow() {
  if (!profileUser.value) return
  store.toggleFollow(profileUser.value.id)
  showToast(isFollowed.value ? '已取消关注' : '已关注')
}

function onChat() {
  if (!profileUser.value) return
  showToast(`与 ${profileUser.value.nickname} 的私聊（原型占位）`)
}

// ===== 三点菜单逻辑 =====
function onMore() {
  showMoreMenu.value = true
}

function closeMoreMenu() {
  showMoreMenu.value = false
}

async function onBlock() {
  if (!profileUser.value) return
  const uname = profileUser.value.nickname || '该用户'
  try {
    await showConfirmDialog({
      title: '拉黑用户',
      message: `确认要拉黑${uname}？`
    })
    store.blockUser(profileUser.value.id)
    showMoreMenu.value = false
    showToast(`已拉黑${uname}`)
  } catch {
    // 用户点击取消，不做任何操作
  }
}

function onForwardFromProfile() {
  showMoreMenu.value = false
  showForwardSheet.value = true
}

function onForwardSelect(action) {
  showForwardSheet.value = false
  if (!profileUser.value) return
  const targetMap = { friend: '站内好友', circle: '圈子' }
  showToast(`已转发至${targetMap[action.value] || action.name}`)
}
</script>

<style scoped>
.user-profile-page {
  min-height: 100%;
  background: var(--echo-bg);
  padding-bottom: 20px;
}

/* ===== 英雄大卡片：贴边，无外边距，圆角底部 ===== */
.profile-hero-card {
  background: var(--echo-white);
  border-radius: 0 0 20px 20px;
  padding: 0 16px 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  /* 左右贴边，无 margin */
}

/* ===== 顶部操作栏（卡片内部） ===== */
.hero-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 8px;
}
.action-bar-left,
.action-bar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  color: var(--echo-text-secondary);
  transition: background 0.15s;
  flex-shrink: 0;
}
.icon-btn:active { background: var(--echo-bg); }

/* 关注 / 私信按钮 */
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 14px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}
.action-btn:active { transform: scale(0.95); }
.follow-btn {
  background: var(--echo-primary);
  color: #fff;
}
.follow-btn.followed {
  background: var(--echo-bg);
  color: var(--echo-text-secondary);
}
.chat-btn {
  background: var(--echo-bg);
  color: var(--echo-text);
}

/* ===== 头像 + 基础信息 ===== */
.user-card-top {
  display: flex;
  gap: 14px;
  align-items: center;
  padding-top: 4px;
}
.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.profile-avatar-text {
  color: #fff;
  font-size: 24px;
  font-weight: 700;
}
.user-card-info { flex: 1; min-width: 0; }
.uname-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.uname {
  font-size: 18px;
  font-weight: 700;
  color: var(--echo-text);
}
.gender-tag {
  font-size: 12px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.gender-tag.male { background: #3498db; }
.gender-tag.female { background: #e74c3c; }
.uecho {
  font-size: 12px;
  color: var(--echo-text-secondary);
  margin-top: 4px;
}
.uschool {
  font-size: 12px;
  color: var(--echo-text-secondary);
  margin-top: 2px;
}

/* ===== 计数行 ===== */
.counts-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 16px;
  padding: 0 8px;
}
.count-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.count-num { font-size: 18px; font-weight: 700; color: var(--echo-text); }
.count-label { font-size: 11px; color: var(--echo-text-secondary); }
.count-divider {
  width: 1px;
  height: 24px;
  background: var(--echo-border);
}

/* ===== 简介 ===== */
.bio-section {
  margin-top: 14px;
  padding: 12px;
  background: var(--echo-bg);
  border-radius: 8px;
}
.bio-text { font-size: 13px; color: var(--echo-text-secondary); line-height: 1.5; }

/* ===== 统一标签区 ===== */
.tags-row {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
}
.unified-tag {
  font-size: 12px;
  color: #2e7d32;
  background: #e8f5e9;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
  white-space: nowrap;
}

/* ===== 内容 Tab ===== */
.content-tabs {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 12px;
  margin-top: 8px;
  background: var(--echo-white);
  border-top: 1px solid var(--echo-border);
  border-bottom: 1px solid var(--echo-border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: none;
  transition:
    background 0.25s ease,
    box-shadow 0.25s ease,
    backdrop-filter 0.25s ease,
    -webkit-backdrop-filter 0.25s ease;
}

/* 滚动后：毛玻璃 + 双层阴影 */
.content-tabs.is-scrolled {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: saturate(180%) blur(16px);
  -webkit-backdrop-filter: saturate(180%) blur(16px);
  box-shadow:
    0 1px 0 var(--echo-border),
    0 6px 20px rgba(0, 0, 0, 0.07);
}
.tabs-inner {
  display: flex;
  flex: 1;
}
.content-tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 13px;
  color: var(--echo-text-secondary);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
}
.content-tab.active {
  color: var(--echo-primary);
  font-weight: 600;
}
.content-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: var(--echo-primary);
  border-radius: 2px;
}
.tab-count {
  font-size: 11px;
  color: var(--echo-text-hint);
}
.tab-search {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  margin-left: 2px;
  transition: background 0.15s;
}
.tab-search:active { background: var(--echo-bg); }

/* ===== 帖子列表 ===== */
.profile-posts { padding: 0; }
.post-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.grid-post-card {
  background: var(--echo-white);
  border-radius: 0;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  border-bottom: 1px solid var(--echo-border);
}
.grid-post-card:active { background: #f5f7fa; }
.grid-post-img {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  overflow: hidden;
}
.grid-post-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.grid-post-body {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}
.grid-post-text {
  font-size: 13px;
  color: var(--echo-text);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.grid-post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
}
.grid-post-tag {
  font-size: 11px;
  color: var(--echo-primary);
  background: var(--echo-primary-light);
  padding: 2px 8px;
  border-radius: 8px;
}
.grid-post-counts {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--echo-text-hint);
}

/* ===== 空状态 ===== */
.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
  color: var(--echo-text-hint);
  font-size: 13px;
  gap: 4px;
}
.empty-sub { font-size: 11px; color: var(--echo-text-hint); margin-top: 0; }

/* ===== 三点「更多」弹出菜单（复用消息页 + 号菜单规范） ===== */
.more-menu-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9999;
}

.more-bubble {
  position: absolute;
  top: 85px;
  right: 8px;
  min-width: 128px;
  z-index: 10000;
  background: #ffffff;
  border-radius: 12px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.18),
    0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 6px 0;
  overflow: visible;
}

/* 三角箭头 —— 指向上方的三点按钮 */
.more-bubble-arrow {
  position: absolute;
  top: -7px;
  right: 14px;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 8px solid #ffffff;
}

/* 竖向菜单项 */
.more-bubble-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.12s;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.more-bubble-item:first-child { border-radius: 12px 12px 0 0; }
.more-bubble-item:last-child  { border-radius: 0 0 12px 12px; }
.more-bubble-item:active { background: var(--echo-bg); }
.more-bubble-item span {
  font-size: 14px;
  font-weight: 500;
  color: var(--echo-text);
  white-space: nowrap;
}

/* 菜单项左侧圆形图标 */
.more-bubble-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ===== 弹出 / 隐藏动画 ===== */
.more-fade-enter-active { transition: opacity 0.2s ease; }
.more-fade-leave-active { transition: opacity 0.18s ease; }
.more-fade-enter-from,
.more-fade-leave-to { opacity: 0; }

/* 气泡从右上角缩放弹出 */
.more-fade-enter-active .more-bubble {
  animation: morePopIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.more-fade-leave-active .more-bubble {
  animation: morePopOut 0.16s ease;
}

@keyframes morePopIn {
  from {
    opacity: 0;
    transform: scale(0.75);
    transform-origin: top right;
  }
  to {
    opacity: 1;
    transform: scale(1);
    transform-origin: top right;
  }
}

@keyframes morePopOut {
  to    { opacity: 0; transform: scale(0.85); }
  from  { opacity: 1; transform: scale(1); }
  transform-origin: top right;
}
</style>
