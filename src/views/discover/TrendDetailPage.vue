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
      <span class="detail-forward" @click="onForward(null)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 18c0-4 4-8 10-8h7" /><polyline points="15 5 20 10 15 15" />
        </svg>
      </span>
    </div>

    <!-- 滚动区域 -->
    <div class="scroll-content" :class="{ 'has-discuss-bar': activeTab === 'discussion' }">
      <div class="trend-detail-container" v-if="trend">
        
        <!-- 头部热点专题卡片（压缩高度） -->
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

        <!-- 分类切换 Tabs (三 Tab 切换) -->
        <div class="detail-tabs">
          <div
            class="detail-tab"
            :class="{ 'detail-tab--active': activeTab === 'discussion' }"
            @click="activeTab = 'discussion'"
          >
            <span>讨论</span>
            <span class="tab-count">({{ sortedDiscussions.length }})</span>
            <span v-if="activeTab === 'discussion'" class="tab-active-bar"></span>
          </div>
          <div
            class="detail-tab"
            :class="{ 'detail-tab--active': activeTab === 'posts' }"
            @click="activeTab = 'posts'"
          >
            <span>帖子</span>
            <span class="tab-count">({{ relatedPosts.length }})</span>
            <span v-if="activeTab === 'posts'" class="tab-active-bar"></span>
          </div>
          <div
            class="detail-tab"
            :class="{ 'detail-tab--active': activeTab === 'circles' }"
            @click="activeTab = 'circles'"
          >
            <span>圈子</span>
            <span class="tab-count">({{ relatedCircles.length }})</span>
            <span v-if="activeTab === 'circles'" class="tab-active-bar"></span>
          </div>
        </div>

        <!-- 内容渲染区 -->
        <div class="tab-content-area">
          <!-- 1. 讨论区 (默认 Tab) -->
          <div v-if="activeTab === 'discussion'" class="discussion-view">
            <!-- 讨论区轻量排序 -->
            <div class="discussion-header">
              <div class="sort-options">
                <span
                  class="sort-option-btn"
                  :class="{ 'sort-option-btn--active': discussSortType === 'hot' }"
                  @click="discussSortType = 'hot'"
                >最热</span>
                <span
                  class="sort-option-btn"
                  :class="{ 'sort-option-btn--active': discussSortType === 'latest' }"
                  @click="discussSortType = 'latest'"
                >最新</span>
              </div>
            </div>

            <div v-if="sortedDiscussions.length === 0" class="empty-state">
              <p class="empty-text">💬 暂无即时观点讨论</p>
              <p class="empty-hint">在下方输入，快来留下你的第一句话吧！</p>
            </div>

            <!-- 讨论列表 (轻量评论流) -->
            <div v-else class="discussion-list">
              <div
                v-for="item in sortedDiscussions"
                :key="item.id"
                class="discuss-item"
                @touchstart="handleTouchStartDiscuss(item, $event)"
                @mousedown="handleMouseDownDiscuss(item, $event)"
                @touchmove="handleTouchEndDiscuss"
                @touchend="handleTouchEndDiscuss"
                @mouseup="handleTouchEndDiscuss"
                @mouseleave="handleTouchEndDiscuss"
              >
                <!-- 头像 -->
                <div class="discuss-avatar" :style="{ background: item.author?.avatarColor || '#ccc' }">
                  {{ item.author?.nickname?.slice(0, 1) || '?' }}
                </div>
                
                <!-- 主体内容 -->
                <div class="discuss-main-body">
                  <div class="discuss-top-row">
                    <span class="discuss-name">{{ item.author?.nickname || '未知' }}</span>
                    <span class="discuss-time">{{ formatTime(item.createdAt) }}</span>
                  </div>
                  
                  <div class="discuss-text">{{ item.content }}</div>
                  
                  <div class="discuss-bottom-row">
                    <!-- 点赞 -->
                    <div
                      class="discuss-action"
                      :class="{ 'discuss-action--active': isDiscussLiked(item.id) }"
                      @click.stop="toggleDiscussLike(item.id)"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" :fill="isDiscussLiked(item.id) ? 'var(--echo-danger)' : 'none'" :stroke="isDiscussLiked(item.id) ? 'var(--echo-danger)' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      <span>{{ item.likeCount || 0 }}</span>
                    </div>
                    
                    <!-- 回复 -->
                    <div class="discuss-action" @click.stop="onReplyDiscuss(item)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <span>回复</span>
                    </div>
                  </div>

                  <!-- 楼中楼回复 -->
                  <div class="discuss-reply-box" v-if="getDiscussReplies(item.id).length > 0">
                    <div
                      v-for="rep in getVisibleReplies(item.id)"
                      :key="rep.id"
                      class="discuss-reply-item"
                    >
                      <span class="reply-author-name">{{ rep.author?.nickname }}:</span>
                      <span class="reply-content-text">{{ rep.content }}</span>
                    </div>
                    
                    <div
                      v-if="getDiscussReplies(item.id).length > 2"
                      class="reply-more-link"
                      @click.stop="showAllReplies(item)"
                    >
                      展开更多回复 (共{{ getDiscussReplies(item.id).length }}条) >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 帖子流列表 -->
          <div v-if="activeTab === 'posts'">
            <!-- 帖子区轻量排序 -->
            <div class="discussion-header">
              <div class="sort-options">
                <span
                  class="sort-option-btn"
                  :class="{ 'sort-option-btn--active': postSortType === 'hot' }"
                  @click="postSortType = 'hot'"
                >最热</span>
                <span
                  class="sort-option-btn"
                  :class="{ 'sort-option-btn--active': postSortType === 'latest' }"
                  @click="postSortType = 'latest'"
                >最新</span>
              </div>
            </div>

            <div v-if="sortedPosts.length === 0" class="empty-state">
              <p class="empty-text">📚 暂无讨论帖子</p>
              <p class="empty-hint">点击下方按钮，发布第一条讨论帖吧！</p>
            </div>
            
            <div v-else class="post-list">
              <div
                v-for="post in sortedPosts"
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
                <!-- 帖子头部 -->
                <div class="post-card-header">
                  <div class="header-left" @click.stop="clickAuthor(post)">
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

                <!-- 底部栏 -->
                <div class="post-card-footer">
                  <div class="footer-left-tags">
                    <span class="tag-badge" v-if="post.categoryTag">{{ post.categoryTag }}</span>
                    <span v-if="post.isAnon" class="tag-badge tag-badge--anon">匿名发布</span>
                  </div>

                  <div class="footer-actions-right">
                    <!-- 点赞 -->
                    <div class="post-card-action" @click.stop="onPostLike(post)">
                      <svg width="16" height="16" viewBox="0 0 24 24" :fill="store.isPostLiked(post.id) ? 'var(--echo-danger)' : 'none'" :stroke="store.isPostLiked(post.id) ? 'var(--echo-danger)' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      <span>{{ post.likeCount }}</span>
                    </div>
                    <!-- 评论 -->
                    <div class="post-card-action" @click.stop="goPostDetail(post.id)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <span>{{ post.commentCount }}</span>
                    </div>
                    <!-- 收藏 -->
                    <div class="post-card-action" @click.stop="onPostCollect(post)">
                      <svg width="16" height="16" viewBox="0 0 24 24" :fill="store.isPostCollected(post.id) ? 'var(--echo-warning)' : 'none'" :stroke="store.isPostCollected(post.id) ? 'var(--echo-warning)' : 'currentColor'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      <span>{{ post.collectCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. 相关圈子 -->
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

    <!-- 底部常驻讨论输入框 (只有讨论 Tab 激活时显示) -->
    <div v-if="activeTab === 'discussion'" class="discussion-bottom-bar">
      <div class="discuss-input-wrap">
        <input
          v-model="discussInputText"
          class="discuss-input"
          :placeholder="discussReplyTarget ? `回复 ${discussReplyTarget.author?.nickname}...` : '参与话题讨论...'"
          @focus="onInputFocus"
          @keyup.enter="sendDiscussion"
        />
      </div>
      <button class="discuss-send-btn" @click="sendDiscussion">发送</button>
    </div>

    <!-- 底部悬浮参与讨论大按钮 (仅在 帖子 Tab 下显示) -->
    <div class="publish-float-wrap" v-else-if="activeTab === 'posts' && trend">
      <button class="publish-float-btn" @click="goPublish">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        发布帖子
      </button>
    </div>

    <!-- 转发面板 -->
    <van-action-sheet
      v-model:show="showForwardSheet"
      title="转发"
      :actions="forwardActions"
      teleport="body"
      cancel-text="取消"
      @select="onForwardSelect"
    />

    <!-- ===== 悬浮 ContextMenu 菜单 ===== -->
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
import { showToast, showDialog } from 'vant'
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

