<template>
  <div class="search-page">
    <!-- 紧凑定点块：搜索栏 + 结果 Tab / 频道联动选项 -->
    <div class="search-sticky-wrap" :class="{ 'is-scrolled': isScrolled }">
      <div class="search-header">
        <div class="search-input-wrap">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            ref="inputRef"
            v-model="keyword"
            type="text"
            class="search-input"
            :placeholder="isMessageSearch ? '搜索联系人、圈子、聊天记录' : '搜索用户、帖子、话题'"
            @keyup.enter="handleEnterSearch"
            @input="onInput"
          />
          <span v-if="keyword" class="search-clear" @click="clearSearch">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </span>
        </div>
        <span class="search-cancel" @click="$router.back()">取消</span>
      </div>

      <!-- 首页搜索频道联动过滤器 (仅当搜索有结果且来自首页时显示) -->
      <div v-if="results && fromSource === 'home' && channelName" class="search-filter-row">
        <span class="filter-title">搜索范围：</span>
        <div 
          class="filter-pill" 
          :class="{ active: searchScope === 'channel' }" 
          @click="setSearchScope('channel')"
        >
          当前频道 ({{ channelName }})
        </div>
        <div 
          class="filter-pill" 
          :class="{ active: searchScope === 'all' }" 
          @click="setSearchScope('all')"
        >
          全站
        </div>
      </div>

      <!-- 结果 Tab（仅在搜索后有结果时显示） -->
      <div v-if="results" class="result-tabs">
        <div
          v-for="tab in currentTabs"
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

    <!-- 默认引导页：未搜索状态 -->
    <div v-if="!keyword && !results" class="search-default">

      <!-- 非消息搜索：猜你想搜 + 近期浏览（仅首页） + 搜索历史 -->
      <template v-if="!isMessageSearch">
        
        <!-- 💡 猜你想搜 -->
        <div class="search-section">
          <div class="section-header">
            <span class="section-title">💡 猜你想搜</span>
            <span class="section-action-btn" @click="toggleGuessVisible">
              <van-icon :name="isGuessVisible ? 'eye-o' : 'closed-eye'" size="16" />
            </span>
          </div>
          <transition name="fade-collapse">
            <div v-if="isGuessVisible" class="hot-tags">
              <span v-for="t in dynamicGuessKeywords" :key="t" class="hot-tag" @click="selectTagSearch(t)">{{ t }}</span>
            </div>
            <div v-else class="collapsed-tip">推荐话题已隐藏</div>
          </transition>
        </div>



        <!-- 🕒 搜索历史 -->
        <div class="search-section">
          <div class="section-header">
            <span class="section-title">🕒 搜索历史</span>
            <div class="section-actions">
              <span v-if="searchHistory.length > 0" class="section-action-btn delete-btn" @click="clearHistory">
                <van-icon name="delete-o" size="16" />
              </span>
              <span class="section-action-btn" @click="toggleHistoryVisible">
                <van-icon :name="isHistoryVisible ? 'eye-o' : 'closed-eye'" size="16" />
              </span>
            </div>
          </div>
          <transition name="fade-collapse">
            <div v-if="isHistoryVisible">
              <div v-if="searchHistory.length === 0" class="empty-history">暂无搜索历史</div>
              <div v-else class="history-tags">
                <span v-for="(h, idx) in searchHistory" :key="idx" class="history-tag" @click="selectTagSearch(h)">
                  {{ h }}
                  <span class="tag-delete-cross" @click.stop="deleteHistoryItem(idx)">×</span>
                </span>
              </div>
            </div>
            <div v-else class="collapsed-tip">搜索历史已隐藏</div>
          </transition>
        </div>
      </template>

      <!-- 消息搜索：最近聊天列表 -->
      <template v-else>
        <div class="search-section">
          <div class="section-header">
            <span class="section-title">💬 最近聊天</span>
          </div>
          <div class="recent-chat-list">
            <div
              v-for="chat in recentChats"
              :key="chat.id"
              class="recent-chat-item"
              @click="onRecentChatClick(chat)"
            >
              <div class="rc-avatar" :style="{ background: chat.isGroup ? (chat.avatarColor || '#4caf7d') : (store.getUserById(chat.userId)?.avatarColor || '#999') }">
                {{ chat.isGroup ? (chat.name?.charAt(0) || '圈') : (store.getUserById(chat.userId)?.nickname?.charAt(0) || '?') }}
              </div>
              <div class="rc-info">
                <div class="rc-name">
                  {{ chat.isGroup ? chat.name : (store.getUserById(chat.userId)?.nickname || '未知用户') }}
                  <span v-if="chat.unread > 0" class="rc-unread">{{ chat.unread > 99 ? '99+' : chat.unread }}</span>
                </div>
                <div class="rc-last-msg">{{ chat.lastMsg || '暂无消息' }}</div>
              </div>
              <div class="rc-time">{{ chat.lastTime }}</div>
            </div>
          </div>
        </div>
      </template>
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

      <!-- 话题结果（仅全局搜索） -->
      <div v-if="!isMessageSearch && activeResultTab === 'topics'" class="result-list">
        <div v-if="filteredTopics.length === 0" class="echo-empty">
          <div class="echo-empty-icon">🏷️</div>
          <p class="echo-empty-text">未找到相关话题</p>
        </div>
        <div
          v-for="t in filteredTopics"
          :key="t.name"
          class="search-topic-item"
          @click="selectTagSearch(t.name)"
        >
          <div class="st-icon">#</div>
          <div class="st-info">
            <div class="st-name">{{ t.name }}</div>
            <div class="st-count">{{ t.count }} 篇帖子</div>
          </div>
        </div>
      </div>

      <!-- 联系人结果（消息搜索） -->
      <div v-if="isMessageSearch && activeResultTab === 'contacts'" class="result-list">
        <div v-if="msgContacts.length === 0" class="echo-empty">
          <div class="echo-empty-icon">👤</div>
          <p class="echo-empty-text">未找到相关联系人</p>
        </div>
        <div
          v-for="u in msgContacts"
          :key="u.id"
          class="search-user-item"
          @click="$router.push(`/profile/${u.id}`)"
        >
          <div class="su-avatar" :style="{ background: u.avatarColor }">
            <span v-html="highlightMatch(u.nickname.slice(0,1))"></span>
          </div>
          <div class="su-info">
            <div class="su-name" v-html="highlightMatch(u.nickname)"></div>
            <div class="su-school">{{ u.school }}</div>
          </div>
        </div>
      </div>

      <!-- 圈子结果（消息搜索） -->
      <div v-if="isMessageSearch && activeResultTab === 'circles'" class="result-list">
        <div v-if="msgCircles.length === 0" class="echo-empty">
          <div class="echo-empty-icon">🔵</div>
          <p class="echo-empty-text">未找到相关圈子</p>
        </div>
        <div
          v-for="c in msgCircles"
          :key="c.id"
          class="search-user-item"
          @click="onCircleClick(c)"
        >
          <div class="su-avatar" :style="{ background: c.avatarColor || '#4caf7d' }">
            {{ c.name?.charAt(0) || '圈' }}
          </div>
          <div class="su-info">
            <div class="su-name" v-html="highlightMatch(c.name)"></div>
            <div class="su-school">{{ c.memberCount || 0 }} 名成员</div>
          </div>
        </div>
      </div>

      <!-- 聊天记录结果（消息搜索） -->
      <div v-if="isMessageSearch && activeResultTab === 'chatRecords'" class="result-list">
        <div v-if="msgChatRecords.length === 0" class="echo-empty">
          <div class="echo-empty-icon">💬</div>
          <p class="echo-empty-text">未找到相关聊天记录</p>
        </div>
        <div
          v-for="c in msgChatRecords"
          :key="c.id"
          class="search-post-item"
          @click="onChatRecordClick(c)"
        >
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
            <div class="su-avatar" :style="{ background: c.isGroup ? (c.avatarColor || '#999') : (store.getUserById(c.userId)?.avatarColor || '#ccc') }" style="width:36px;height:36px;font-size:14px;">
              {{ c.isGroup ? c.name?.charAt(0) : (store.getUserById(c.userId)?.nickname?.charAt(0) || '?') }}
            </div>
            <span style="font-size:14px;font-weight:500;color:var(--echo-text);">
              {{ c.isGroup ? c.name : (store.getUserById(c.userId)?.nickname || '未知') }}
            </span>
          </div>
          <p class="sp-content" v-html="highlightMatch(c.lastMsg)"></p>
          <div class="sp-meta">
            <span>{{ c.lastTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { useScrollCollapse } from '@/composables/useScrollCollapse.js'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()
const store = useAppStore()

const { isScrolled } = useScrollCollapse(0)

const keyword = ref('')
const results = ref(null)
const activeResultTab = ref('posts')
const inputRef = ref(null)

// 区分搜索来源与大频道
const fromSource = computed(() => route.query.from || '')
const activeChannelKey = computed(() => route.query.channel || '')

const channelName = computed(() => {
  const map = {
    meet: '遇见',
    follow: '关注',
    recommend: '推荐',
    city: '同城',
    school: '我的学校'
  }
  return map[activeChannelKey.value] || ''
})

// 频道联动过滤（仅首页搜索支持）
const searchScope = ref('channel') // 'channel' | 'all'
function setSearchScope(scope) {
  searchScope.value = scope
}

// 隐藏与折叠状态（使用 localStorage 进行状态持久化）
const isGuessVisible = ref(localStorage.getItem('echo_guess_search_visible') !== 'false')
const isHistoryVisible = ref(localStorage.getItem('echo_history_search_visible') !== 'false')

function toggleGuessVisible() {
  isGuessVisible.value = !isGuessVisible.value
  localStorage.setItem('echo_guess_search_visible', String(isGuessVisible.value))
}

function toggleHistoryVisible() {
  isHistoryVisible.value = !isHistoryVisible.value
  localStorage.setItem('echo_history_search_visible', String(isHistoryVisible.value))
}

// 搜索历史记录列表
const searchHistory = ref([])

onMounted(() => {
  const saved = localStorage.getItem('echo_search_history')
  if (saved) {
    try {
      searchHistory.value = JSON.parse(saved)
    } catch (_) {
      searchHistory.value = []
    }
  }
  inputRef.value?.focus()
})

function saveHistory() {
  localStorage.setItem('echo_search_history', JSON.stringify(searchHistory.value))
}

function deleteHistoryItem(index) {
  searchHistory.value.splice(index, 1)
  saveHistory()
}

function clearHistory() {
  searchHistory.value = []
  saveHistory()
}

function handleEnterSearch() {
  doSearch(keyword.value)
}

function selectTagSearch(tagText) {
  keyword.value = tagText
  doSearch(tagText)
}

// 消息搜索模式检测
const isMessageSearch = computed(() => route.query.from === 'message')

const defaultTabs = [
  { key: 'posts', label: '帖子' },
  { key: 'users', label: '用户' },
  { key: 'topics', label: '话题' }
]

const messageTabs = [
  { key: 'contacts', label: '联系人' },
  { key: 'circles', label: '圈子' },
  { key: 'chatRecords', label: '聊天记录' }
]

const currentTabs = computed(() => isMessageSearch.value ? messageTabs : defaultTabs)

// 动态“猜你想搜”词条池
const dynamicGuessKeywords = computed(() => {
  if (fromSource.value === 'home') {
    if (activeChannelKey.value === 'school') {
      return ['二手闲置', '学习干货', '失物招领', '表白墙', '校园活动', '选课攻略', '社团招新']
    } else if (activeChannelKey.value === 'city') {
      return ['同城搭子', '美食探店', '周末去哪儿', '自习室', '租房合租', '同城演出', '周末爬山']
    } else if (activeChannelKey.value === 'recommend') {
      return ['摄影约拍', '高分电影', '宝藏音乐', '新番动漫', '好物安利', '穿搭日常', '读书打卡']
    } else if (activeChannelKey.value === 'follow' || activeChannelKey.value === 'meet') {
      return ['同频交友', '声望达人', '社恐日常', '匿名树洞', '配对挑战', '恋爱物语']
    }
  }
  // 发现页或默认全平台热搜
  return ['考研党', '期末复习', '四六级', '校园穿搭', '失物招领', '实习招募', '食堂测评', '宿舍日常']
})

const recommendUsers = computed(() =>
  store.users.filter(u => u.id !== 'u1').slice(0, 5)
)

// ===== 搜索结果与联动过滤逻辑 =====
const filteredPosts = computed(() => {
  if (!keyword.value) return []
  const kw = keyword.value.toLowerCase()
  let list = store.posts.filter(p => p.visibility === 'public')
  
  // 首页搜索联动规则
  if (fromSource.value === 'home' && searchScope.value === 'channel' && activeChannelKey.value) {
    const ch = activeChannelKey.value
    if (ch === 'school') {
      // 搜本校或 school 频道的贴子
      list = list.filter(p => p.channel === 'school' || p.schoolOnly === true)
    } else if (ch === 'city') {
      list = list.filter(p => p.channel === 'city')
    } else if (ch === 'recommend') {
      list = list.filter(p => p.channel === 'recommend')
    } else if (ch === 'follow') {
      // 仅搜索关注者发布的帖子
      list = list.filter(p => store.isFollowing(p.authorId))
    }
  }
  
  return list
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

// ===== 消息搜索专用结果 =====
const msgContacts = computed(() => {
  if (!isMessageSearch.value || !keyword.value) return []
  const kw = keyword.value.toLowerCase()
  return store.users.filter(u =>
    u.nickname.toLowerCase().includes(kw) ||
    (u.school || '').toLowerCase().includes(kw)
  ).slice(0, 20)
})

const msgCircles = computed(() => {
  if (!isMessageSearch.value || !keyword.value) return []
  const kw = keyword.value.toLowerCase()
  return store.chatListData.filter(c =>
    c.isGroup && (c.name || '').toLowerCase().includes(kw)
  ).slice(0, 20)
})

const msgChatRecords = computed(() => {
  if (!isMessageSearch.value || !keyword.value) return []
  const kw = keyword.value.toLowerCase()
  return store.chatListData.filter(c =>
    (c.lastMsg || '').toLowerCase().includes(kw)
  ).slice(0, 20)
})

const recentChats = computed(() => {
  const list = [...store.chatListData]
  const parseTime = (t) => {
    if (!t) return 0
    if (t.includes(':')) {
      const [h, m] = t.split(':').map(Number)
      return h * 60 + m
    }
    if (t.includes('分钟前') || t.includes('小时前')) return Date.now()
    return 0
  }
  return list.sort((a, b) => {
    if ((b.unread || 0) !== (a.unread || 0)) {
      return (b.unread || 0) - (a.unread || 0)
    }
    return parseTime(b.lastTime) - parseTime(a.lastTime)
  }).slice(0, 20)
})

function getResultCount(key) {
  if (key === 'posts') return filteredPosts.value.length
  if (key === 'users') return filteredUsers.value.length
  if (key === 'topics') return filteredTopics.value.length
  if (key === 'contacts') return msgContacts.value.length
  if (key === 'circles') return msgCircles.value.length
  if (key === 'chatRecords') return msgChatRecords.value.length
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
  if (!keyword.value.trim()) {
    results.value = null
  }
}

// 统一执行搜索逻辑
function doSearch(kw) {
  const text = (kw || '').trim()
  if (!text) return
  
  keyword.value = text
  results.value = true

  // 保存搜索历史（去重置顶，最多 10 条）
  searchHistory.value = [text, ...searchHistory.value.filter(h => h !== text)].slice(0, 10)
  saveHistory()

  if (isMessageSearch.value) {
    activeResultTab.value = 'contacts'
  } else {
    activeResultTab.value = 'posts'
  }
}

function clearSearch() {
  keyword.value = ''
  results.value = null
}

function onCircleClick(circle) {
  store.markChatRead(circle.id)
}

function onChatRecordClick(chat) {
  store.markChatRead(chat.id)
}

function onRecentChatClick(chat) {
  store.markChatRead(chat.id)
}
</script>

<style scoped>
.search-page {
  min-height: 100%;
  background: var(--echo-bg);
  display: flex;
  flex-direction: column;
}

/* ===== 紧凑定点粘性栏 ===== */
.search-sticky-wrap {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--echo-white);
  max-width: 375px;
  box-sizing: border-box;
  transition: all 0.25s ease;
}

.search-sticky-wrap.is-scrolled {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: saturate(180%) blur(16px);
  -webkit-backdrop-filter: saturate(180%) blur(16px);
  box-shadow:
    0 1px 0 var(--echo-border),
    0 6px 20px rgba(0, 0, 0, 0.07);
}

/* ===== 搜索头部 ===== */
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
  display: flex;
  align-items: center;
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

/* ===== 联动过滤 Pills 行 ===== */
.search-filter-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 14px 10px;
  background: var(--echo-white);
}

.filter-title {
  font-size: 11px;
  color: var(--echo-text-hint);
}

.filter-pill {
  padding: 4px 10px;
  border-radius: 12px;
  background: var(--echo-bg);
  color: var(--echo-text-secondary);
  font-size: 11px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.filter-pill.active {
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  border-color: var(--echo-primary);
  font-weight: 600;
}

/* ===== 默认引导页 ===== */
.search-default {
  padding: 16px 14px;
}

.search-section {
  background: var(--echo-white);
  border-radius: var(--echo-radius);
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: var(--echo-shadow-xs);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: var(--echo-weight-bold);
  color: var(--echo-text);
  letter-spacing: 0.3px;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-action-btn {
  color: var(--echo-text-hint);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.section-action-btn:active {
  color: var(--echo-text-secondary);
}

.delete-btn {
  color: var(--echo-text-hint);
}

.delete-btn:active {
  color: var(--echo-danger);
}

/* ── 标签布局 ── */
.hot-tags, .history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hot-tag {
  padding: 5px 12px;
  border-radius: 14px;
  background: var(--echo-bg-input);
  font-size: 12px;
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

.history-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 12px;
  border-radius: 14px;
  background: var(--echo-bg);
  font-size: 12px;
  color: var(--echo-text-secondary);
  cursor: pointer;
  border: 1px solid var(--echo-border);
  transition: all var(--echo-transition-fast);
}

.history-tag:active {
  background: var(--echo-bg-hover);
}

.tag-delete-cross {
  font-size: 14px;
  color: var(--echo-text-hint);
  font-weight: 300;
  padding: 0 2px;
  line-height: 1;
}

.tag-delete-cross:active {
  color: var(--echo-danger);
}

.empty-history, .collapsed-tip {
  font-size: 12px;
  color: var(--echo-text-hint);
  padding: 4px 0;
}

.collapsed-tip {
  color: var(--echo-text-placeholder);
  font-style: italic;
}

/* ── 近期浏览（首页专享） ── */
.browse-history-list {
  display: flex;
  flex-direction: column;
}

.browse-history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--echo-divider);
  cursor: pointer;
}

.browse-history-item:last-child {
  border-bottom: none;
}

.browse-title {
  font-size: 12px;
  color: var(--echo-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
}

.browse-time {
  font-size: 10px;
  color: var(--echo-text-hint);
}

/* ===== 列表及结果 Tab ===== */
.result-tabs {
  display: flex;
  background: var(--echo-white);
  border-bottom: 1px solid var(--echo-border);
}

.result-tab {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  font-size: 13px;
  color: var(--echo-text-secondary);
  cursor: pointer;
  position: relative;
  transition: all var(--echo-transition-fast);
}

.result-tab.active {
  color: var(--echo-primary);
  font-weight: var(--echo-weight-bold);
}

.result-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2.5px;
  border-radius: 1px;
  background: var(--echo-primary);
}

.result-count {
  font-size: 10px;
  color: var(--echo-text-hint);
  margin-left: 2px;
}

.result-list {
  padding: 0 16px;
  background: var(--echo-white);
  flex: 1;
}

/* ===== 搜索结果卡片 ===== */
.search-user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--echo-divider);
  cursor: pointer;
}

.su-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  font-weight: var(--echo-weight-bold);
  flex-shrink: 0;
}

