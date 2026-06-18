<template>
  <div class="home-page">
    <!-- ===== 固定头部区域（sticky）===== -->
    <div class="sticky-header-wrap">
      <!-- 顶部搜索栏 -->
      <div class="home-header">
        <h1 class="home-title">校声</h1>
        <div class="home-search" @click="$router.push('/search')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      <!-- 五大频道切换 -->
      <div class="channel-tabs">
        <div
          v-for="ch in store.channelLabels"
          :key="ch.key"
          class="channel-tab"
          :class="{ 'channel-tab--active': store.activeChannel === ch.key }"
          @click="onChannelSwitch(ch.key)"
        >
          <span class="channel-tab-text">{{ ch.label }}</span>
          <span v-if="store.activeChannel === ch.key" class="channel-tab-bar"></span>
        </div>
      </div>

      <!-- 小频道区域：不同频道展示不同内容 -->
      <!-- 遇见频道 → 无标签栏 -->
      <!-- 关注频道 → 已关注用户头像横滑 -->
      <div v-if="store.activeChannel === 'follow'" class="follow-avatars-bar">
        <div class="follow-avatars-scroll">
          <!-- 全部 -->
          <div
            class="follow-avatar-item"
            :class="{ 'follow-avatar-item--active': followFilterUid === null }"
            @click="followFilterUid = null"
          >
            <div class="follow-avatar-ring">
              <span class="follow-avatar-all-text">全部</span>
            </div>
          </div>
          <!-- 已关注用户头像（有红点模拟未读） -->
          <div
            v-for="user in store.followedUsers"
            :key="user.id"
            class="follow-avatar-item"
            :class="{ 'follow-avatar-item--active': followFilterUid === user.id }"
            @click="followFilterUid = followFilterUid === user.id ? null : user.id"
          >
            <div class="follow-avatar-ring">
              <div
                class="follow-avatar-img"
                :style="{ background: user.avatarColor }"
              >
                {{ user.nickname.slice(0, 1) }}
              </div>
            </div>
            <span class="follow-avatar-name">{{ user.nickname.length > 3 ? user.nickname.slice(0, 3) + '…' : user.nickname }}</span>
          </div>
          <!-- 关注管理 -->
          <div class="follow-avatar-item follow-avatar-manage" @click="onFollowManage">
            <div class="follow-avatar-ring follow-avatar-ring--manage">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 推荐 / 同城 / 我的学校 → 小标签横向滑动 -->
      <div v-else-if="store.currentChannelTags.length > 0" class="sub-tags-area">
        <div class="sub-tags-scroll" ref="tagsScrollRef">
          <div
            v-for="tag in store.visibleTags"
            :key="tag"
            class="sub-tag"
            :class="{ 'sub-tag--active': store.activeCategoryTag === tag }"
            @click="store.setCategoryTag(tag)"
          >
            {{ tag }}
          </div>
        </div>
        <div class="sub-tags-expand" @click="openTagPanel">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
    </div>

    <!-- ===== 内容区域 ===== -->
    <!-- 遇见频道：用户推荐卡片 -->
    <div v-if="store.activeChannel === 'meet'" class="meet-users">
      <div class="section-title">
        <span>可能感兴趣的人</span>
        <span class="section-title-hint">基于你的兴趣推荐</span>
      </div>
      <div class="meet-user-grid">
        <div
          v-for="user in meetUsers"
          :key="user.id"
          class="meet-user-card"
          @click="$router.push(`/profile/${user.id}`)"
        >
          <div class="meet-user-avatar" :style="{ background: user.avatarColor }">
            {{ user.nickname.slice(0, 1) }}
          </div>
          <div class="meet-user-name">{{ user.nickname }}</div>
          <div class="meet-user-school">{{ user.school }}</div>
          <div class="meet-user-tags">
            <span v-for="t in user.tags.slice(0, 2)" :key="t" class="meet-user-tag">{{ t }}</span>
          </div>
          <div class="meet-user-stats">
            <span>{{ user.postCount }} 帖</span>
            <span class="meet-user-divider">·</span>
            <span>{{ user.fanCount }} 粉丝</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 其他频道：帖子卡片流 -->
    <div v-else class="post-feed">
      <div v-if="displayPosts.length === 0" class="empty-feed">
        <div class="empty-icon">📭</div>
        <p>这里还没有内容</p>
        <p class="empty-hint">去发布第一条帖子吧</p>
      </div>

      <div
        v-for="post in displayPosts"
        :key="post.id"
        class="post-card"
        @click="goPostDetail(post.id)"
      >
        <!-- 帖子头部 -->
        <div class="post-card-header">
          <div
            class="post-card-avatar"
            :style="{ background: getAuthor(post.authorId)?.avatarColor || '#ccc' }"
            @click.stop="goUserProfile(post.authorId)"
          >
            <template v-if="post.isAnon">匿</template>
            <template v-else>{{ getAuthor(post.authorId)?.nickname?.slice(0, 1) || '?' }}</template>
          </div>
          <div class="post-card-meta" @click.stop="goUserProfile(post.authorId)">
            <div class="post-card-name">
              <template v-if="post.isAnon">匿名用户</template>
              <template v-else>{{ getAuthor(post.authorId)?.nickname || '未知' }}</template>
            </div>
            <div class="post-card-time">{{ post.createdAt }}</div>
          </div>
          <div class="post-card-tag" v-if="post.categoryTag">
            <span class="tag-badge">{{ post.categoryTag }}</span>
          </div>
        </div>

        <!-- 帖子正文 -->
        <div class="post-card-body">
          <p class="post-card-content">{{ post.content }}</p>
        </div>

        <!-- 帖子图片 -->
        <div v-if="post.images && post.images.length" class="post-card-images">
          <div
            v-for="(img, idx) in post.images"
            :key="idx"
            class="post-card-img"
            :class="{ 'post-card-img--single': post.images.length === 1 }"
          >
            <div class="img-placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
          </div>
        </div>

        <!-- 帖子底部互动 -->
        <div class="post-card-footer">
          <div class="post-card-action" @click.stop="store.toggleLike(post.id)">
            <svg width="18" height="18" viewBox="0 0 24 24" :fill="store.isPostLiked(post.id) ? 'var(--echo-danger)' : 'none'" :stroke="store.isPostLiked(post.id) ? 'var(--echo-danger)' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span>{{ post.likeCount }}</span>
          </div>
          <div class="post-card-action" @click.stop="goPostDetail(post.id)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>{{ post.commentCount }}</span>
          </div>
          <div class="post-card-action" @click.stop="store.toggleCollect(post.id)">
            <svg width="18" height="18" viewBox="0 0 24 24" :fill="store.isPostCollected(post.id) ? 'var(--echo-warning)' : 'none'" :stroke="store.isPostCollected(post.id) ? 'var(--echo-warning)' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>{{ post.collectCount }}</span>
          </div>
          <div class="post-card-action post-card-share" @click.stop="onShare(post.id)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 标签管理面板（内嵌，锁定背景滚动）===== -->
    <Teleport to="#phone-screen">
      <transition name="panel-slide">
        <div v-if="showTagPanel" class="tag-panel-overlay" @click.self="closeTagPanel">
          <div class="tag-panel-sheet">
            <div class="tag-panel-header">
              <h3>管理标签</h3>
              <span class="tag-panel-close" @click="closeTagPanel">完成</span>
            </div>
            <p class="tag-panel-hint">
              当前频道：
              <strong>{{ channelDisplayName }}</strong> · 点击标签切换显示/隐藏
            </p>
            <div class="tag-panel-grid">
              <div
                v-for="tag in store.userTags"
                :key="tag"
                class="tag-panel-item"
                :class="{ 'tag-panel-item--hidden': store.hiddenTags.includes(tag) }"
                @click="store.toggleTagVisibility(tag)"
              >
                {{ tag }}
              </div>
            </div>
            <div v-if="store.userTags.length === 0" class="tag-panel-empty">
              此频道无需管理标签
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- ===== 分享面板 ===== -->
    <Teleport to="#phone-screen">
      <transition name="panel-slide">
        <div v-if="showShare" class="tag-panel-overlay" @click.self="closeShare">
          <div class="tag-panel-sheet">
            <div class="tag-panel-header">
              <h3>分享</h3>
              <span class="tag-panel-close" @click="closeShare">取消</span>
            </div>
            <div class="share-grid">
              <div v-for="opt in shareOptions" :key="opt.name" class="share-item">
                <div class="share-icon">{{ opt.emoji }}</div>
                <span class="share-label">{{ opt.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'

const router = useRouter()
const store = useAppStore()

// ===== 频道切换（同步标签池）=====
const channelDisplayName = computed(() => {
  const ch = store.channelLabels.find(c => c.key === store.activeChannel)
  return ch ? ch.label : ''
})

function onChannelSwitch(key) {
  store.setChannel(key)
  store.syncTagsToChannel(key)
}

// 首次加载同步推荐频道标签
if (store.userTags.length === 0 || store.activeChannel === 'recommend') {
  store.syncTagsToChannel(store.activeChannel)
}

// ===== 标签面板 =====
const showTagPanel = ref(false)
const tagsScrollRef = ref(null)

function openTagPanel() {
  showTagPanel.value = true
  store.lockPhoneScroll()
}

function closeTagPanel() {
  showTagPanel.value = false
  store.unlockPhoneScroll()
}

// ===== 分享面板 =====
const showShare = ref(false)
const shareOptions = [
  { name: '微信', emoji: '💬' },
  { name: '朋友圈', emoji: '🟢' },
  { name: 'QQ', emoji: '🐧' },
  { name: '复制链接', emoji: '🔗' }
]

function onShare(postId) {
  showShare.value = true
  store.lockPhoneScroll()
}

function closeShare() {
  showShare.value = false
  store.unlockPhoneScroll()
}

// ===== 关注频道 - 用户筛选 =====
const followFilterUid = ref(null)

// 关注频道按用户筛选帖子
const displayPosts = computed(() => {
  if (store.activeChannel === 'follow' && followFilterUid.value) {
    return store.filteredPosts.filter(p => p.authorId === followFilterUid.value)
  }
  return store.filteredPosts
})

// 关注管理（当前阶段占位）
function onFollowManage() {
  // 后续可跳转到关注管理页面
}

// ===== 遇见频道推荐用户 =====
const meetUsers = computed(() => {
  return store.users.filter(u => u.id !== 'u1').slice(0, 6)
})

// ===== 工具函数 =====
function getAuthor(uid) {
  return store.getUserById(uid)
}

function goPostDetail(postId) {
  router.push(`/post/${postId}`)
}

function goUserProfile(uid) {
  router.push(`/profile/${uid}`)
}

// ===== 清理：组件卸载时恢复滚动 =====
import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => {
  store.unlockPhoneScroll()
})
</script>

<style scoped>
/* ===== 页面容器 ===== */
.home-page {
  min-height: 100%;
  background: var(--echo-bg);
  max-width: 375px;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* ===== 固定头部 ===== */
.sticky-header-wrap {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--echo-white);
  max-width: 375px;
  box-sizing: border-box;
}

/* ===== 顶部搜索栏 ===== */
.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
}

