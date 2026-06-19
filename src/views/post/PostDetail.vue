<template>
  <div class="post-detail-page">
    <!-- 顶部 -->
    <div class="detail-header">
      <span class="detail-back" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </span>
      <div style="display:flex;align-items:center;gap:16px">
        <span class="detail-action-btn" @click="onShare">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </span>
        <span class="detail-action-btn detail-action-btn--warn" @click="showReport = true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
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

      <!-- 分割线 -->
      <div class="comment-divider">
        <span>评论 {{ post.commentCount }}</span>
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
                <span class="comment-time">{{ comment.createdAt }}</span>
              </div>
              <div class="comment-text">{{ comment.content }}</div>
              <div class="comment-actions">
                <span class="comment-action" @click="onReply(comment.id, null)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  回复
                </span>
                <span
                  class="comment-action"
                  :class="{ 'comment-action--liked': store.isCommentLiked(comment.id) }"
                  @click="store.toggleCommentLike(comment.id)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" :fill="store.isCommentLiked(comment.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  {{ comment.likeCount || '' }}
                </span>
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
      <!-- 右侧：三个互动按钮 -->
      <div class="bottom-actions">
        <!-- 点赞 -->
        <div
          class="bottom-action"
          :class="{ 'bottom-action--active': store.isPostLiked(post.id) }"
          @click="store.toggleLike(post.id)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" :fill="store.isPostLiked(post.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span>{{ post.likeCount || 0 }}</span>
        </div>
        <!-- 收藏 -->
        <div
          class="bottom-action"
          :class="{ 'bottom-action--active': store.isPostCollected(post.id) }"
          @click="store.toggleCollect(post.id)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" :fill="store.isPostCollected(post.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>{{ post.collectCount || 0 }}</span>
        </div>
        <!-- 站内转发 -->
        <div
          class="bottom-action"
          :class="{ 'bottom-action--active': store.isPostForwarded(post.id) }"
          @click="onForward"
        >
          <van-icon name="share-o" size="20" />
          <span>{{ post.forwardCount || 0 }}</span>
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

    <!-- 站内转发面板（绑定到手机壳内）-->
    <van-action-sheet
      v-model:show="showForwardSheet"
      title="站内转发"
      :actions="forwardActions"
      teleport="#phone-screen"
      @select="onForwardSelect"
      cancel-text="取消"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { showToast } from 'vant'

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

const topLevelComments = computed(() => {
  if (!post.value) return []
  return store.getPostComments(post.value.id)
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

// 站内转发
const showForwardSheet = ref(false)
const forwardActions = [
  { name: '站内好友', value: 'friend' },
  { name: '已加入的圈子', value: 'circle' },
  { name: '本校信息流', value: 'school' }
]

function onForward() {
  showForwardSheet.value = true
}

function onForwardSelect(action) {
  showForwardSheet.value = false
  if (!post.value) return
  store.toggleForward(post.value.id)
  const targetMap = { friend: '站内好友', circle: '圈子', school: '本校信息流' }
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
  padding: 16px 16px 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--echo-text);
}

/* 评论空状态 */
.comment-empty {
  padding: 40px 16px;
  text-align: center;
  color: var(--echo-text-hint);
  font-size: 14px;
}

/* 主评论 */
.comment-item {
  background: var(--echo-white);
  padding: 0 16px;
}

.comment-main {
  display: flex;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid var(--echo-border);
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
  gap: 8px;
  margin-bottom: 4px;
}

.comment-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--echo-text);
  cursor: pointer;
}

.comment-time {
  font-size: 11px;
  color: var(--echo-text-hint);
}

.comment-text {
  font-size: 14px;
  color: var(--echo-text);
  line-height: 1.6;
  margin-bottom: 6px;
}

.comment-actions {
  display: flex;
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

/* 楼中楼 */
.reply-list {
  margin-left: 44px;
  padding: 4px 10px 8px;
  background: var(--echo-bg);
  border-radius: 0 0 8px 8px;
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
  bottom: 32px;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 375px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  padding-bottom: max(10px, env(safe-area-inset-bottom));
  background: var(--echo-white);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
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
  gap: 0;
  flex-shrink: 0;
}

.bottom-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 2px 9px;
  color: var(--echo-text-secondary);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.15s;
}

.bottom-action:active {
  transform: scale(0.9);
}

.bottom-action svg {
  width: 20px;
  height: 20px;
  transition: color 0.15s;
}

.bottom-action span {
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
  color: var(--echo-text-hint);
  transition: color 0.15s;
}

/* 点赞激活：主题色实心 */
.bottom-action--active {
  color: var(--echo-primary);
}

.bottom-action--active span {
  color: var(--echo-primary);
}

</style>
