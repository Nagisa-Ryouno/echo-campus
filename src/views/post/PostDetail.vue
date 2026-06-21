<template>
  <div class="post-detail-page">
    <!-- 顶部 -->
    <div class="detail-header">
      <span class="detail-back" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </span>
      <div style="display:flex;align-items:center;gap:16px">
        <span class="detail-action-btn" @click="onShare">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </span>
        <span class="post-more-btn" @click="onMoreClick($event)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
            <circle cx="12" cy="12" r="1.5"></circle>
            <circle cx="19" cy="12" r="1.5"></circle>
            <circle cx="5" cy="12" r="1.5"></circle>
          </svg>
        </span>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="!post" class="detail-loading">
      <van-loading size="24" color="var(--echo-primary)" />
      <span>加载中...</span>
    </div>

    <!-- 帖子内容 -->
    <div v-else class="detail-body">
      <!-- 作者信息 -->
      <div class="detail-author" @click="goUserProfile(post.authorId)">
        <div class="detail-avatar" :style="{ background: post.author?.avatarColor || '#ccc' }">
          <template v-if="post.isAnon">匿</template>
          <template v-else>{{ post.author?.nickname?.slice(0, 1) || '?' }}</template>
        </div>
        <div class="detail-author-info">
          <div class="detail-author-name">
            <template v-if="post.isAnon">匿名用户</template>
            <template v-else>{{ post.author?.nickname || '未知' }}</template>
          </div>
          <div class="detail-author-meta">
            <template v-if="post.isAnon">
              <span>匿名发布</span>
              <span class="meta-divider">·</span>
              <span>{{ post.createdAt }}</span>
            </template>
            <template v-else>
              <span>{{ post.createdAt }}</span>
            </template>
          </div>
        </div>
        <span v-if="!post.isAnon" class="detail-follow-btn" @click.stop="onFollow">+ 关注</span>
      </div>

      <!-- 帖子内容 -->
      <div class="detail-content">
        <p class="detail-text">{{ post.content }}</p>
      </div>

      <!-- 标签 -->
      <div class="detail-tags">
        <span class="detail-tag detail-tag--category">{{ post.categoryTag }}</span>
        <span v-for="t in post.topicTags" :key="t" class="detail-tag">#{{ t }}</span>
      </div>

      <!-- 权限标识 -->
      <div class="detail-meta-info">
        <span v-if="post.isAnon" class="meta-badge meta-badge--anon">匿名发布</span>
        <span v-if="post.schoolOnly" class="meta-badge meta-badge--school">仅本校可见</span>
        <span v-if="post.visibility === 'private'" class="meta-badge meta-badge--private">私密</span>
      </div>

      <!-- 评论卡片头部 -->
      <div class="comment-divider">
        <span class="comment-title">评论 {{ post.commentCount }}</span>
        <div class="comment-filters">
          <span
            class="filter-btn"
            :class="{ 'filter-btn--active': commentSortType === 'default' }"
            @click="commentSortType = 'default'"
          >默认</span>
          <span
            class="filter-btn"
            :class="{ 'filter-btn--active': commentSortType === 'latest' }"
            @click="commentSortType = 'latest'"
          >最新</span>
          <span
            class="filter-btn"
            :class="{ 'filter-btn--active': commentSortType === 'most_likes' }"
            @click="commentSortType = 'most_likes'"
          >最多点赞</span>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="comment-section">
        <div v-if="topLevelComments.length === 0" class="comment-empty">
          <p>暂无评论，来说点什么吧</p>
        </div>

        <div
          v-for="comment in topLevelComments"
          :key="comment.id"
          class="comment-item"
        >
          <!-- 主评论 -->
          <div class="comment-main">
            <div
              class="comment-avatar"
              :style="{ background: getCommentAuthor(comment)?.avatarColor || '#ccc' }"
              @click="goUserProfile(comment.authorId)"
            >
              <template v-if="comment.isAnon">匿</template>
              <template v-else>{{ getCommentAuthor(comment)?.nickname?.slice(0, 1) || '?' }}</template>
            </div>
            <div class="comment-body">
              <div class="comment-header">
                <span class="comment-name" @click="goUserProfile(comment.authorId)">
                  <template v-if="comment.isAnon">匿名用户</template>
                  <template v-else>{{ getCommentAuthor(comment)?.nickname || '未知' }}</template>
                </span>
                
                <!-- 评论更多按钮 (三点) -->
                <span class="comment-more-btn" @click.stop="onCommentMoreClick(comment, $event)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="1.5"></circle>
                    <circle cx="19" cy="12" r="1.5"></circle>
                    <circle cx="5" cy="12" r="1.5"></circle>
                  </svg>
                </span>
              </div>
              
              <div class="comment-text">{{ comment.content }}</div>
              
              <div class="comment-actions">
                <span class="comment-time">{{ formatCommentDate(comment.createdAt) }}</span>
                <div class="comment-right-actions">
                  <!-- 回复按钮：纯气泡图标 -->
                  <span class="comment-action" @click="onReply(comment.id, null)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </span>
                  <!-- 点赞按钮：在回复右侧 -->
                  <span
                    class="comment-action"
                    :class="{ 'comment-action--liked': store.isCommentLiked(comment.id) }"
                    @click="store.toggleCommentLike(comment.id)"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" :fill="store.isCommentLiked(comment.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    <span class="comment-like-count">{{ comment.likeCount || 0 }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 楼中楼回复 -->
          <div v-if="getReplies(comment.id).length > 0" class="reply-list">
            <div
              v-for="reply in getReplies(comment.id)"
              :key="reply.id"
              class="reply-item"
            >
              <span class="reply-name" @click="goUserProfile(reply.authorId)">
                <template v-if="reply.isAnon">匿名用户</template>
                <template v-else>{{ getCommentAuthor(reply)?.nickname || '未知' }}</template>
              </span>
              <span class="reply-text">{{ reply.content }}</span>
            </div>
          </div>

          <!-- 展开更多回复 -->
          <div
            v-if="getReplies(comment.id).length > 0"
            class="reply-more"
            @click="onReply(comment.id, null)"
          >
            共 {{ getReplies(comment.id).length }} 条回复 >
          </div>
        </div>
      </div>
    </div>

    <!-- 底部常驻互动栏：小红书风格左右分栏 -->
    <div v-if="post" class="detail-bottom-bar">
      <!-- 左侧：评论输入框 -->
      <div class="bottom-input-wrap">
        <input
          v-model="commentText"
          class="comment-input"
          :placeholder="replyTarget ? `回复 ${replyTargetName}...` : '说点什么...'"
          @keyup.enter="onSendComment"
        />
      </div>
      <!-- 右侧：两个互动按钮 -->
      <div class="bottom-actions">
        <!-- 点赞 -->
        <div
          class="bottom-action"
          :class="{ 'bottom-action--active': store.isPostLiked(post.id) }"
          @click="store.toggleLike(post.id)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" :fill="store.isPostLiked(post.id) ? 'var(--echo-danger)' : 'none'" :stroke="store.isPostLiked(post.id) ? 'var(--echo-danger)' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span class="action-count" :class="{ 'text-danger': store.isPostLiked(post.id) }">{{ post.likeCount || 0 }}</span>
        </div>
        <!-- 收藏 -->
        <div
          class="bottom-action"
          :class="{ 'bottom-action--active': store.isPostCollected(post.id) }"
          @click="store.toggleCollect(post.id)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" :fill="store.isPostCollected(post.id) ? 'var(--echo-warning)' : 'none'" :stroke="store.isPostCollected(post.id) ? 'var(--echo-warning)' : 'currentColor'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span class="action-count" :class="{ 'text-warning': store.isPostCollected(post.id) }">{{ post.collectCount || 0 }}</span>
        </div>
      </div>
    </div>

    <!-- 举报面板（绑定到手机壳内）-->
    <van-action-sheet
      v-model:show="showReport"
      title="举报"
      :actions="reportActions"
      teleport="#phone-screen"
      @select="onReportSelect"
      cancel-text="取消"
    />

    <!-- 分享面板（外链分享，绑定到手机壳内）-->
    <van-share-sheet
      v-model:show="showShareSheet"
      title="分享"
      :options="shareOptions"
      teleport="#phone-screen"
    />

    <!-- 转发面板（绑定到手机壳内）-->
    <van-action-sheet
      v-model:show="showForwardSheet"
      title="转发"
      :actions="forwardActions"
      teleport="#phone-screen"
      @select="onForwardSelect"
      cancel-text="取消"
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { showToast } from 'vant'
import ContextMenu from '@/components/common/ContextMenu.vue'

const route = useRoute()
const router = useRouter()
const store = useAppStore()

// 帖子数据
const post = ref(null)

onMounted(() => {
  const postId = route.params.id
  const result = store.getPostWithAuthor(postId)
  if (result) {
    post.value = result
  }
})

// 评论区
const commentText = ref('')
const replyTarget = ref(null) // { commentId, replyToId }
const replyTargetName = computed(() => {
  if (!replyTarget.value) return ''
  const c = store.allComments.find(c => c.id === replyTarget.value.commentId)
  if (!c) return ''
  if (c.isAnon) return '匿名用户'
  return store.getUserById(c.authorId)?.nickname || '未知'
})

// 评论排序 & 隐藏
const commentSortType = ref('default') // 'default' | 'latest' | 'most_likes'
const hiddenCommentIds = ref(new Set())
const menuType = ref('post') // 'post' | 'comment'
const selectedComment = ref(null)

function formatCommentDate(dateStr) {
  if (!dateStr) return ''
  try {
    let cleanStr = dateStr.replace(/-/g, '/')
    const datePart = cleanStr.split(' ')[0]
    const parts = datePart.split('/')
    if (parts.length >= 3) {
      const month = parts[1].padStart(2, '0')
      const day = parts[2].padStart(2, '0')
      return `${month}-${day}`
    }
    const d = new Date(cleanStr)
    if (!isNaN(d.getTime())) {
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${month}-${day}`
    }
  } catch (e) {
    console.error(e)
  }
  return dateStr
}

const topLevelComments = computed(() => {
  if (!post.value) return []
  let comments = store.getPostComments(post.value.id)
  
  // 过滤隐藏评论
  comments = comments.filter(c => !hiddenCommentIds.value.has(c.id))
  // 过滤拉黑用户的评论
  comments = comments.filter(c => !store.isUserBlocked(c.authorId))
  
  // 排序
  if (commentSortType.value === 'latest') {
    comments = [...comments].sort((a, b) => new Date(b.createdAt.replace(/-/g, '/')) - new Date(a.createdAt.replace(/-/g, '/')))
  } else if (commentSortType.value === 'most_likes') {
    comments = [...comments].sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
  }
  
  return comments
})

function getReplies(commentId) {
  if (!post.value) return []
  return store.getCommentReplies(post.value.id, commentId)
}

function getCommentAuthor(comment) {
  if (comment.isAnon) return { nickname: '匿名用户', avatarColor: '#999' }
  return store.getUserById(comment.authorId)
}

// 发送评论
function onSendComment() {
  if (!commentText.value.trim()) return

  const parentId = replyTarget.value?.commentId || null
  store.addComment(post.value.id, commentText.value.trim(), parentId, false)
  commentText.value = ''
  replyTarget.value = null
  showToast('评论成功')
}

// 回复某条评论
function onReply(commentId, replyToId) {
  replyTarget.value = { commentId, replyToId }
  nextTick(() => {
    const input = document.querySelector('.comment-input')
    if (input) input.focus()
  })
}

function focusComment() {
  replyTarget.value = null
  nextTick(() => {
    const input = document.querySelector('.comment-input')
    if (input) input.focus()
  })
}

// 关注
function onFollow() {
  showToast('关注成功')
}

// 分享
const showShareSheet = ref(false)
const shareOptions = [
  { name: '微信', icon: 'wechat' },
  { name: '朋友圈', icon: 'wechat-moments' },
  { name: 'QQ', icon: 'qq' },
  { name: '复制链接', icon: 'link' }
]

function onShare() {
  showShareSheet.value = true
}

// 转发
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
  if (!post.value) return
  store.toggleForward(post.value.id)
  const targetMap = { friend: '联系人', circle: '圈子' }
  showToast(`已转发至${targetMap[action.value] || action.name}`)
}

// 举报
const showReport = ref(false)
const reportActions = [
  { name: '垃圾广告', value: 'spam' },
  { name: '色情低俗', value: 'porn' },
  { name: '政治敏感', value: 'political' },
  { name: '人身攻击', value: 'attack' },
  { name: '虚假信息', value: 'fake' },
  { name: '其他违规', value: 'other' }
]

function onReportSelect(action) {
  showReport.value = false
  showToast('举报已提交，感谢你的反馈')
}

// 跳转用户主页
function goUserProfile(uid) {
  if (!uid) return
  router.push(`/profile/${uid}`)
}

// ===== 长按与 More 悬浮菜单 =====
const contextMenuVisible = ref(false)
const menuX = ref(0)
const menuY = ref(0)

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
const shareIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>`

const activeContextMenuOptions = computed(() => {
  if (menuType.value === 'comment') {
    return [
      { label: '不看此评论', value: 'hide_comment', icon: dislikeIcon },
      { label: '拉黑此用户', value: 'block_comment', icon: blockIcon, danger: true },
      { label: '举报', value: 'report_comment', icon: reportIcon, danger: true },
      { label: '转发', value: 'forward_comment', icon: forwardIcon }
    ]
  }

  if (!post.value) return []
  const isMine = post.value.authorId === store.currentUser?.id
  
  if (isMine) {
    return [
      { label: '编辑帖子', value: 'edit', icon: editIcon },
      { label: '删除帖子', value: 'delete', icon: deleteIcon, danger: true },
      { label: '修改权限', value: 'permission', icon: permissionIcon },
      { label: '置顶主页', value: 'pin', icon: pinIcon },
      { label: '转发', value: 'forward', icon: forwardIcon }
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

function onMoreClick(event) {
  menuType.value = 'post'
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

function onCommentMoreClick(comment, event) {
  menuType.value = 'comment'
  selectedComment.value = comment
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
  store.unlockPhoneScroll()
}

function handleMenuSelect(value) {
  if (menuType.value === 'comment') {
    const comment = selectedComment.value
    if (!comment) return
    
    if (value === 'hide_comment') {
      hiddenCommentIds.value.add(comment.id)
      showToast('已隐藏此评论')
    } else if (value === 'block_comment') {
      store.blockUser(comment.authorId)
      showToast('已拉黑此用户')
    } else if (value === 'report_comment') {
      showReport.value = true
    } else if (value === 'forward_comment') {
      showToast('已复制评论并转发')
    }
    closeContextMenu()
    return
  }

  if (!post.value) return
  
  if (value === 'edit') {
    showToast('编辑帖子（原型模拟）')
  } else if (value === 'delete') {
    store.deletePost(post.value.id)
    showToast('帖子已删除')
    router.back()
  } else if (value === 'permission') {
    showToast('修改权限成功（已设为仅自己可见）')
  } else if (value === 'pin') {
    showToast('已置顶该帖子至个人主页')
  } else if (value === 'dislike') {
    store.hidePost(post.value.id)
    showToast('将减少此类内容的推荐')
    router.back()
  } else if (value === 'reduce') {
    console.log(`降低标签权重: ${post.value.categoryTag}`)
    console.log(`降低作者权重: ${post.value.authorId}`)
    store.hidePost(post.value.id)
    showToast('将减少类似推荐')
    router.back()
  } else if (value === 'block') {
    store.blockUser(post.value.authorId)
    store.hidePost(post.value.id)
    showToast('已拉黑此用户，将不再展示其内容')
    router.back()
  } else if (value === 'report') {
    showReport.value = true
  } else if (value === 'forward') {
    onForward()
  } else if (value === 'share') {
    onShare()
  }
}
</script>

<style scoped>
.post-detail-page {
  min-height: 100%;
  background: var(--echo-bg);
  padding-top: 48px;
  /* 32px(bottom偏移) + 10px(padding-top) + 48px(按钮组高度) + 10px(padding-bottom) + 12px(安全余量) = 112px */
  padding-bottom: 112px;
}

/* 顶部导航栏：固定常驻，层级最高 */
.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--echo-white);
  position: fixed;
  top: 48px;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 375px;
  z-index: 200;
  box-shadow: 0 1px 0 var(--echo-border);
  box-sizing: border-box;
}

.detail-back {
  color: var(--echo-text);
  cursor: pointer;
  display: flex;
  align-items: center;
}

.detail-action-btn {
  color: var(--echo-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
}

.post-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: var(--echo-text-secondary);
  opacity: 1;
  transition: all 0.15s;
  cursor: pointer;
}

.post-more-btn:active {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--echo-text);
}

/* 加载 */
.detail-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 20px;
  color: var(--echo-text-hint);
  font-size: 14px;
}

/* 正文容器（不创建独立滚动上下文，跟随 phone-screen 滚动） */
.detail-body {
  padding-bottom: 8px;
}

/* 作者信息 */
.detail-author {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--echo-white);
  cursor: pointer;
}

.detail-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.detail-author-info {
  flex: 1;
  min-width: 0;
}

.detail-author-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--echo-text);
  margin-bottom: 2px;
}

.detail-author-meta {
  font-size: 12px;
  color: var(--echo-text-hint);
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-divider {
  opacity: 0.4;
}

.detail-follow-btn {
  flex-shrink: 0;
  padding: 6px 16px;
  border-radius: 16px;
  background: var(--echo-primary);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.detail-follow-btn:active {
  opacity: 0.8;
  transform: scale(0.96);
}

/* 帖子内容 */
.detail-content {
  padding: 0 16px 16px;
  background: var(--echo-white);
}

.detail-text {
  font-size: 15px;
  color: var(--echo-text);
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 标签 */
.detail-tags {
  padding: 0 16px 12px;
  background: var(--echo-white);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-tag {
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 12px;
  background: var(--echo-bg);
  color: var(--echo-text-secondary);
}

.detail-tag--category {
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  font-weight: 500;
}

/* 权限标识 */
.detail-meta-info {
  padding: 0 16px 12px;
  background: var(--echo-white);
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  border-bottom: 1px solid var(--echo-border);
}

.meta-badge {
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.meta-badge--anon {
  background: #fff3e0;
  color: #e65100;
}

.meta-badge--school {
  background: #e8f5e9;
  color: #2e7d32;
}

.meta-badge--private {
  background: #fce4ec;
  color: #c62828;
}

/* 评论分割线 */
.comment-divider {
  padding: 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--echo-text);
  background: var(--echo-white);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-filters {
  display: flex;
  gap: 8px;
}

.filter-btn {
  font-size: 11px;
  color: var(--echo-text-secondary);
  background: var(--echo-bg);
  padding: 3px 8px;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  transition: all 0.15s;
}

.filter-btn--active {
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  font-weight: 600;
}

/* 评论空状态 */
.comment-empty {
  padding: 40px 16px;
  text-align: center;
  color: var(--echo-text-hint);
  font-size: 14px;
  background: var(--echo-white);
}

/* 主评论 */
.comment-item {
  background: var(--echo-white);
  padding: 0 16px;
  border-bottom: 1px solid var(--echo-border);
}

.comment-main {
  display: flex;
  gap: 10px;
  padding: 12px 0;
}

.comment-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
  cursor: pointer;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.comment-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--echo-text);
  cursor: pointer;
}

.comment-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: var(--echo-text-hint);
  opacity: 0.6;
  cursor: pointer;
  transition: all 0.15s;
}

.comment-more-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.05);
}

.comment-text {
  font-size: 14px;
  color: var(--echo-text);
  line-height: 1.6;
  margin-bottom: 6px;
  word-break: break-all;
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
}

.comment-time {
  font-size: 11px;
  color: var(--echo-text-hint);
}

.comment-right-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.comment-action {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: var(--echo-text-hint);
  cursor: pointer;
}

.comment-action--liked {
  color: var(--echo-danger);
}

.comment-like-count {
  font-size: 11px;
  font-weight: 500;
  color: var(--echo-text-secondary);
}

.comment-action--liked .comment-like-count {
  color: var(--echo-danger);
}

/* 楼中楼 */
.reply-list {
  margin-left: 44px;
  padding: 4px 0 8px 12px;
  border-left: 1.5px solid var(--echo-border);
  background: transparent;
  border-radius: 0;
}

.reply-item {
  padding: 6px 0;
  font-size: 13px;
  line-height: 1.6;
  border-bottom: 1px solid var(--echo-border);
}

.reply-item:last-child {
  border-bottom: none;
}

.reply-name {
  color: var(--echo-primary);
  font-weight: 500;
  cursor: pointer;
  margin-right: 4px;
}

.reply-text {
  color: var(--echo-text);
}

.reply-more {
  margin-left: 44px;
  padding: 4px 10px 10px;
  font-size: 12px;
  color: var(--echo-primary);
  cursor: pointer;
  font-weight: 500;
}

/* ===== 底部常驻互动栏：fixed 定位 + 最高层级 ===== */
.detail-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 375px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  padding-bottom: max(10px, env(safe-area-inset-bottom));
  background: var(--echo-white);
  border-top: 1px solid var(--echo-border);
  z-index: 500;
  box-sizing: border-box;
  pointer-events: auto;
}

/* 左侧输入框 */
.bottom-input-wrap {
  flex: 1;
  min-width: 0;
}

.comment-input {
  width: 100%;
  height: 36px;
  border-radius: 18px;
  border: 1px solid var(--echo-border);
  padding: 0 14px;
  font-size: 14px;
  color: var(--echo-text);
  outline: none;
  background: var(--echo-bg);
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.comment-input:focus {
  border-color: var(--echo-primary);
}

/* 右侧互动按钮组 */
.bottom-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.bottom-action {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--echo-text-secondary);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.15s;
}

.bottom-action:active {
  transform: scale(0.95);
  opacity: 0.8;
}

.bottom-action svg {
  width: 18px;
  height: 18px;
  display: block;
}

.bottom-action .action-count {
  font-size: 12px;
  font-weight: 550;
  color: var(--echo-text-secondary);
}

.action-count.text-danger {
  color: var(--echo-danger);
}
.action-count.text-warning {
  color: var(--echo-warning);
}

</style>
