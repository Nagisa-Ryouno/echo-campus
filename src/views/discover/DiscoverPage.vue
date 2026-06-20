<template>
  <div class="page-root">
    <!-- ═══════════════════════════════════════════ -->
    <!-- 固定层：position:fixed，脱离滚动流             -->
    <!-- ═══════════════════════════════════════════ -->
    <div class="fixed-header">
      <!-- 标题栏：滚动后隐藏 -->
      <div class="logo-header" :class="{ hidden: scrollTop > 10 }">
        <h1 class="discover-title">发现</h1>
        <div class="discover-search-btn" @click="$router.push('/search')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      <!-- Tab 栏：永久固定 -->
      <div class="channel-header">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          class="discover-tab"
          :class="{ 'discover-tab--active': activeTab === tab.key }"
          @click="switchTab(tab.key)"
        >
          <span>{{ tab.label }}</span>
          <span v-if="activeTab === tab.key" class="discover-tab-bar"></span>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- 滚动层：独立 overflow-y:auto，与固定层彻底隔离    -->
    <!-- ═══════════════════════════════════════════ -->
    <div ref="scrollRef" class="scroll-content" @scroll="handleScroll">
      <!-- 动态占位：标题显示时 92px，隐藏后 48px -->
      <div
        class="header-spacer"
        :style="{
          height: (scrollTop > 10 ? 48 : 92) + 'px',
          transition: 'height 0.2s ease'
        }"
      ></div>

      <div class="discover-feed">
        <!-- 空状态 -->
        <div v-if="displayPosts.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <p class="empty-text">暂无内容</p>
          <p class="empty-hint">去看看其他栏目吧</p>
        </div>

        <!-- 帖子卡片流 -->
        <div
          v-for="(item, idx) in displayPosts"
          :key="item.id"
          class="hot-post-card"
          :class="{ 'hot-post-card--ranked': activeTab === 'campus_hot' || activeTab === 'topic_hot' }"
          @click="goDetail(item.id)"
        >
          <!-- 排名 badge（热榜模式） -->
          <div
            v-if="activeTab === 'campus_hot' || activeTab === 'topic_hot'"
            class="rank-badge"
            :class="{ 'rank-badge--top': idx < 3 }"
          >
            {{ idx + 1 }}
          </div>

          <!-- 帖子主内容 -->
          <div class="hot-post-main" :class="{ 'hot-post-main--ranked': activeTab === 'campus_hot' || activeTab === 'topic_hot' }">
            <div class="hot-post-header" @click.stop="goProfile(item.authorId)">
              <div class="hot-post-avatar" :style="{ background: getAuthor(item.authorId)?.avatarColor || '#ccc' }">
                {{ item.isAnon ? '匿' : getAuthor(item.authorId)?.nickname?.slice(0, 1) || '?' }}
              </div>
              <span class="hot-post-name">
                {{ item.isAnon ? '匿名用户' : getAuthor(item.authorId)?.nickname || '未知' }}
              </span>
              <span class="hot-post-time">{{ item.createdAt }}</span>
            </div>

            <p class="hot-post-content">{{ item.content }}</p>

            <!-- 标签 -->
            <div class="hot-post-tags" v-if="item.topicTags?.length">
              <span
                v-for="t in item.topicTags"
                :key="t"
                class="hot-post-tag"
                @click.stop="goTag(t)"
              >#{{ t }}</span>
            </div>

            <!-- 互动栏 -->
            <div class="hot-post-footer">
              <span class="hot-post-action">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                {{ item.likeCount }}
              </span>
              <span class="hot-post-action">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                {{ item.commentCount }}
              </span>
              <!-- 热度图标 — 火焰 SVG -->
              <span
                class="hot-post-action hot-post-action--heat"
                :class="{ 'hot-post-action--heat-active': isHeatTab }"
                v-if="isHeatTab"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2.5C9.5 6.5 7 10.5 7 14.8C7 18 9.2 21.5 12 21.5C14.8 21.5 17 18 17 14.8C17 10.5 14.5 6.5 12 2.5Z" />
                  <path class="flame-core" d="M10 16.2C10 15.1 10.9 14.5 12 14.5C13.1 14.5 14 15.1 14 16.2" fill="currentColor" stroke="none" />
                </svg>
                {{ calcHeat(item) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'

const router = useRouter()
const store = useAppStore()

// ===== 滚动监听：直接监听 .scroll-content =====
const scrollTop = ref(0)
const scrollRef = ref(null)

function handleScroll() {
  scrollTop.value = scrollRef.value?.scrollTop ?? 0
}

const tabs = [
  { key: 'hot', label: '热门' },
  { key: 'newest', label: '最新' },
  { key: 'campus_hot', label: '校园热榜' },
  { key: 'topic_hot', label: '话题热榜' }
]

const activeTab = ref('hot')

const isHeatTab = computed(() =>
  ['hot', 'campus_hot', 'topic_hot'].includes(activeTab.value)
)

function switchTab(key) {
  activeTab.value = key
}

// 热度计算：like + comment*1.5 + collect*2
function calcHeat(post) {
  return post.likeCount + Math.floor(post.commentCount * 1.5) + post.collectCount * 2
}

// 所有公开帖子
const allPublicPosts = computed(() =>
  store.posts.filter(p => p.visibility === 'public')
)

// 按 Tab 展示不同排序
const displayPosts = computed(() => {
  switch (activeTab.value) {
    case 'hot':
      return [...allPublicPosts.value].sort((a, b) => calcHeat(b) - calcHeat(a)).slice(0, 20)
    case 'newest':
      return [...allPublicPosts.value].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    case 'campus_hot':
      return [...allPublicPosts.value]
        .filter(p => p.schoolOnly)
        .sort((a, b) => calcHeat(b) - calcHeat(a))
        .slice(0, 20)
    case 'topic_hot':
      return [...allPublicPosts.value]
        .filter(p => p.topicTags && p.topicTags.length > 0)
        .sort((a, b) => (b.commentCount + b.likeCount) - (a.commentCount + a.likeCount))
        .slice(0, 20)
    default:
      return []
  }
})

function getAuthor(uid) {
  return store.getUserById(uid)
}

function goDetail(postId) {
  router.push(`/post/${postId}`)
}

function goProfile(uid) {
  if (uid) router.push(`/profile/${uid}`)
}

function goTag(tag) {
  router.push({ path: '/discover', query: { tag } })
}
</script>

<style scoped>
/* ═══════════════════════════════════════════ */
/* 页面根：填充 phone-screen，自身不滚动          */
/* ═══════════════════════════════════════════ */
.page-root {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* ═══════════════════════════════════════════ */
/* 固定层：position:fixed，相对 phone-body       */
/* ═══════════════════════════════════════════ */
.fixed-header {
  position: fixed;
  top: 48px;
  left: 50%;
  transform: translateX(-50%);
  width: 375px;
  z-index: 1000;
  background: var(--echo-bg);
}

/* ── 标题栏：滚动后隐藏 ── */
.logo-header {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px 6px;
  box-sizing: border-box;
  transition: height 0.2s ease, padding 0.2s ease, opacity 0.2s ease;
  overflow: hidden;
}

.logo-header.hidden {
  height: 0;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
}

.discover-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--echo-text);
  letter-spacing: 0.5px;
  margin: 0;
}

.discover-search-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e8edf2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--echo-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.discover-search-btn:active {
  background: var(--echo-border);
  transform: scale(0.95);
}

/* ── Tab 栏：永久固定，禁止 sticky ── */
.channel-header {
  height: 48px;
  display: flex;
  background: var(--echo-bg);
  border-bottom: 1px solid var(--echo-divider);
}

.discover-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  font-size: 13px;
  color: var(--echo-text-secondary);
  font-weight: 500;
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.discover-tab--active {
  color: var(--echo-text);
  font-weight: 600;
}

.discover-tab-bar {
  position: absolute;
  bottom: 6px;
  width: 18px;
  height: 2.5px;
  border-radius: 2px;
  background: var(--echo-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ═══════════════════════════════════════════ */
/* 滚动层：独立 overflow-y:auto                   */
/* ═══════════════════════════════════════════ */
.scroll-content {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

/* 动态占位高度由 :style 控制 */

/* ── 帖子流 ── */
.discover-feed {
  padding: 0;
  min-height: calc(100% - 48px + 45px);
}

/* ── 热帖卡片 ── */
.hot-post-card {
  background: var(--echo-white);
  display: flex;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid var(--echo-border);
}

.hot-post-card:active {
  background: #f8f9fb;
}

.hot-post-card--ranked {
  align-items: flex-start;
}

/* ── 排名 ── */
.rank-badge {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: #ddd;
  color: #999;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 12px;
  margin-top: 2px;
}

.rank-badge--top {
  background: linear-gradient(135deg, #ff6b35, #e74c3c);
  color: #fff;
}

.hot-post-main {
  flex: 1;
  min-width: 0;
}

/* ── 帖子头部 ── */
.hot-post-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}

.hot-post-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.hot-post-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--echo-text);
}

.hot-post-time {
  font-size: 11px;
  color: var(--echo-text-hint);
  margin-left: auto;
}

/* ── 正文 ── */
.hot-post-content {
  font-size: 14px;
  color: var(--echo-text);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  margin-bottom: 8px;
}

/* ── 标签 ── */
.hot-post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.hot-post-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  cursor: pointer;
  transition: all 0.15s;
}

.hot-post-tag:active {
  transform: scale(0.95);
  background: var(--echo-primary);
  color: #fff;
}

/* ── 互动栏 ── */
.hot-post-footer {
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: var(--echo-text-hint);
  align-items: center;
}

.hot-post-action {
  display: flex;
  align-items: center;
  gap: 3px;
}

.hot-post-action--heat {
  color: var(--echo-accent);
  font-weight: 500;
}

/* 火焰内焰 — 默认半透明 */
.hot-post-action--heat .flame-core {
  opacity: 0.35;
  transition: opacity 0.3s ease;
}

/* 热榜 Tab 下火焰更醒目 */
.hot-post-action--heat-active {
  color: #e85d2c;
  font-weight: 600;
}

.hot-post-action--heat-active .flame-core {
  opacity: 0.55;
}

/* ── 空状态 ── */
.empty-state {
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

.empty-text {
  font-size: 15px;
  margin-bottom: 4px;
}

.empty-hint {
  font-size: 13px;
  opacity: 0.7;
}
</style>
