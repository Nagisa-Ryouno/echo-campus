<template>
  <div class="page-root">
    <!-- 顶部固定导航栏 -->
    <div class="detail-header">
      <span class="detail-back" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
      </span>
      <span class="detail-title">热点话题</span>
      <span class="detail-forward" @click="showForwardSheet = true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <polyline points="16 6 12 2 8 6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
      </span>
    </div>

    <!-- 滚动区域 -->
    <div class="scroll-content">
      <div class="trend-detail-container" v-if="trend">
        
        <!-- 头部热点专题卡片 -->
        <div class="trend-hero-card">
          <div class="hero-tag-row">
            <span class="hero-fire">🔥</span>
            <span class="hero-tag-label">校园热议趋势</span>
          </div>
          <h1 class="hero-title">{{ trend.title }}</h1>
          <p class="hero-desc">{{ trend.desc || '大家正在积极讨论该话题，快来分享你的看法吧！' }}</p>
          <div class="hero-stats">
            <span class="stats-item"><strong>{{ trend.heat }}</strong> 讨论</span>
            <span class="divider">·</span>
            <span class="stats-item"><strong>{{ relatedPosts.length }}</strong> 关联发帖</span>
          </div>
          <!-- 话题标签推荐 -->
          <div class="hero-tags-box" v-if="trend.relatedTags?.length">
            <span v-for="tag in trend.relatedTags" :key="tag" class="hero-tag-pill">
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- 分类切换 Tabs -->
        <div class="detail-tabs">
          <div
            class="detail-tab"
            :class="{ 'detail-tab--active': activeTab === 'posts' }"
            @click="activeTab = 'posts'"
          >
            <span>全部帖子</span>
            <span class="tab-count">({{ relatedPosts.length }})</span>
            <span v-if="activeTab === 'posts'" class="tab-active-bar"></span>
          </div>
          <div
            class="detail-tab"
            :class="{ 'detail-tab--active': activeTab === 'circles' }"
            @click="activeTab = 'circles'"
          >
            <span>相关圈子</span>
            <span class="tab-count">({{ relatedCircles.length }})</span>
            <span v-if="activeTab === 'circles'" class="tab-active-bar"></span>
          </div>
        </div>

        <!-- 内容渲染区 -->
        <div class="tab-content-area">
          <!-- 1. 帖子流列表 -->
          <div v-if="activeTab === 'posts'">
            <div v-if="relatedPosts.length === 0" class="empty-state">
              <p class="empty-text">📚 暂无讨论帖子</p>
              <p class="empty-hint">点击下方按钮，发布第一条讨论帖吧！</p>
            </div>
            
            <div v-else class="post-list">
              <div
                v-for="post in relatedPosts"
                :key="post.id"
                class="post-card"
                :class="{
                  'post-card--active-menu': activeLongPressPostId === post.id,
                  'post-card--hiding': hidingPostIds.has(post.id)
                }"
                @click="goPostDetail(post.id)"
                @touchstart="handleTouchStart(post.id, $event)"
                @touchend="handleTouchEnd(post.id, $event)"
                @touchmove="handleTouchMove(post.id, $event)"
                @touchcancel="handleTouchCancel"
                @mousedown="handleMouseDown(post.id, $event)"
                @mouseup="handleMouseUp"
                @mousemove="handleMouseMove"
                @mouseleave="handleMouseLeave"
              >
                <!-- 顶部区域重构 -->
                <div class="post-card-header">
                  <!-- 左侧：用户头像、昵称、发布时间 -->
                  <div class="header-left" @click.stop="goUserProfile(post.authorId)">
                    <div
                      class="post-card-avatar"
                      :style="{ background: getAuthor(post.authorId)?.avatarColor || '#ccc' }"
                    >
                      <template v-if="post.isAnon">匿</template>
                      <template v-else>{{ getAuthor(post.authorId)?.nickname?.slice(0, 1) || '?' }}</template>
                    </div>
                    <div class="post-card-meta">
                      <div class="post-card-name">
                        <template v-if="post.isAnon">匿名用户</template>
                        <template v-else>{{ getAuthor(post.authorId)?.nickname || '未知' }}</template>
                      </div>
                      <div class="post-card-time">{{ post.createdAt }}</div>
                    </div>
                  </div>

                  <!-- 右侧：三个点 More 按钮 -->
                  <div class="header-right">
                    <div class="post-more-btn" @click.stop="onMoreClick(post.id, $event)">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                        <circle cx="12" cy="12" r="1.5"></circle>
                        <circle cx="19" cy="12" r="1.5"></circle>
                        <circle cx="5" cy="12" r="1.5"></circle>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- 正文 -->
                <div class="post-card-body">
                  <p class="post-card-content">{{ post.content }}</p>
                </div>

                <!-- 图片区 -->
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

                <!-- 底部交互区重构：左侧放分类标签，点赞、评论、收藏靠右排布 -->
                <div class="post-card-footer">
                  <!-- 左侧标签 -->
                  <span class="tag-badge" v-if="post.categoryTag">{{ post.categoryTag }}</span>

                  <div class="footer-actions-right">
                    <!-- 点赞 -->
                    <div class="post-card-action" @click.stop="store.toggleLike(post.id)">
                      <svg width="16" height="16" viewBox="0 0 24 24" :fill="store.isPostLiked(post.id) ? 'var(--echo-danger)' : 'none'" :stroke="store.isPostLiked(post.id) ? 'var(--echo-danger)' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      <span>{{ post.likeCount }}</span>
                    </div>
                    <!-- 评论 -->
                    <div class="post-card-action" @click.stop="goPostDetail(post.id)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <span>{{ post.commentCount }}</span>
                    </div>
                    <!-- 收藏 -->
                    <div class="post-card-action" @click.stop="store.toggleCollect(post.id)">
                      <svg width="16" height="16" viewBox="0 0 24 24" :fill="store.isPostCollected(post.id) ? 'var(--echo-warning)' : 'none'" :stroke="store.isPostCollected(post.id) ? 'var(--echo-warning)' : 'currentColor'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      <span>{{ post.collectCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 相关圈子 -->
          <div v-if="activeTab === 'circles'">
            <div v-if="relatedCircles.length === 0" class="empty-state">
              <p class="empty-text">👥 暂无相关圈子</p>
              <p class="empty-hint">本话题暂时没有关联特定圈子</p>
            </div>
            
            <div v-else class="circle-list">
              <div
                v-for="circle in relatedCircles"
                :key="circle.id"
                class="circle-card"
                @click="goCircle(circle.id)"
              >
                <div class="circle-icon" :style="{ background: circle.color }">
                  {{ circle.icon }}
                </div>
                <div class="circle-info">
                  <div class="circle-name">{{ circle.name }}</div>
                  <div class="circle-desc">{{ circle.description }}</div>
                  <div class="circle-members">{{ circle.memberCount }} 成员 · {{ circle.postCount }} 帖子</div>
                </div>
                <button class="circle-btn">进入</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 底部悬浮参与讨论按钮 -->
    <div class="publish-float-wrap" v-if="trend">
      <button class="publish-float-btn" @click="goPublish">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        参与讨论
      </button>
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

    <!-- ===== 帖子操作悬浮菜单 ===== -->
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { showToast } from 'vant'
import { mockTrends } from '@/mock/trends.js'
import ContextMenu from '@/components/common/ContextMenu.vue'