.home-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--echo-text);
  letter-spacing: 0.5px;
}

.home-search {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--echo-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--echo-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.home-search:active {
  background: var(--echo-border);
  transform: scale(0.95);
}

/* ===== 五大频道 ===== */
.channel-tabs {
  display: flex;
  padding: 0 8px;
  border-bottom: 1px solid var(--echo-border);
}

.channel-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
  min-width: 0;
}

.channel-tab-text {
  font-size: 15px;
  color: var(--echo-text-secondary);
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.channel-tab--active .channel-tab-text {
  color: var(--echo-text);
  font-weight: 600;
}

.channel-tab-bar {
  position: absolute;
  bottom: 0;
  width: 24px;
  height: 3px;
  border-radius: 2px;
  background: var(--echo-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== 关注频道：用户头像横滑栏 ===== */
.follow-avatars-bar {
  padding: 8px 0;
  border-bottom: 1px solid var(--echo-border);
  background: var(--echo-white);
}

.follow-avatars-scroll {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 12px;
}

.follow-avatars-scroll::-webkit-scrollbar {
  display: none;
}

.follow-avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  flex-shrink: 0;
  min-width: 56px;
  padding: 2px 4px;
  -webkit-tap-highlight-color: transparent;
}

.follow-avatar-item--active .follow-avatar-ring {
  border-color: var(--echo-primary);
  box-shadow: 0 0 0 2px rgba(76, 175, 125, 0.3);
}

.follow-avatar-ring {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid var(--echo-border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: var(--echo-bg);
}

.follow-avatar-ring--manage {
  border-style: dashed;
}

.follow-avatar-img {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.follow-avatar-all-text {
  font-size: 11px;
  color: var(--echo-text-secondary);
  font-weight: 500;
}

.follow-avatar-name {
  font-size: 10px;
  color: var(--echo-text-hint);
  white-space: nowrap;
  max-width: 52px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== 小频道标签（推荐/同城/我的学校）===== */
.sub-tags-area {
  display: flex;
  align-items: center;
  padding: 8px 0 8px 12px;
  border-bottom: 1px solid var(--echo-border);
  background: var(--echo-white);
}

.sub-tags-scroll {
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  min-width: 0;
}

.sub-tags-scroll::-webkit-scrollbar {
  display: none;
}

.sub-tag {
  flex-shrink: 0;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 13px;
  background: var(--echo-bg);
  color: var(--echo-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}

.sub-tag--active {
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  font-weight: 600;
}

.sub-tags-expand {
  flex-shrink: 0;
  width: 44px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--echo-text-hint);
  cursor: pointer;
  background: linear-gradient(90deg, transparent 0%, var(--echo-white) 50%);
}

/* ===== 遇见频道 - 用户卡片 ===== */
.meet-users {
  padding: 16px 12px;
  max-width: 375px;
  box-sizing: border-box;
}

.section-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--echo-text);
}

.section-title-hint {
  font-size: 12px;
  color: var(--echo-text-hint);
  font-weight: 400;
}

.meet-user-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.meet-user-card {
  background: var(--echo-white);
  border-radius: var(--echo-radius);
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 0;
}

.meet-user-card:active {
  transform: scale(0.98);
}

.meet-user-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
}

.meet-user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--echo-text);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meet-user-school {
  font-size: 11px;
  color: var(--echo-text-hint);
}

.meet-user-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.meet-user-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--echo-primary-light);
  color: var(--echo-primary);
}

