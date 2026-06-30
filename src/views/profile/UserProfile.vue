<template>
  <div class="user-profile-page">

    <!-- ===== 三点「更多」弹出菜单（Teleport 到 phone-screen） ===== -->
    <Teleport to="#phone-screen">
      <transition name="more-fade">
        <div v-if="showMoreMenu" class="more-menu-overlay" @click.self="closeMoreMenu">
          <div class="more-bubble">
            <div class="more-bubble-arrow"></div>
            <!-- 1. 转发 -->
            <div class="more-bubble-item" @click="onForwardFromProfile">
              <div class="more-bubble-icon" style="background:#e3f2fd;">
                <van-icon name="share-o" size="14" color="#1976d2" />
              </div>
              <span>转发</span>
            </div>
            <!-- 2. 拉黑 -->
            <div class="more-bubble-item" @click="onBlock">
              <div class="more-bubble-icon" style="background:#fdecea;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="4" x2="20" y2="20"/><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <span>拉黑</span>
            </div>
            <!-- 3. 举报 -->
            <div class="more-bubble-item" @click="onReportFromProfile">
              <div class="more-bubble-icon" style="background:#fff3e0;">
                <van-icon name="warning-o" size="14" color="#e65100" />
              </div>
              <span>举报</span>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- 转发面板（仅联系人 / 圈子） -->
    <van-action-sheet
      v-model:show="showForwardSheet"
      title="转发"
      :actions="forwardActions"
      teleport="body"
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
          :class="{ 
            active: activeTab === tab.key,
            locked: !tab.visible
          }"
          @click="handleTabClick(tab)"
        >
          <span>{{ tab.label }}</span>
          <span v-if="tab.visible" class="tab-count">{{ tab.count }}</span>
        </div>
      </div>
      <div class="tab-search" @click="$router.push(`/profile-search?from=user&uid=${uid}`)">
        <van-icon name="search" size="17" color="#999" />
      </div>
    </div>

    <!-- 锁定的内容占位区域 -->
    <div class="locked-content-area" v-if="isTabLocked(activeTab)">
      <div class="lock-circle">
        <van-icon name="lock" size="24" color="#999" />
      </div>
      <div class="lock-title">{{ getLockTitle(activeTab) }}</div>
      <div class="lock-desc">{{ getLockDesc(activeTab) }}</div>
      
      <!-- 去关注动作 -->
      <button 
        v-if="showLockActionButton(activeTab)" 
        class="lock-action-btn"
        :class="{ followed: isFollowed, loading: followLoading }"
        @click="handleLockAction"
        :disabled="followLoading"
      >
        <span class="btn-spinner" v-if="followLoading"></span>
        <span v-else-if="isFollowed">
          <van-icon name="success" size="14" style="margin-right: 4px;" />
          已关注
        </span>
        <span v-else>
          <van-icon name="add-o" size="14" style="margin-right: 4px;" />
          去关注
        </span>
      </button>
    </div>

    <!-- 帖子 -->
    <div class="profile-posts" v-if="activeTab === 'posts' && !isTabLocked('posts')">
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
        <p>暂无对你可见的帖子</p>
      </div>
    </div>

    <!-- 评论过的 -->
    <div class="profile-posts" v-if="activeTab === 'comments' && !isTabLocked('comments')">
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
        <p>该用户暂无公开评论</p>
      </div>
    </div>

    <!-- 收藏的 -->
    <div class="profile-posts" v-if="activeTab === 'collects' && !isTabLocked('collects')">
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
        <p>该用户暂无公开收藏</p>
      </div>
    </div>

    <!-- 圈子 -->
    <div class="profile-posts" v-if="activeTab === 'circles' && !isTabLocked('circles')">
      <div v-if="joinedCircles.length" class="circle-list-view">
        <div
          v-for="circle in joinedCircles"
          :key="circle.id"
          class="circle-list-item"
          @click="$router.push(`/circle/${circle.id}`)"
        >
          <div class="circle-avatar-wrap" :style="{ background: circle.color }">
            <span class="circle-avatar-icon">{{ circle.icon }}</span>
          </div>
          <div class="circle-info-wrap">
            <div class="circle-name-row">
              <span class="circle-name">{{ circle.name }}</span>
              <span v-if="circle.official" class="official-tag">官方</span>
            </div>
            <div class="circle-member-count">{{ circle.memberCount }} 成员</div>
          </div>
          <div class="circle-arrow">
            <van-icon name="arrow" size="14" color="#ccc" />
          </div>
        </div>
      </div>
      <div v-else class="empty-content">
        <p>暂无对你可见的圈子</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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