const route = useRoute()
const router = useRouter()
const store = useAppStore()

const trendId = route.params.id
const trend = computed(() => mockTrends.find(t => t.id === trendId))

// 判定话题是否存在，不存在则回退
if (!trend.value) {
  showToast('热点话题不存在')
  router.back()
}

const activeTab = ref('posts')

// 获取关联的公开帖子流
const relatedPosts = computed(() => {
  if (!trend.value) return []
  return store.posts.filter(p => 
    p.visibility === 'public' && 
    trend.value.relatedPosts.includes(p.id) &&
    !store.hiddenPostIds.has(p.id) &&
    !store.isUserBlocked(p.authorId)
  )
})

// 获取关联的圈子
const relatedCircles = computed(() => {
  if (!trend.value) return []
  return store.circles.filter(c => trend.value.relatedCircles.includes(c.id))
})

function getAuthor(uid) {
  return store.getUserById(uid)
}

function goUserProfile(uid) {
  router.push(`/user/profile/${uid}`)
}

// ===== 长按与 More 悬浮菜单 =====
const contextMenuVisible = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const selectedPostId = ref(null)
const activeLongPressPostId = ref(null)
const hidingPostIds = ref(new Set())
const wasLongPressed = ref(false)
let longPressTimer = null
let isTouchActive = false
let lastClientX = 0
let lastClientY = 0