.su-info {
  flex: 1;
  min-width: 0;
}

.su-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--echo-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.su-school {
  font-size: 11px;
  color: var(--echo-text-hint);
  margin-top: 2px;
}

.search-post-item {
  padding: 14px 0;
  border-bottom: 1px solid var(--echo-divider);
  cursor: pointer;
}

.sp-content {
  font-size: 13.5px;
  color: var(--echo-text);
  line-height: 1.5;
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
  font-size: 11px;
  color: var(--echo-text-hint);
}

.sp-author {
  font-weight: 500;
}

.search-topic-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--echo-divider);
  cursor: pointer;
}

.st-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}

.st-name {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--echo-text);
}

.st-count {
  font-size: 11px;
  color: var(--echo-text-hint);
  margin-top: 2px;
}

/* ===== 消息搜索专属 ===== */
.recent-chat-list {
  display: flex;
  flex-direction: column;
}

.recent-chat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--echo-divider);
  cursor: pointer;
}

.rc-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  font-weight: var(--echo-weight-bold);
  flex-shrink: 0;
}

.rc-info {
  flex: 1;
  min-width: 0;
}

.rc-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--echo-text);
  display: flex;
  align-items: center;
  gap: 6px;
}

.rc-unread {
  background: var(--echo-danger);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  flex-shrink: 0;
}

.rc-last-msg {
  font-size: 12px;
  color: var(--echo-text-hint);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rc-time {
  font-size: 11px;
  color: var(--echo-text-hint);
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 2px;
}

.search-results {
  background: var(--echo-white);
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 高亮样式 */
:deep(.highlight) {
  color: var(--echo-accent);
  font-weight: 600;
  font-style: normal;
  background: var(--echo-accent-light);
  padding: 0 1px;
  border-radius: 2px;
}

/* 折叠过渡动画 */
.fade-collapse-enter-active, .fade-collapse-leave-active {
  transition: all 0.25s ease;
  max-height: 200px;
  overflow: hidden;
}

.fade-collapse-enter-from, .fade-collapse-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
