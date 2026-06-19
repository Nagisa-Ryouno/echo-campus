<template>
  <div class="profile-search-page">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="search-input-wrap">
        <van-icon name="search" size="16" color="#999" class="search-icon" />
        <input
          ref="inputRef"
          v-model="keyword"
          class="search-input"
          :placeholder="placeholderText"
          @input="onSearch"
        />
        <van-icon
          v-if="keyword"
          name="clear"
          size="16"
          color="#c0c4cc"
          class="clear-icon"
          @click="onClear"
        />
      </div>
      <span class="cancel-btn" @click="$router.back()">取消</span>
    </div>

    <!-- 搜索结果 -->
    <div class="search-results" v-if="keyword">
      <template v-if="results.length">
        <div
          v-for="item in results"
          :key="item.id"
          class="result-item"
          @click="$router.push(`/post/${item.id}`)"
        >
          <div class="result-img" v-if="item.images?.[0]">
            <img :src="item.images[0]" alt="" />
          </div>
          <div class="result-body">
            <div class="result-text" v-html="highlight(item.content)"></div>
            <div class="result-meta">
              <span class="result-tag">{{ item.categoryTag }}</span>
              <span class="result-counts">
                <van-icon name="like-o" size="11" />{{ item.likeCount }}
                <van-icon name="chat-o" size="11" />{{ item.commentCount }}
              </span>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="search-empty">
        <van-icon name="search" size="40" color="#dcdfe6" />
        <p>未找到相关内容</p>
      </div>
    </div>

    <!-- 提示：未输入时 -->
    <div class="search-hint" v-else>
      <van-icon name="search" size="48" color="#dcdfe6" />
      <p>{{ isOwnProfile ? '可搜索你的帖子、评论、收藏等全部内容' : '仅可搜索 ta 的帖子' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app.js'

const route = useRoute()
const store = useAppStore()

const keyword = ref('')
const inputRef = ref(null)
const results = ref([])

const from = computed(() => route.query.from || 'me')
const targetUid = computed(() => route.query.uid || '')
const isOwnProfile = computed(() => from.value === 'self')

const placeholderText = computed(() => {
  if (isOwnProfile.value) return '搜索我的帖子、评论、收藏等'
  return '搜索 ta 的帖子'
})

// 获取可搜索的数据源
const searchableItems = computed(() => {
  if (isOwnProfile.value) {
    // 自己：帖子 + 评论过的帖子 + 收藏的帖子 + 赞过的帖子（去重）
    const uid = store.currentUser?.id
    if (!uid) return []
    const ownPosts = store.posts.filter(p => p.authorId === uid)
    const commentedIds = new Set(store.getUserCommentedPosts(uid).map(p => p.id))
    const collectedIds = new Set(store.getUserCollectedPosts().map(p => p.id))
    const likedIds = new Set(store.getUserLikedPosts().map(p => p.id))

    const allIds = new Set([...ownPosts.map(p => p.id), ...commentedIds, ...collectedIds, ...likedIds])
    return store.posts.filter(p => allIds.has(p.id))
  } else {
    // 他人：仅帖子（公开、非匿名）
    const uid = targetUid.value
    if (!uid) return []
    return store.posts.filter(p =>
      p.authorId === uid &&
      p.visibility !== 'private' &&
      !p.isAnon
    )
  }
})

function onSearch() {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) {
    results.value = []
    return
  }
  results.value = searchableItems.value.filter(item =>
    item.content.toLowerCase().includes(kw) ||
    (item.categoryTag && item.categoryTag.toLowerCase().includes(kw))
  )
}

function onClear() {
  keyword.value = ''
  results.value = []
  nextTick(() => inputRef.value?.focus())
}

function highlight(text) {
  if (!keyword.value) return text
  const kw = keyword.value.trim()
  if (!kw) return text
  const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  return text.replace(regex, '<em class="hl">$1</em>')
}

onMounted(() => {
  nextTick(() => inputRef.value?.focus())
})
</script>

<style scoped>
.profile-search-page {
  min-height: 100%;
  background: var(--echo-bg);
}

/* ===== 搜索栏 ===== */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--echo-white);
  position: sticky;
  top: 0;
  z-index: 100;
}
.search-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--echo-bg);
  border-radius: 20px;
  padding: 8px 14px;
}
.search-icon {
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: var(--echo-text);
}
.search-input::placeholder {
  color: #c0c4cc;
  font-size: 13px;
}
.clear-icon {
  flex-shrink: 0;
  cursor: pointer;
  padding: 2px;
}
.cancel-btn {
  font-size: 14px;
  color: var(--echo-text-secondary);
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  padding: 4px 0;
}
.cancel-btn:active { opacity: 0.6; }

/* ===== 搜索结果 ===== */
.search-results {
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.result-item {
  background: var(--echo-white);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: all 0.15s;
}
.result-item:active { transform: scale(0.985); }
.result-img {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  overflow: hidden;
}
.result-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.result-body {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}
.result-text {
  font-size: 13px;
  color: var(--echo-text);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.result-text :deep(.hl) {
  color: var(--echo-accent);
  font-style: normal;
  font-weight: 600;
}
.result-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}
.result-tag {
  font-size: 11px;
  color: var(--echo-primary);
  background: var(--echo-primary-light);
  padding: 2px 8px;
  border-radius: 8px;
}
.result-counts {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--echo-text-hint);
}

/* ===== 空状态 / 提示 ===== */
.search-empty,
.search-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0 0;
  color: var(--echo-text-hint);
  font-size: 13px;
  gap: 8px;
}
</style>
