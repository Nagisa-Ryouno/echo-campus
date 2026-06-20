<template>
  <div class="my-profile-page">

    <!-- ===== 大卡片：贴边，包含顶部操作栏 + 所有个人信息 ===== -->
    <div class="profile-hero-card">

      <!-- 顶部操作栏 -->
      <div class="hero-action-bar">
        <div class="action-bar-left">
          <div class="icon-btn" @click="$router.push('/settings')">
            <van-icon name="setting-o" size="19" />
          </div>
        </div>
        <div class="action-bar-right">
          <div class="text-action-btn" @click="$router.push('/edit-profile')">编辑主页</div>
          <div class="icon-btn" @click="onForward">
            <van-icon name="share-o" size="19" />
          </div>
        </div>
      </div>

      <!-- 头像 + 基础信息 -->
      <div class="user-card-top">
        <div
          class="profile-avatar"
          :style="{ backgroundColor: store.currentUser?.avatarColor || '#4caf7d' }"
        >
          <span class="profile-avatar-text">
            {{ store.currentUser?.nickname?.charAt(0) || '我' }}
          </span>
        </div>
        <div class="user-card-info">
          <div class="uname-row">
            <span class="uname">{{ store.currentUser?.nickname || '未登录' }}</span>
            <span class="gender-tag" :class="store.currentUser?.gender || 'male'">
              {{ store.currentUser?.gender === 'female' ? '♀' : '♂' }}
            </span>
          </div>
          <div class="uecho">
            校声号：{{ store.currentUser?.echoId || '---' }}
          </div>
          <div class="school-row" v-if="store.currentUser?.school">
            学校：{{ store.currentUser.school }}
          </div>
        </div>
      </div>

      <!-- 计数行 -->
      <div class="counts-row">
        <div class="count-item">
          <span class="count-num">{{ store.currentUser?.followCount || 0 }}</span>
          <span class="count-label">关注</span>
        </div>
        <div class="count-divider" />
        <div class="count-item">
          <span class="count-num">{{ store.currentUser?.fanCount || 0 }}</span>
          <span class="count-label">粉丝</span>
        </div>
        <div class="count-divider" />
        <div class="count-item">
          <span class="count-num">{{ store.currentUser?.postCount || 0 }}</span>
          <span class="count-label">发帖</span>
        </div>
      </div>

      <!-- 个人简介 -->
      <div class="bio-section" v-if="store.currentUser?.bio">
        <span class="bio-text">{{ store.currentUser.bio }}</span>
      </div>

      <!-- 统一标签区：年龄 + 兴趣标签 -->
      <div class="tags-row" v-if="allTags.length">
        <span v-for="t in allTags" :key="t" class="unified-tag">{{ t }}</span>
      </div>

      <!-- 功能入口：三个独立浅灰圆角方框 -->
      <div class="func-blocks">
        <div class="func-block" @click="onBrowseHistory">
          <svg class="func-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>浏览记录</span>
        </div>
        <div class="func-block" @click="onDrafts">
          <svg class="func-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="5" x="2" y="3" rx="1"/>
            <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
            <line x1="10" x2="14" y1="12" y2="12"/>
          </svg>
          <span>草稿箱</span>
          <span v-if="store.drafts.length" class="func-badge">{{ store.drafts.length }}</span>
        </div>
        <div class="func-block" @click="$router.push('/circle')">
          <svg class="func-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span>我的圈子</span>
        </div>
      </div>

    </div>
    <!-- /profile-hero-card -->

    <!-- 内容 Tab（含搜索入口） -->
    <div class="content-tabs">
      <div class="tabs-inner">
        <div
          v-for="tab in contentTabs"
          :key="tab.key"
          class="content-tab"
          :class="{ active: store.profileActiveTab === tab.key }"
          @click="store.profileActiveTab = tab.key"
        >
          <span>{{ tab.label }}</span>
          <span class="tab-count">{{ tab.count }}</span>
        </div>
      </div>
      <div class="tab-search" @click="$router.push('/profile-search?from=self')">
        <van-icon name="search" size="17" color="#999" />
      </div>
    </div>

    <!-- 帖子列表 -->
    <div class="profile-posts" v-if="store.profileActiveTab === 'posts'">
      <div v-if="myPosts.length" class="post-grid">
        <div
          v-for="post in myPosts"
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
        <van-icon name="notes-o" size="40" color="#dcdfe6" />
        <p>还没有发过帖子</p>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="profile-posts" v-if="store.profileActiveTab === 'comments'">
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
        <van-icon name="chat-o" size="40" color="#dcdfe6" />
        <p>还没有评论过帖子</p>
      </div>
    </div>

    <!-- 收藏列表 -->
    <div class="profile-posts" v-if="store.profileActiveTab === 'collects'">
      <div v-if="collectedPosts.length" class="post-grid">
        <div
          v-for="post in collectedPosts"
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
        <van-icon name="star-o" size="40" color="#dcdfe6" />
        <p>还没有收藏过帖子</p>
      </div>
    </div>

    <!-- 赞过列表 -->
    <div class="profile-posts" v-if="store.profileActiveTab === 'likes'">
      <div v-if="likedPosts.length" class="post-grid">
        <div
          v-for="post in likedPosts"
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
        <van-icon name="like-o" size="40" color="#dcdfe6" />
        <p>还没有赞过帖子</p>
      </div>
    </div>

    <!-- 转发面板 -->
    <van-action-sheet
      v-model:show="showForwardSheet"
      title="转发"
      :actions="forwardActions"
      teleport="#phone-screen"
      cancel-text="取消"
      @select="onForwardSelect"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { showToast } from 'vant'