// SVG outline Icons
const editIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`
const deleteIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`
const permissionIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
const pinIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22" /><path d="M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.78-3.5A2 2 0 0 1 15 9.26V5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4.26a2 2 0 0 1-.78 1.56l-2.78 3.5A2 2 0 0 0 5 15.24z" /></svg>`
const dislikeIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
const reduceIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>`
const blockIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>`
const reportIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>`
const forwardIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18c0-4 4-8 10-8h7" /><polyline points="15 5 20 10 15 15" /></svg>`

const activeContextMenuOptions = computed(() => {
  const postId = selectedPostId.value
  if (!postId) return []
  const post = store.posts.find(p => p.id === postId)
  if (!post) return []
  
  const isMine = post.authorId === store.currentUser?.id
  
  if (isMine) {
    return [
      { label: '编辑帖子', value: 'edit', icon: editIcon },
      { label: '删除帖子', value: 'delete', icon: deleteIcon, danger: true },
      { label: '修改权限', value: 'permission', icon: permissionIcon },
      { label: '置顶主页', value: 'pin', icon: pinIcon }
    ]
  } else {
    return [
      { label: '不感兴趣', value: 'dislike', icon: dislikeIcon },
      { label: '减少此类内容', value: 'reduce', icon: reduceIcon },
      { label: '拉黑此用户', value: 'block', icon: blockIcon, danger: true },
      { label: '举报', value: 'report', icon: reportIcon, danger: true },
      { label: '转发', value: 'forward', icon: forwardIcon }
    ]
  }
})

function handleLongPressStart(postId, event) {
  if (longPressTimer) clearTimeout(longPressTimer)
  wasLongPressed.value = false
  
  const touch = event.type.startsWith('touch') ? event.touches[0] : event
  lastClientX = touch.clientX
  lastClientY = touch.clientY
  
  longPressTimer = setTimeout(() => {
    activeLongPressPostId.value = postId
    selectedPostId.value = postId
    
    const phoneBody = document.querySelector('.phone-body')
    if (phoneBody) {
      const rect = phoneBody.getBoundingClientRect()
      menuX.value = lastClientX - rect.left
      menuY.value = lastClientY - rect.top
    } else {
      menuX.value = lastClientX
      menuY.value = lastClientY
    }
    
    contextMenuVisible.value = true
    wasLongPressed.value = true
    
    if (navigator.vibrate) {
      navigator.vibrate(15)
    }
    
    store.lockPhoneScroll()
    longPressTimer = null
  }, 400)
}