const activeTab = ref('discussion')

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

const postSortType = ref('hot') // 'hot' | 'latest'
const sortedPosts = computed(() => {
  const posts = [...relatedPosts.value]
  if (postSortType.value === 'hot') {
    return posts.sort((a, b) => {
      const scoreA = (a.likeCount || 0) + (a.commentCount || 0) * 2 + (a.collectCount || 0) * 3
      const scoreB = (b.likeCount || 0) + (b.commentCount || 0) * 2 + (b.collectCount || 0) * 3
      return scoreB - scoreA
    })
  } else {
    return posts.sort((a, b) => new Date(b.createdAt.replace(/-/g, '/')) - new Date(a.createdAt.replace(/-/g, '/')))
  }
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
  if (!store.checkAuth('user')) return
  router.push(`/profile/${uid}`)
}

function clickAuthor(post) {
  if (post.isAnon) {
    showDialog({
      title: '提示',
      message: '该帖由匿名用户发布，无法查看其个人主页。',
      confirmButtonText: '我知道了',
      teleport: '#phone-screen'
    })
  } else {
    goUserProfile(post.authorId)
  }
}

// ===== 讨论观点区专属逻辑与 Mock 数据 =====
const discussSortType = ref('hot') // 'hot' | 'latest'
const discussInputText = ref('')
const discussReplyTarget = ref(null)
const likedDiscussIds = ref(new Set())
const menuType = ref('post') // 'post' | 'comment' | 'discuss'
const selectedDiscuss = ref(null)

const discussList = ref([
  {
    id: 'd_1',
    trendId: trendId,
    content: '我们学校今天真炸了😂 吃瓜群众把操场都围严实了！',
    likeCount: 42,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toLocaleString('zh-CN', { hour12: false }), // 15分钟前
    author: { nickname: '城南花开', avatarColor: '#ff7675' }
  },
  {
    id: 'd_2',
    trendId: trendId,
    content: '这次宿管阿姨和学校后勤反应挺及时的，点个赞👍',
    likeCount: 23,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleString('zh-CN', { hour12: false }), // 2小时前
    author: { nickname: '北巷木棉', avatarColor: '#74b9ff' }
  },
  {
    id: 'd_3',
    trendId: trendId,
    content: '蹲一个懂哥讲讲详细经过，前排出售小板凳。',
    likeCount: 15,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toLocaleString('zh-CN', { hour12: false }), // 5小时前
    author: { nickname: '西风瘦马', avatarColor: '#55efc4' }
  }
])

const discussReplies = ref([
  {
    id: 'dr_1',
    discussId: 'd_1',
    content: '确实，挤爆了，隔壁宿舍楼都在趴阳台看。',
    author: { nickname: '隔壁吃瓜王', avatarColor: '#ffeaa7' }
  },
  {
    id: 'dr_2',
    discussId: 'd_1',
    content: '哈哈，这次真是全校名场面。',
    author: { nickname: '名侦探柯北', avatarColor: '#a29bfe' }
  }
])

// 获取指定讨论的二级回复
function getDiscussReplies(discussId) {
  return discussReplies.value.filter(r => r.discussId === discussId)
}

// 默认获取前2条
function getVisibleReplies(discussId) {
  return getDiscussReplies(discussId).slice(0, 2)
}

// 展开更多回复（弹出轻Toast提示或全部展开）
function showAllReplies(discussItem) {
  showToast(`已展开全部 ${getDiscussReplies(discussItem.id).length} 条回复`)
}

// 点赞讨论观点
function isDiscussLiked(discussId) {
  return likedDiscussIds.value.has(discussId)
}

function toggleDiscussLike(discussId) {
  if (!store.checkAuth('like')) return
  const item = discussList.value.find(d => d.id === discussId)
  if (!item) return
  if (likedDiscussIds.value.has(discussId)) {
    likedDiscussIds.value.delete(discussId)
    item.likeCount = Math.max(0, item.likeCount - 1)
  } else {
    likedDiscussIds.value.add(discussId)
    item.likeCount++
  }
}

// 准备回复讨论观点
function onReplyDiscuss(discussItem) {
  if (!store.checkAuth('comment')) return
  discussReplyTarget.value = discussItem
}

// 发送讨论或回复
function sendDiscussion() {
  if (!store.checkAuth('comment')) return
  if (!discussInputText.value.trim()) return
  
  if (discussReplyTarget.value) {
    // 发表回复
    discussReplies.value.push({
      id: `dr_${Date.now()}`,
      discussId: discussReplyTarget.value.id,
      content: discussInputText.value.trim(),
      author: { nickname: '我', avatarColor: '#9b59b6' }
    })
    showToast('回复发表成功')
    discussReplyTarget.value = null
  } else {
    // 发表新讨论
    discussList.value.unshift({
      id: `d_${Date.now()}`,
      trendId: trendId,
      content: discussInputText.value.trim(),
      likeCount: 0,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
      author: { nickname: '我', avatarColor: '#9b59b6' }
    })
    showToast('讨论发表成功')
  }
  discussInputText.value = ''
}

// 讨论排序过滤逻辑
const sortedDiscussions = computed(() => {
  const list = discussList.value.filter(d => d.trendId === trendId)
  if (discussSortType.value === 'hot') {
    return [...list].sort((a, b) => {
      const scoreA = (a.likeCount || 0) + getDiscussReplies(a.id).length * 2
      const scoreB = (b.likeCount || 0) + getDiscussReplies(b.id).length * 2
      return scoreB - scoreA
    })
  } else {
    return [...list].sort((a, b) => new Date(b.createdAt.replace(/-/g, '/')) - new Date(a.createdAt.replace(/-/g, '/')))
  }
})

// 格式化讨论区时间
function formatTime(dateStr) {
  if (!dateStr) return ''
  try {
    const cleanStr = dateStr.replace(/-/g, '/')
    const d = new Date(cleanStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    if (diffMs < 1000 * 60) return '刚刚'
    const diffMins = Math.floor(diffMs / (1000 * 60))
    if (diffMins < 60) return `${diffMins}分钟前`
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours < 24) return `${diffHours}小时前`
    
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${month}-${day}`
  } catch (e) {
    return dateStr
  }
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
  if (menuType.value === 'discuss') {
    if (selectedDiscuss.value?.author?.nickname === '我') {
      return [
        { label: '删除观点', value: 'delete_discuss', icon: deleteIcon, danger: true }
      ]
    } else {
      return [
        { label: '复制观点', value: 'copy_discuss', icon: editIcon },
        { label: '不感兴趣', value: 'dislike_discuss', icon: dislikeIcon },
        { label: '举报观点', value: 'report_discuss', icon: reportIcon, danger: true }
      ]
    }
  }

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

// ===== 讨论长按事件监听 =====
let discussLongPressTimer = null

function handleLongPressStartDiscuss(item, event) {
  if (discussLongPressTimer) clearTimeout(discussLongPressTimer)
  
  const touch = event.type.startsWith('touch') ? event.touches[0] : event
  lastClientX = touch.clientX
  lastClientY = touch.clientY
  
  discussLongPressTimer = setTimeout(() => {
    menuType.value = 'discuss'
    selectedDiscuss.value = item
    
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
    store.lockPhoneScroll()
    discussLongPressTimer = null
  }, 400)
}

function handleTouchStartDiscuss(item, event) {
  isTouchActive = true
  handleLongPressStartDiscuss(item, event)
}

function handleTouchEndDiscuss() {
  if (discussLongPressTimer) {
    clearTimeout(discussLongPressTimer)
    discussLongPressTimer = null
  }
  setTimeout(() => {
    isTouchActive = false
  }, 100)
}

function handleMouseDownDiscuss(item, event) {
  if (isTouchActive) return
  if (event.button !== 0) return
  handleLongPressStartDiscuss(item, event)
}

// ===== 帖子长按事件监听 =====
function handleLongPressStart(postId, event) {
  if (longPressTimer) clearTimeout(longPressTimer)
  wasLongPressed.value = false
  
  const touch = event.type.startsWith('touch') ? event.touches[0] : event
  lastClientX = touch.clientX
  lastClientY = touch.clientY
  
  longPressTimer = setTimeout(() => {
    menuType.value = 'post'
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
  if (event.target.closest('.post-more-btn')) return
  if (event.button !== 0) return
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
  menuType.value = 'post'
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
  if (value === 'report_discuss' || value === 'report') {
    if (!store.checkAuth('user')) return
  }
  if (value === 'block_discuss' || value === 'block') {
    if (!store.checkAuth('user')) return
  }
  if (value === 'forward' || value === 'share') {
    if (!store.checkAuth('share')) return
  }
  if (['delete_discuss', 'copy_discuss', 'dislike_discuss', 'edit', 'delete', 'permission', 'pin', 'dislike', 'reduce'].includes(value)) {
    if (!store.checkAuth('interaction')) return
  }

  // 讨论菜单交互
  if (menuType.value === 'discuss') {
    const item = selectedDiscuss.value
    if (!item) return
    if (value === 'delete_discuss') {
      discussList.value = discussList.value.filter(d => d.id !== item.id)
      showToast('讨论已删除')
    } else if (value === 'copy_discuss') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(item.content)
      }
      showToast('已复制到剪贴板')
    } else if (value === 'dislike_discuss') {
      discussList.value = discussList.value.filter(d => d.id !== item.id)
      showToast('将减少此类讨论的展示')
    } else if (value === 'report_discuss') {
      showToast('举报已提交')
    }
    closeContextMenu()
    return
  }

  // 帖子菜单交互
  const postId = selectedPostId.value
  if (!postId) return
  const post = store.posts.find(p => p.id === postId)
  if (!post) return
  
  if (value === 'edit') {
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
    const authorPostIds = store.posts.filter(p => p.authorId === post.authorId).map(p => p.id)
    authorPostIds.forEach(id => hidingPostIds.value.add(id))
    setTimeout(() => {
      authorPostIds.forEach(id => store.hidePost(id))
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
  if (!store.checkAuth('user')) return
  router.push(`/circle/${circleId}`)
}

// 闭环发帖
function goPublish() {
  if (!store.checkAuth('publish')) return
  if (!trend.value) return
  router.push({
    path: '/post/create',
    query: {
      content: `${trend.value.title} `,
      topicTags: trend.value.relatedTags ? trend.value.relatedTags.join(',') : ''
    }
  })
}

function onPostLike(post) {
  if (!store.checkAuth('like')) return
  store.toggleLike(post.id)
}

function onPostCollect(post) {
  if (!store.checkAuth('like')) return
  store.toggleCollect(post.id)
}

function onInputFocus(e) {
  if (!store.checkAuth('comment')) {
    e.target.blur()
  }
}

const showForwardSheet = ref(false)
const forwardPostId = ref(null)
const forwardActions = [
  { name: '联系人', value: 'friend', className: 'action-forward-friend' },
  { name: '圈子', value: 'circle', className: 'action-forward-circle' }
]

function onForward(postId) {
  if (!store.checkAuth('share')) return
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
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background: #f6f7f9;
}

/* 顶部粘性/固定导航 */
.detail-header {
  position: sticky;
  top: 0;
  width: 100%;
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
  flex: 1;
  box-sizing: border-box;
}

.scroll-content.has-discuss-bar {
  padding-bottom: calc(56px + env(safe-area-inset-bottom)); /* 为底部的讨论输入框留出空间 */
}

.trend-detail-container {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0 0 100px;
}

/* 头部热议卡片 - 压缩高度 */
.trend-hero-card {
  background: linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%);
  border-radius: 0;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(155, 89, 182, 0.1);
}

.hero-tag-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  color: #9b59b6;
  background: rgba(255, 255, 255, 0.55);
  padding: 2px 6px;
  border-radius: 20px;
  width: fit-content;
  margin-bottom: 8px;
  line-height: 1.2;
}

.hero-title {
  font-size: 18px;
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1.3;
  margin: 0 0 4px 0;
}

.hero-desc {
  font-size: 12px;
  color: #555;
  line-height: 1.45;
  margin: 0 0 8px 0;
}

.hero-stats {
  font-size: 11px;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
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
  font-size: 10px;
  font-weight: 500;
  color: #9b59b6;
  background: #ffffff;
  padding: 3px 8px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

/* Tabs */
.detail-tabs {
  background: var(--echo-white);
  border-radius: 0;
  height: 42px;
  display: flex;
  padding: 0 8px;
  border-bottom: 1px solid var(--echo-border);
}

.detail-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  position: relative;
  font-size: 13px;
  color: var(--echo-text-secondary);
  font-weight: 500;
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.detail-tab--active {
  color: var(--echo-primary);
  font-weight: 700;
}

.tab-count {
  font-size: 10px;
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

/* 讨论区专属样式 */
.discussion-view {
  background: var(--echo-white);
  border-radius: 0;
  padding: 8px 0;
}

.discussion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 16px;
  background: var(--echo-white);
}

.sort-options {
  display: flex;
  gap: 12px;
}

.sort-option-btn {
  font-size: 12px;
  color: var(--echo-text-secondary);
  cursor: pointer;
  font-weight: 500;
  padding: 2px 4px;
}

.sort-option-btn--active {
  color: var(--echo-primary);
  font-weight: 700;
}

.discussion-list {
  display: flex;
  flex-direction: column;
}

.discuss-item {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--echo-border);
  box-sizing: border-box;
}

.discuss-item:last-child {
  border-bottom: none;
}

.discuss-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.discuss-main-body {
  flex: 1;
  min-width: 0;
}

.discuss-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.discuss-name {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--echo-text);
}

.discuss-time {
  font-size: 11px;
  color: var(--echo-text-hint);
}

.discuss-text {
  font-size: 13.5px;
  color: var(--echo-text);
  line-height: 1.5;
  word-break: break-all;
  margin-bottom: 6px;
}

.discuss-bottom-row {
  display: flex;
  gap: 16px;
  align-items: center;
}

.discuss-action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: var(--echo-text-hint);
  cursor: pointer;
  user-select: none;
}

.discuss-action--active {
  color: var(--echo-danger);
}

/* 讨论二级回复缩进 */
.discuss-reply-box {
  margin-top: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.discuss-reply-item {
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--echo-text-secondary);
}

.reply-author-name {
  font-weight: 600;
  color: var(--echo-text-secondary);
  margin-right: 4px;
}

.reply-content-text {
  color: var(--echo-text);
}

.reply-more-link {
  font-size: 11px;
  color: var(--echo-primary);
  font-weight: 600;
  cursor: pointer;
  margin-top: 2px;
}

/* 讨论底部常驻输入栏 */
.discussion-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: calc(52px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--echo-white);
  border-top: 1px solid var(--echo-border);
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 16px;
  padding-right: 16px;
  box-sizing: border-box;
  z-index: 1000;
}

.discuss-input-wrap {
  flex: 1;
  min-width: 0;
}

.discuss-input {
  width: 100%;
  height: 34px;
  border-radius: 17px;
  border: 1px solid var(--echo-border);
  padding: 0 14px;
  font-size: 13px;
  color: var(--echo-text);
  outline: none;
  background: var(--echo-bg);
  box-sizing: border-box;
}

.discuss-input:focus {
  border-color: var(--echo-primary);
}

.discuss-send-btn {
  font-size: 13px;
  font-weight: 700;
  color: var(--echo-primary);
  background: transparent;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  padding: 4px 8px;
}
.discuss-send-btn:active {
  opacity: 0.7;
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
  gap: 0;
}

.post-card {
  background: var(--echo-white);
  border-radius: 0;
  padding: 16px;
  border-bottom: 1px solid var(--echo-border);
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

.footer-left-tags {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tag-badge--anon {
  background: #fdf2f2;
  color: #ec5b5b;
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
  gap: 0;
}

.circle-card {
  background: var(--echo-white);
  border-radius: 0;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--echo-border);
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