// 转发
const showForwardSheet = ref(false)
const forwardActions = [
  { name: '联系人', value: 'friend', className: 'action-forward-friend' },
  { name: '圈子', value: 'circle', className: 'action-forward-circle' }
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

// 判断当前访客是否为页面主人（自己访问自己的主页）
const isSelf = computed(() => {
  if (!profileUser.value || !store.currentUser) return false
  return profileUser.value.id === store.currentUser.id
})

// 判断某个栏目是否对当前访客可见
// 判断某个栏目是否对当前访客可见
function isTabVisibleToVisitor(tabType) {
  if (!profileUser.value) return false
  return store.isTabVisibleToVisitor(profileUser.value.id, tabType)
}

// 可见帖子（过滤私密和匿名 + 根据帖子权限过滤）
const visiblePosts = computed(() => {
  if (!profileUser.value) return []

  return store.posts.filter(p => {
    // 1. 必须是该用户的帖子
    if (p.authorId !== profileUser.value.id) return false

    // 2. 过滤私密帖子
    if (p.visibility === 'private') return false

    // 3. 过滤匿名帖子（他人主页不显示匿名内容）
    if (p.isAnon) return false

    // 4. 根据帖子权限设置，判断当前访客是否可见
    const postVisibility = p.visibility || 'public'
    if (postVisibility === 'public') return true
    if (postVisibility === 'school') {
      // 仅同校可见
      return store.currentUser?.school === profileUser.value.school
    }
    if (postVisibility === 'followers') {
      // 仅关注者可见
      return isSelf.value || store.isFollowing(profileUser.value.id)
    }
    if (postVisibility === 'mutual') {
      // 仅互关可见
      return isSelf.value ||
             (store.isFollowing(profileUser.value.id) &&
              store.followedUserIds.includes(profileUser.value.id))
    }

    return false
  })
})

// 评论过的帖子（根据评论权限过滤）
const commentedPosts = computed(() => {
  if (!profileUser.value) return []

  const userCommentedPostIds = [...new Set(
    store.allComments.filter(c => c.authorId === profileUser.value.id && !c.isAnon).map(c => c.postId)
  )]
  return store.posts.filter(p => userCommentedPostIds.includes(p.id))
})

// 收藏的帖子（根据收藏权限过滤）
const collectedPosts = computed(() => {
  if (!profileUser.value) return []

  // 仅在自己主页返回实际收藏，他人主页返回空数组配合锁定页逻辑
  if (!isSelf.value) return []
  return store.getUserCollectedPosts()
})

const joinedCircles = computed(() => {
  if (!profileUser.value) return []
  return store.getUserJoinedCircles(profileUser.value.id)
})

const contentTabs = computed(() => {
  if (!profileUser.value) return []

  return [
    { key: 'posts', label: '帖子', count: visiblePosts.value.length, visible: isTabVisibleToVisitor('post') },
    { key: 'comments', label: '评论', count: commentedPosts.value.length, visible: isTabVisibleToVisitor('comment') },
    { key: 'collects', label: '收藏', count: collectedPosts.value.length, visible: isTabVisibleToVisitor('collect') },
    { key: 'circles', label: '圈子', count: joinedCircles.value.length, visible: isTabVisibleToVisitor('circle') }
  ]
})

function isTabLocked(tabKey) {
  const tab = contentTabs.value.find(t => t.key === tabKey)
  return tab ? !tab.visible : false
}

function getTabVisibility(tabKey) {
  if (!profileUser.value) return 'everyone'
  const visibilityMap = {
    posts: profileUser.value.postVisibility,
    comments: profileUser.value.commentVisibility,
    collects: profileUser.value.collectionVisibility,
    circles: profileUser.value.circleVisibility
  }
  return visibilityMap[tabKey] || 'everyone'
}

const followLoading = ref(false)

function getLockTitle(tabKey) {
  const vis = getTabVisibility(tabKey)
  if (vis === 'private') return '仅自己可见'
  if (vis === 'mutual') return '仅互关可见'
  if (vis === 'followers') return '仅关注者可见'
  return '内容已锁定'
}

function getLockDesc(tabKey) {
  const name = profileUser.value?.nickname || '该用户'
  const labelMap = {
    posts: '帖子',
    comments: '评论',
    collects: '收藏',
    circles: '圈子'
  }
  const typeLabel = labelMap[tabKey] || '内容'
  const vis = getTabVisibility(tabKey)
  if (vis === 'private') return '该内容仅作者本人可见'
  if (vis === 'mutual') return `该用户仅允许互相关注后查看其${typeLabel}内容`
  if (vis === 'followers') return `该用户仅允许关注者查看其${typeLabel}内容`
  return '由于隐私设置，你无权查看该内容'
}

function showLockActionButton(tabKey) {
  const vis = getTabVisibility(tabKey)
  if (vis === 'private') return false
  if (vis === 'followers') return true
  if (vis === 'mutual') return true
  return false
}

function handleLockAction() {
  if (!profileUser.value) return
  if (isFollowed.value) return
  
  followLoading.value = true
  setTimeout(() => {
    store.toggleFollow(profileUser.value.id)
    followLoading.value = false
    showToast('关注成功')
  }, 400)
}

function handleTabClick(tab) {
  activeTab.value = tab.key
}

// 监听 contentTabs 变化，确保 activeTab 始终指向合法的 tab
watch(contentTabs, (newTabs) => {
  if (!newTabs || !newTabs.length) return
  const tabKeys = newTabs.map(t => t.key)
  if (!tabKeys.includes(activeTab.value)) {
    activeTab.value = 'posts'
  }
}, { immediate: true })

function onFollow() {
  if (!profileUser.value) return
  store.toggleFollow(profileUser.value.id)
  showToast(isFollowed.value ? '已取消关注' : '已关注')
}

function onChat() {
  if (!profileUser.value) return
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

function onReportFromProfile() {
  showMoreMenu.value = false
  showToast('举报已提交，平台将在24小时内审核处理')
}

function onForwardSelect(action) {
  showForwardSheet.value = false
  if (!profileUser.value) return
  const targetMap = { friend: '联系人', circle: '圈子' }
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
  margin-top: 12px;
  padding: 0 4px;
}
.bio-text {
  font-size: 12.5px;
  color: var(--echo-text-secondary);
  line-height: 1.5;
}

/* ===== 统一标签区 ===== */
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
  top: 46px;
  right: 8px;
  min-width: 120px;
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
  gap: 8px;
  padding: 8px 14px;
  cursor: pointer;
  transition: background 0.12s;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.more-bubble-item:first-child { border-radius: 12px 12px 0 0; }
.more-bubble-item:last-child  { border-radius: 0 0 12px 12px; }
.more-bubble-item:active { background: var(--echo-bg); }
.more-bubble-item span {
  font-size: 13px;
  font-weight: 500;
  color: var(--echo-text);
  white-space: nowrap;
}

/* 菜单项左侧圆形图标 */
.more-bubble-icon {
  width: 26px;
  height: 26px;
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
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes morePopOut {
  to    { opacity: 0; transform: scale(0.85); }
  from  { opacity: 1; transform: scale(1); }
}

/* ===== 锁定与圈子新增样式 ===== */
.content-tab.locked {
  opacity: 0.6;
}

.locked-content-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 24px;
  width: 100%;
}

.lock-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f5f6f8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.lock-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--echo-text);
  margin-bottom: 6px;
}