function handleLongPressEnd() {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

function handleLongPressMove() {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

function handleTouchStart(postId, event) {
  if (event.target.closest('.post-more-btn')) return
  isTouchActive = true
  handleLongPressStart(postId, event)
}

function handleTouchEnd() {
  handleLongPressEnd()
  setTimeout(() => {
    isTouchActive = false
  }, 100)
}

function handleTouchMove() {
  handleLongPressMove()
}

function handleTouchCancel() {
  handleLongPressEnd()
  setTimeout(() => {
    isTouchActive = false
  }, 100)
}

function handleMouseDown(postId, event) {
  if (isTouchActive) return
  if (event.target.closest('.post-more-btn')) return // Skip for three-dot button click
  if (event.button !== 0) return // Only trigger for left-click
  handleLongPressStart(postId, event)
}

function handleMouseUp() {
  handleLongPressEnd()
}

function handleMouseMove() {
  handleLongPressMove()
}

function handleMouseLeave() {
  handleLongPressEnd()
}

function onMoreClick(postId, event) {
  selectedPostId.value = postId
  
  const phoneBody = document.querySelector('.phone-body')
  if (phoneBody) {
    const rect = phoneBody.getBoundingClientRect()
    menuX.value = event.clientX - rect.left
    menuY.value = event.clientY - rect.top
  } else {
    menuX.value = event.clientX
    menuY.value = event.clientY
  }
  
  contextMenuVisible.value = true
  store.lockPhoneScroll()
}

function closeContextMenu() {
  contextMenuVisible.value = false
  activeLongPressPostId.value = null
  store.unlockPhoneScroll()
}

function handleMenuSelect(value) {
  const postId = selectedPostId.value
  if (!postId) return
  const post = store.posts.find(p => p.id === postId)
  if (!post) return
  
  if (value === 'edit') {
    showToast('编辑帖子（原型模拟）')
  } else if (value === 'delete') {
    hidingPostIds.value.add(postId)
    setTimeout(() => {
      store.deletePost(postId)
      hidingPostIds.value.delete(postId)
    }, 250)
    showToast('帖子已删除')
  } else if (value === 'permission') {
    showToast('修改权限成功（已设为仅自己可见）')
  } else if (value === 'pin') {
    showToast('已置顶该帖子至个人主页')
  } else if (value === 'dislike') {
    hidingPostIds.value.add(postId)
    setTimeout(() => {
      store.hidePost(postId)
      hidingPostIds.value.delete(postId)
    }, 250)
    showToast('将减少此类内容的推荐')
  } else if (value === 'reduce') {
    console.log(`降低标签权重: ${post.categoryTag}`)
    console.log(`降低作者权重: ${post.authorId}`)
    hidingPostIds.value.add(postId)
    setTimeout(() => {
      store.hidePost(postId)
      hidingPostIds.value.delete(postId)
    }, 250)
    showToast('将减少类似推荐')
  } else if (value === 'block') {
    store.blockUser(post.authorId)
    // 隐藏该作者的所有帖子
    const authorPostIds = store.posts.filter(p => p.authorId === post.authorId).map(p => p.id)
    authorPostIds.forEach(id => hidingPostIds.value.add(id))
    setTimeout(() => {
      authorPostIds.forEach(id => store.hidePost(id))
      // clear hiding state
      authorPostIds.forEach(id => hidingPostIds.value.delete(id))
    }, 250)
    showToast('已拉黑此用户，将不再展示其内容')
  } else if (value === 'report') {
    showToast('已提交举报，感谢监督')
  } else if (value === 'forward') {
    onForward(postId)
  }
}

function goPostDetail(postId) {
  if (wasLongPressed.value) {
    wasLongPressed.value = false
    return
  }
  router.push(`/post/${postId}`)
}

function goCircle(circleId) {
  router.push(`/circle/${circleId}`)
}

// 闭环发帖：携带参数自动填充输入框和话题标签
function goPublish() {
  if (!trend.value) return
  router.push({
    path: '/post/create',
    query: {
      content: `${trend.value.title} `,
      topicTags: trend.value.relatedTags ? trend.value.relatedTags.join(',') : ''
    }
  })
}

// 转发
const showForwardSheet = ref(false)
const forwardPostId = ref(null)
const forwardActions = [
  { name: '联系人', value: 'friend' },
  { name: '圈子', value: 'circle' }
]

function onForward(postId) {
  forwardPostId.value = postId
  showForwardSheet.value = true
  store.lockPhoneScroll()
}

function onForwardSelect(action) {
  showForwardSheet.value = false
  if (forwardPostId.value) {
    store.toggleForward(forwardPostId.value)
    const targetMap = { friend: '联系人', circle: '圈子' }
    showToast(`已转发至${targetMap[action.value] || action.name}`)
    forwardPostId.value = null
  } else {
    showToast(`已将热点话题转发至${action.name}`)
  }
  store.unlockPhoneScroll()
}
</script>

<style scoped>
.page-root {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #f6f7f9;
}

/* 顶部固定导航 */
.detail-header {
  position: fixed;
  top: 48px;
  left: 50%;
  transform: translateX(-50%);
  width: 375px;
  height: 48px;
  background: var(--echo-white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.detail-back,
.detail-forward {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--echo-text);
  border-radius: 50%;
}
.detail-back:active,
.detail-forward:active {
  background: #f0f2f5;
}

.detail-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--echo-text);
}

/* 滚动区域 */
.scroll-content {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  padding-top: 48px; /* 避让顶部 header */
}

.trend-detail-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 12px 100px; /* 留出底部悬浮按钮的距离 */
}

/* 头部热议卡片 */
.trend-hero-card {
  background: linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(155, 89, 182, 0.06);
  border: 1px solid rgba(155, 89, 182, 0.08);
}

