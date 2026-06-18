<template>
  <div class="my-profile-page">
    <!-- 顶部导航栏 -->
    <div class="profile-nav">
      <div class="profile-nav-left">
        <van-icon name="setting-o" size="20" @click="$router.push('/settings')" />
      </div>
      <div class="profile-nav-right">
        <span class="nav-btn" @click="onEditProfile">编辑主页</span>
        <van-icon name="share-o" size="20" @click="onShare" />
      </div>
    </div>

    <!-- 用户信息卡片 -->
    <div class="user-card">
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

      <!-- 声望值：仅自己可见 -->
      <div class="reputation-row">
        <div class="rep-left">
          <van-icon name="star-o" size="14" color="#f39c12" />
          <span class="rep-title">声望值</span>
          <span class="rep-hint">仅自己可见</span>
        </div>
        <span class="rep-value">{{ store.currentUser?.reputation || 0 }}</span>
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

      <!-- 统一标签区：年龄 + 兴趣标签，浅绿背景 + 深绿文字 -->
      <div class="tags-row" v-if="allTags.length">
        <span v-for="t in allTags" :key="t" class="unified-tag">{{ t }}</span>
      </div>

      <!-- 功能入口：三个独立浅灰圆角方框 -->
      <div class="func-blocks">
        <div class="func-block" @click="onBrowseHistory">
          <van-icon name="clock-o" size="16" color="#ff6b35" />
          <span>浏览记录</span>
        </div>
        <div class="func-block" @click="onDrafts">
          <van-icon name="orders-o" size="16" color="#ff6b35" />
          <span>草稿箱</span>
          <span v-if="store.drafts.length" class="func-badge">{{ store.drafts.length }}</span>
        </div>
        <div class="func-block" @click="$router.push('/circle')">
          <van-icon name="cluster-o" size="16" color="#ff6b35" />
          <span>我的圈子</span>
        </div>
      </div>
    </div>

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
function onShare() { showToast('已生成个人主页分享卡片') }
function onBrowseHistory() { showToast('浏览记录（原型占位）') }
function onDrafts() { showToast('草稿箱（原型占位）') }
</script>

<style scoped>
.my-profile-page {
  min-height: 100%;
  background: var(--echo-bg);
  padding-bottom: 20px;
}

/* ===== 顶部导航 ===== */
.profile-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
}
.profile-nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.nav-btn {
  font-size: 13px;
  color: var(--echo-primary);
  padding: 4px 10px;
  background: var(--echo-primary-light);
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
}

/* ===== 用户信息卡片 ===== */
.user-card {
  background: var(--echo-white);
  margin: 0 12px;
  border-radius: 16px;
  padding: 20px 16px 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
.user-card-top {
  display: flex;
  gap: 14px;
  align-items: center;
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

/* 声望 */
.reputation-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  padding: 10px 12px;
  background: linear-gradient(135deg, #fff8e1, #fffde7);
  border-radius: 10px;
}
.rep-left {
  display: flex;
  align-items: center;
  gap: 6px;
}
.rep-title {
  font-size: 12px;
  color: var(--echo-text-secondary);
}
.rep-hint {
  font-size: 10px;
  color: var(--echo-text-hint);
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 6px;
}
.rep-value {
  font-size: 18px;
  font-weight: 700;
  color: #f39c12;
}

/* 计数行 */
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

/* 简介 */
.bio-section {
  margin-top: 14px;
  padding: 12px;
  background: var(--echo-bg);
  border-radius: 8px;
}
.bio-text { font-size: 13px; color: var(--echo-text-secondary); line-height: 1.5; }

/* ===== 统一标签区：年龄 + 兴趣标签，浅绿背景 + 深绿文字 ===== */
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

/* ===== 功能入口：三个独立浅灰圆角方框 ===== */
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
  margin-top: 10px;
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
.profile-posts { padding: 10px 12px; }
.post-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.grid-post-card {
  background: var(--echo-white);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  display: flex;
}
.grid-post-card:active { transform: scale(0.985); }
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
