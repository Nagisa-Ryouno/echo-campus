<template>
  <div class="search-page">
    <!-- 紧凑定点块：搜索栏 + 结果 Tab -->
    <div class="search-sticky-wrap" :class="{ 'is-scrolled': isScrolled }">
      <div class="search-header">
        <div class="search-input-wrap">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            ref="inputRef"
            v-model="keyword"
            type="text"
            class="search-input"
            placeholder="搜索用户、帖子、话题"
            @keyup.enter="doSearch"
            @input="onInput"
          />
          <span v-if="keyword" class="search-clear" @click="keyword = ''; results = null">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </span>
        </div>
        <span class="search-cancel" @click="$router.back()">取消</span>
      </div>

      <!-- 结果 Tab（仅在搜索后有结果时显示） -->
      <div v-if="results" class="result-tabs">
        <div
          v-for="tab in resultTabs"
          :key="tab.key"
          class="result-tab"
          :class="{ active: activeResultTab === tab.key }"
          @click="activeResultTab = tab.key"
        >
          {{ tab.label }}
          <span v-if="getResultCount(tab.key) > 0" class="result-count">{{ getResultCount(tab.key) }}</span>
        </div>
      </div>
    </div>

    <!-- 搜索历史 / 热门搜索 -->
    <div v-if="!keyword && !results" class="search-default">
      <!-- 热门搜索 -->
      <div class="search-section">
        <div class="section-header">
          <span class="section-title">🔥 热门搜索</span>
        </div>
        <div class="hot-tags">
          <span v-for="t in hotSearches" :key="t" class="hot-tag" @click="keyword = t; doSearch()">{{ t }}</span>
        </div>
      </div>

      <!-- 推荐用户 -->
      <div class="search-section">
        <div class="section-header">
          <span class="section-title">👥 推荐用户</span>
        </div>
        <div class="user-list">
          <div
            v-for="u in recommendUsers"
            :key="u.id"
            class="search-user-item"
            @click="$router.push(`/profile/${u.id}`)"
          >
            <div class="su-avatar" :style="{ background: u.avatarColor }">{{ u.nickname.slice(0, 1) }}</div>
            <div class="su-info">
              <div class="su-name">{{ u.nickname }}</div>
              <div class="su-school">{{ u.school }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索结果列表 -->
    <div v-if="results" class="search-results">

      <!-- 用户结果 -->
      <div v-if="activeResultTab === 'users'" class="result-list">
        <div v-if="filteredUsers.length === 0" class="echo-empty">
          <div class="echo-empty-icon">🔍</div>
          <p class="echo-empty-text">未找到相关用户</p>
        </div>
        <div
          v-for="u in filteredUsers"
          :key="u.id"
          class="search-user-item"
          @click="$router.push(`/profile/${u.id}`)"
        >
          <div class="su-avatar" :style="{ background: u.avatarColor }">{{ u.nickname.slice(0, 1) }}</div>
          <div class="su-info">
            <div class="su-name">{{ u.nickname }}</div>
            <div class="su-school">{{ u.school }}</div>
          </div>
        </div>
      </div>

      <!-- 帖子结果 -->
      <div v-if="activeResultTab === 'posts'" class="result-list">
        <div v-if="filteredPosts.length === 0" class="echo-empty">
          <div class="echo-empty-icon">📭</div>
          <p class="echo-empty-text">未找到相关帖子</p>
        </div>
        <div
          v-for="p in filteredPosts"
          :key="p.id"
          class="search-post-item"
          @click="$router.push(`/post/${p.id}`)"
        >
          <p class="sp-content" v-html="highlightMatch(p.content)"></p>
          <div class="sp-meta">
            <span class="sp-author">{{ getAuthor(p.authorId)?.nickname || '匿名' }}</span>
            <span class="sp-stats">{{ p.likeCount }} 赞 · {{ p.commentCount }} 评</span>
          </div>
        </div>
      </div>

      <!-- 话题结果 -->
      <div v-if="activeResultTab === 'topics'" class="result-list">
        <div v-if="filteredTopics.length === 0" class="echo-empty">
          <div class="echo-empty-icon">🏷️</div>
          <p class="echo-empty-text">未找到相关话题</p>
        </div>
        <div
          v-for="t in filteredTopics"
          :key="t.name"
          class="search-topic-item"
        >
          <div class="st-icon">#</div>
          <div class="st-info">
            <div class="st-name">{{ t.name }}</div>
            <div class="st-count">{{ t.count }} 篇帖子</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { useScrollCollapse } from '@/composables/useScrollCollapse.js'

const router = useRouter()
const store = useAppStore()

const { isScrolled } = useScrollCollapse(6)

const keyword = ref('')
const results = ref(null)
const activeResultTab = ref('posts')
const inputRef = ref(null)

const resultTabs = [
  { key: 'posts', label: '帖子' },
  { key: 'users', label: '用户' },
  { key: 'topics', label: '话题' }
]

const hotSearches = ['考研', '四六级', '摄影', '二手闲置', '健身房', '美食探店', '实习', '恋爱']

const recommendUsers = computed(() =>
  store.users.filter(u => u.id !== 'u1').slice(0, 5)
)

// ===== 搜索结果 =====
const filteredPosts = computed(() => {
  if (!keyword.value) return []
  const kw = keyword.value.toLowerCase()
  return store.posts
    .filter(p => p.visibility === 'public')
    .filter(p =>
      p.content.toLowerCase().includes(kw) ||
      (p.topicTags || []).some(t => t.toLowerCase().includes(kw)) ||
      (p.categoryTag || '').toLowerCase().includes(kw)
    )
    .slice(0, 15)
})

const filteredUsers = computed(() => {
  if (!keyword.value) return []
  const kw = keyword.value.toLowerCase()
  return store.users.filter(u =>
    u.nickname.toLowerCase().includes(kw) ||
    u.school.toLowerCase().includes(kw) ||
    (u.echoId || '').toLowerCase().includes(kw)
  )
})

const filteredTopics = computed(() => {
  if (!keyword.value) return []
  const kw = keyword.value.toLowerCase()
  const topicMap = {}
  store.posts
    .filter(p => p.visibility === 'public')
    .forEach(p => {
      (p.topicTags || []).forEach(t => {
        if (t.toLowerCase().includes(kw)) {
          topicMap[t] = (topicMap[t] || 0) + 1
        }
      })
    })
  return Object.entries(topicMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

function getResultCount(key) {
  if (key === 'posts') return filteredPosts.value.length
  if (key === 'users') return filteredUsers.value.length
  if (key === 'topics') return filteredTopics.value.length
  return 0
}

function getAuthor(uid) {
  return store.getUserById(uid)
}

function highlightMatch(text) {
  if (!keyword.value) return text
  const kw = keyword.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${kw})`, 'gi'), '<em class="highlight">$1</em>')
}

function onInput() {
  if (keyword.value.trim()) {
    doSearch()
  } else {
    results.value = null
  }
}

function doSearch() {
  if (!keyword.value.trim()) return
  results.value = true
}

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style scoped>
.search-page {
  min-height: 100%;
  background: var(--echo-bg);
}

/* ===== 紧凑粘性锚定块（搜索栏 + 结果 Tab）===== */
.search-sticky-wrap {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--echo-white);
  max-width: 375px;
  box-sizing: border-box;
  box-shadow: none;
  transition: box-shadow 0.2s ease;
}

.search-sticky-wrap.is-scrolled {
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

/* ===== 搜索栏（紧凑）===== */
.search-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--echo-white);
}

.search-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--echo-bg);
  border-radius: var(--echo-radius-full);
  padding: 0 12px;
  height: 34px;
  border: 1.5px solid transparent;
  transition: all var(--echo-transition-fast);
}

.search-input-wrap:focus-within {
  border-color: var(--echo-primary);
  background: var(--echo-white);
}

.search-icon {
  color: var(--echo-text-hint);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--echo-text-md);
  color: var(--echo-text);
  font-family: inherit;
}

.search-input::placeholder {
  color: var(--echo-text-hint);
}

.search-clear {
  color: var(--echo-text-hint);
  cursor: pointer;
  padding: 2px;
}

.search-cancel {
  font-size: var(--echo-text-md);
  color: var(--echo-primary);
  cursor: pointer;
  font-weight: var(--echo-weight-medium);
  white-space: nowrap;
}

.search-cancel:active {
  opacity: 0.7;
}

/* ===== 默认状态 ===== */
.search-default {
  padding: 20px 16px;
}

.search-section {
  margin-bottom: 24px;
}

.section-header {
  margin-bottom: 12px;
}

.section-title {
  font-size: var(--echo-text-lg);
  font-weight: var(--echo-weight-semibold);
  color: var(--echo-text);
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hot-tag {
  padding: 6px 16px;
  border-radius: var(--echo-radius-full);
  background: var(--echo-bg-card);
  font-size: var(--echo-text-sm);
  color: var(--echo-text-secondary);
  cursor: pointer;
  transition: all var(--echo-transition-fast);
  border: 1px solid var(--echo-border);
}

.hot-tag:active {
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  border-color: var(--echo-primary);
}

/* ===== 用户列表 ===== */
.user-list {
  display: flex;
  flex-direction: column;
}

.search-user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--echo-divider);
  cursor: pointer;
  transition: background var(--echo-transition-fast);
}

.search-user-item:active {
  background: var(--echo-bg);
}

.su-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: var(--echo-weight-bold);
  flex-shrink: 0;
}

.su-info {
  flex: 1;
}

.su-name {
  font-size: var(--echo-text-md);
  font-weight: var(--echo-weight-semibold);
  color: var(--echo-text);
}

.su-school {
  font-size: var(--echo-text-sm);
  color: var(--echo-text-hint);
  margin-top: 2px;
}

/* ===== 搜索结果 ===== */
.search-results {
  padding: 0;
}

.result-tabs {
  display: flex;
  background: var(--echo-white);
  border-bottom: 1px solid var(--echo-border);
}

.result-tab {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  font-size: var(--echo-text-base);
  color: var(--echo-text-secondary);
  cursor: pointer;
  position: relative;
  transition: all var(--echo-transition-fast);
}

.result-tab.active {
  color: var(--echo-primary);
  font-weight: var(--echo-weight-semibold);
}

.result-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  border-radius: 2px;
  background: var(--echo-primary);
}

.result-count {
  font-size: var(--echo-text-2xs);
  color: var(--echo-text-hint);
  margin-left: 2px;
}

.result-list {
  padding: 0 16px;
}

/* ===== 帖子搜索结果 ===== */
.search-post-item {
  padding: 14px 0;
  border-bottom: 1px solid var(--echo-divider);
  cursor: pointer;
  transition: background var(--echo-transition-fast);
}

.search-post-item:active {
  background: var(--echo-bg);
}

.sp-content {
  font-size: var(--echo-text-base);
  color: var(--echo-text);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 6px;
}

.sp-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: var(--echo-text-sm);
  color: var(--echo-text-hint);
}

.sp-stats {
  color: var(--echo-text-hint);
}

/* 搜索高亮 */
:deep(.highlight) {
  color: var(--echo-accent);
  font-weight: var(--echo-weight-semibold);
  font-style: normal;
  background: var(--echo-accent-light);
  padding: 0 2px;
  border-radius: 2px;
}

/* ===== 话题搜索结果 ===== */
.search-topic-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--echo-divider);
  cursor: pointer;
}

.st-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: var(--echo-weight-bold);
  flex-shrink: 0;
}

.st-name {
  font-size: var(--echo-text-md);
  font-weight: var(--echo-weight-semibold);
  color: var(--echo-text);
}

.st-count {
  font-size: var(--echo-text-sm);
  color: var(--echo-text-hint);
  margin-top: 2px;
}
</style>