.meet-user-stats {
  font-size: 11px;
  color: var(--echo-text-hint);
}

.meet-user-divider {
  margin: 0 4px;
  opacity: 0.5;
}

/* ===== 帖子流 ===== */
.post-feed {
  padding: 0;
}

.empty-feed {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  color: var(--echo-text-hint);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-hint {
  font-size: 13px;
  margin-top: 4px;
}

/* ===== 帖子卡片 ===== */
.post-card {
  background: var(--echo-white);
  margin: 8px 12px;
  border-radius: var(--echo-radius);
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s;
  max-width: calc(375px - 24px);
  box-sizing: border-box;
}

.post-card:active {
  transform: scale(0.99);
}

.post-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  min-width: 0;
}

.post-card-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.post-card-meta {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.post-card-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--echo-text);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-card-time {
  font-size: 12px;
  color: var(--echo-text-hint);
}

.tag-badge {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 12px;
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.post-card-body {
  margin-bottom: 10px;
}

.post-card-content {
  font-size: 14px;
  color: var(--echo-text);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.post-card-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-bottom: 12px;
}

.post-card-img {
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}

.post-card-img--single {
  grid-column: span 2;
  grid-row: span 2;
  aspect-ratio: 4/3;
}

.img-placeholder {
  width: 100%;
  height: 100%;
  background: var(--echo-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--echo-text-hint);
}

/* 互动栏 */
.post-card-footer {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-top: 8px;
  border-top: 1px solid var(--echo-border);
}

.post-card-action {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--echo-text-hint);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.post-card-action:active {
  transform: scale(1.1);
}

.post-card-share {
  margin-left: auto;
}

/* ===== 标签管理面板 ===== */
.tag-panel-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 500;
  display: flex;
  align-items: flex-end;
  max-width: 375px;
  box-sizing: border-box;
}