const router = useRouter()
const store = useAppStore()

// 统一标签：年龄 + 兴趣合并
const allTags = computed(() => {
  const u = store.currentUser
  if (!u) return []
  const tags = u.age ? [`${u.age}岁`] : []
  return tags.concat(u.tags || [])
})

// 内容 Tab
const contentTabs = computed(() => {
  const uid = store.currentUser?.id
  return [
    { key: 'posts', label: '帖子', count: store.getUserPosts(uid || '').length },
    { key: 'comments', label: '评论', count: store.getUserCommentedPosts(uid || '').length },
    { key: 'collects', label: '收藏', count: store.getUserCollectedPosts().length },
    { key: 'likes', label: '赞过', count: store.getUserLikedPosts().length }
  ]
})

// 我的帖子（不过滤私密，因为自己看自己的）
const myPosts = computed(() => {
  const uid = store.currentUser?.id
  if (!uid) return []
  return store.posts.filter(p => p.authorId === uid)
})

const commentedPosts = computed(() => {
  const uid = store.currentUser?.id
  if (!uid) return []
  return store.getUserCommentedPosts(uid)
})

const collectedPosts = computed(() => store.getUserCollectedPosts())
const likedPosts = computed(() => store.getUserLikedPosts())

function onEditProfile() { showToast('编辑主页（原型占位）') }
const showForwardSheet = ref(false)
const forwardActions = [
  { name: '联系人', value: 'friend' },
  { name: '圈子', value: 'circle' }
]

function onForward() {
  showForwardSheet.value = true
}

function onForwardSelect(action) {
  showForwardSheet.value = false
  showToast(`已转发个人主页至${action.name}`)
}
function onBrowseHistory() { showToast('浏览记录（原型占位）') }
function onDrafts() { showToast('草稿箱（原型占位）') }
</script>

<style scoped>
.my-profile-page {
  min-height: 100%;
  background: var(--echo-bg);
  padding-bottom: 20px;
}

/* ===== 英雄大卡片：贴边，无外边距，圆角底部 ===== */
.profile-hero-card {
  background: var(--echo-white);
  border-radius: 0;
  padding: 0 16px 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.03);
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
  gap: 12px;
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
}
.icon-btn:active { background: var(--echo-bg); }
.text-action-btn {
  font-size: 13px;
  color: var(--echo-primary);
  padding: 5px 12px;
  background: var(--echo-primary-light);
  border-radius: 14px;
  cursor: pointer;
  font-weight: 500;
  user-select: none;
  transition: opacity 0.15s;
}
.text-action-btn:active { opacity: 0.7; }

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
  box-shadow: 0 4px 12px rgba(76,175,125,0.25);
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
.school-row {
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
  cursor: pointer;
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
  margin-top: 12px;
  padding: 0 4px;
}
.bio-text {
  font-size: 12.5px;
  color: var(--echo-text-secondary);
  line-height: 1.5;
}

/* ===== 统一标签区：年龄 + 兴趣标签 ===== */
.tags-row {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
  padding: 0 4px;
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

/* ===== 功能入口：三个独立浅灰圆角方框 ===== */
.func-icon {
  color: #ff6b35;
  flex-shrink: 0;
  display: block;
}
.func-blocks {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.func-block {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 4px;
  background: #f5f6f8;
  border-radius: 10px;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  position: relative;
  user-select: none;
}
.func-block:active { background: #eef0f3; transform: scale(0.97); }
.func-badge {
  position: absolute;
  top: -4px;
  right: -2px;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: var(--echo-accent);
  border-radius: 8px;
  padding: 0 4px;
  border: 1.5px solid #fff;
}

/* ===== 内容 Tab ===== */
.content-tabs {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 12px;
  margin-top: 0;
  background: var(--echo-white);
  border-top: 1px solid var(--echo-border);
  border-bottom: 1px solid var(--echo-border);
  position: sticky;
  top: 0;
  z-index: 50;
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

/* ===== 帖子网格 ===== */
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
  padding: 0 8px;
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
  gap: 8px;
}
</style>