.lock-desc {
  font-size: 12px;
  color: var(--echo-text-hint);
  line-height: 1.5;
  margin-bottom: 16px;
}

.lock-action-btn {
  height: 32px;
  padding: 0 20px;
  border-radius: 16px;
  border: none;
  background: var(--echo-primary);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(76, 175, 125, 0.15);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all var(--echo-transition-fast);
}

.lock-action-btn:active {
  transform: scale(0.97);
}

.lock-action-btn.followed {
  background: #e2f2ea;
  color: var(--echo-primary);
  box-shadow: none;
  cursor: default;
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 圈子列表样式 */
.circle-list-view {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.circle-list-item {
  background: var(--echo-white);
  border-radius: 0;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--echo-border);
  transition: background var(--echo-transition-fast);
}

.circle-list-item:active {
  background: #f8f9fa;
}

.circle-avatar-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.circle-avatar-icon {
  user-select: none;
}

.circle-info-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.circle-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.circle-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--echo-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.circle-member-count {
  font-size: 12px;
  color: var(--echo-text-hint);
}

.official-tag {
  font-size: 9px;
  color: var(--echo-primary);
  background: var(--echo-primary-light);
  padding: 1px 4px;
  border-radius: 4px;
  font-weight: 600;
  flex-shrink: 0;
}

.circle-arrow {
  display: flex;
  align-items: center;
  color: var(--echo-text-hint);
}
</style>