.tag-panel-sheet {
  width: 100%;
  max-width: 375px;
  background: var(--echo-white);
  border-radius: 16px 16px 0 0;
  padding: 20px 16px 36px;
  box-sizing: border-box;
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.tag-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.tag-panel-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--echo-text);
}

.tag-panel-close {
  font-size: 15px;
  color: var(--echo-primary);
  cursor: pointer;
  font-weight: 500;
}

.tag-panel-hint {
  font-size: 12px;
  color: var(--echo-text-hint);
  margin-bottom: 16px;
}

.tag-panel-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-panel-item {
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 14px;
  background: var(--echo-bg);
  color: var(--echo-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag-panel-item--hidden {
  opacity: 0.35;
  background: var(--echo-border);
}

.tag-panel-item:active {
  transform: scale(0.95);
}

.tag-panel-empty {
  text-align: center;
  padding: 32px 0;
  color: var(--echo-text-hint);
  font-size: 14px;
}

/* ===== 分享面板 ===== */
.share-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
}

.share-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  width: 68px;
}

.share-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--echo-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.share-label {
  font-size: 12px;
  color: var(--echo-text-secondary);
}

/* ===== 面板动画 ===== */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.3s ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
}

.panel-slide-enter-from .tag-panel-sheet,
.panel-slide-leave-to .tag-panel-sheet {
  transform: translateY(100%);
}
</style>