.hero-tag-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: #9b59b6;
  background: rgba(255, 255, 255, 0.55);
  padding: 3px 8px;
  border-radius: 20px;
  width: fit-content;
  margin-bottom: 12px;
  line-height: 1.2;
}

.hero-title {
  font-size: 20px;
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1.3;
  margin: 0 0 6px 0;
}

.hero-desc {
  font-size: 13px;
  color: #555;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.hero-stats {
  font-size: 12px;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}
.hero-stats strong {
  color: #1a1a2e;
}

.hero-tags-box {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.hero-tag-pill {
  font-size: 11px;
  font-weight: 500;
  color: #9b59b6;
  background: #ffffff;
  padding: 4px 10px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

/* Tabs */
.detail-tabs {
  background: var(--echo-white);
  border-radius: 14px;
  height: 44px;
  display: flex;
  padding: 0 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.015);
}

.detail-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  position: relative;
  font-size: 13.5px;
  color: var(--echo-text-secondary);
  font-weight: 500;
  transition: all 0.2s;
}
.detail-tab--active {
  color: var(--echo-primary);
  font-weight: 700;
}

.tab-count {
  font-size: 11px;
  opacity: 0.8;
}

.tab-active-bar {
  position: absolute;
  bottom: 0;
  width: 28px;
  height: 3px;
  background: var(--echo-primary);
  border-radius: 2px;
}

/* 列表渲染 */
.tab-content-area {
  display: flex;
  flex-direction: column;
}

/* 帖子卡片 */
.post-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.post-card {
  background: var(--echo-white);
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.015);
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
  box-sizing: border-box;
}

.post-card--active-menu {
  transform: scale(0.985) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04) !important;
}

.post-card--hiding {
  opacity: 0 !important;
  transform: translateY(-12px) !important;
  max-height: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  overflow: hidden;
  border: none !important;
}

.post-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  min-width: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
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
  font-size: 14px;
  font-weight: 600;
}

.post-card-meta {
  flex: 1;
  min-width: 0;
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
  font-size: 11px;
  color: var(--echo-text-hint);
  line-height: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.tag-badge {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 10px;
  background: #f1f2f6;
  color: var(--echo-text-secondary);
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.post-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: var(--echo-text-hint);
  opacity: 0.45;
  transition: all 0.15s;
  cursor: pointer;
}

.post-more-btn:hover {
  opacity: 0.8;
}

.post-more-btn:active {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--echo-text);
  opacity: 1;
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
  margin: 0;
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

/* ── 互动栏 ── */
.post-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
}

.footer-actions-right {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-left: auto;
}

.post-card-action {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--echo-text-hint);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.12s;
  -webkit-tap-highlight-color: transparent;
}

.post-card-action:active {
  opacity: 0.7;
  transform: scale(0.96);
}

/* 圈子列表 */
.circle-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.circle-card {
  background: var(--echo-white);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}
.circle-card:active {
  background: #f8f9fa;
}

.circle-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.circle-info {
  flex: 1;
  min-width: 0;
}

.circle-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--echo-text);
  margin-bottom: 2px;
}

.circle-desc {
  font-size: 11px;
  color: var(--echo-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.circle-members {
  font-size: 10px;
  color: var(--echo-text-hint);
}

.circle-btn {
  font-size: 12px;
  font-weight: 600;
  color: var(--echo-primary);
  background: var(--echo-primary-light);
  border: none;
  padding: 5px 12px;
  border-radius: 12px;
  cursor: pointer;
}
.circle-btn:active {
  opacity: 0.8;
}

/* 空白状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--echo-text-hint);
}
.empty-text {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}
.empty-hint {
  font-size: 11.5px;
  opacity: 0.7;
}

/* 底部悬浮按钮 */
.publish-float-wrap {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  width: auto;
  pointer-events: none;
}

.publish-float-btn {
  pointer-events: auto;
  height: 42px;
  padding: 0 20px;
  background: var(--echo-primary);
  color: #fff;
  border: none;
  border-radius: 21px;
  font-size: 13.5px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(76, 175, 125, 0.4);
  cursor: pointer;
  transition: all 0.2s;
}
.publish-float-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(76, 175, 125, 0.3);
}
</style>
