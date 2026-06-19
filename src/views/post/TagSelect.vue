<template>
  <div class="tag-select-page">
    <!-- 顶部导航 -->
    <div class="select-header">
      <span class="select-back" @click="onBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </span>
      <span class="select-title">选择标签</span>
      <span class="select-count">{{ selectedCategory ? 1 : 0 }}/1 分类 · {{ selectedTopics.length }} 话题</span>
    </div>

    <!-- 分类标签 -->
    <div class="select-section">
      <div class="select-section-title">分类标签 <span class="select-hint">（必选 1 个，决定帖子归属频道）</span></div>
      <div class="select-tag-grid">
        <span
          v-for="tag in allCategoryTags"
          :key="'c-' + tag"
          class="select-tag"
          :class="{ 'select-tag--active': selectedCategory === tag }"
          @click="selectCategory(tag)"
        >{{ tag }}</span>
      </div>
    </div>

    <!-- 话题标签 -->
    <div class="select-section">
      <div class="select-section-title">话题标签 <span class="select-hint">（可选，最多 5 个）</span></div>
      <div class="select-tag-grid">
        <span
          v-for="tag in topicTagOptions"
          :key="'t-' + tag"
          class="select-tag select-tag--small"
          :class="{ 'select-tag--active': selectedTopics.includes(tag) }"
          @click="toggleTopic(tag)"
        >#{{ tag }}</span>
      </div>
    </div>

    <!-- 底部确认按钮 -->
    <div class="select-footer">
      <button
        class="select-confirm"
        :class="{ 'select-confirm--disabled': !selectedCategory }"
        :disabled="!selectedCategory"
        @click="onConfirm"
      >确认</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { allCategoryTags, topicTags } from '@/mock/posts.js'

const router = useRouter()
const route = useRoute()

const selectedCategory = ref('')
const selectedTopics = ref([])
const topicTagOptions = topicTags

// 初始化：从路由参数读取已选标签
onMounted(() => {
  const cat = route.query.categoryTag
  const topics = route.query.topicTags
  if (cat) selectedCategory.value = cat
  if (topics) {
    selectedTopics.value = decodeURIComponent(topics).split(',').filter(Boolean)
  }
})

function selectCategory(tag) {
  selectedCategory.value = tag
}

function toggleTopic(tag) {
  const idx = selectedTopics.value.indexOf(tag)
  if (idx >= 0) {
    selectedTopics.value.splice(idx, 1)
  } else {
    if (selectedTopics.value.length < 5) {
      selectedTopics.value.push(tag)
    }
  }
}

function onConfirm() {
  if (!selectedCategory.value) return
  // 通过 router.replace + query 参数回传
  router.replace({
    path: '/post/create',
    query: {
      categoryTag: selectedCategory.value,
      topicTags: selectedTopics.value.join(',')
    }
  })
}

function onBack() {
  // 返回发帖页，保留已有 query（若有）
  router.back()
}
</script>

<style scoped>
.tag-select-page {
  min-height: 100%;
  background: var(--echo-bg);
  padding-bottom: 80px;
}

/* 顶部 */
.select-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--echo-white);
  position: sticky;
  top: 0;
  z-index: 10;
}

.select-back {
  color: var(--echo-text);
  cursor: pointer;
  display: flex;
  align-items: center;
}

.select-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--echo-text);
}

.select-count {
  font-size: 12px;
  color: var(--echo-text-hint);
}

/* 区块 */
.select-section {
  background: var(--echo-white);
  margin-bottom: 8px;
  padding: 14px 16px;
}

.select-section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--echo-text);
  margin-bottom: 10px;
}

.select-hint {
  font-size: 12px;
  font-weight: 400;
  color: var(--echo-text-hint);
}

/* 标签网格 */
.select-tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.select-tag {
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 13px;
  background: var(--echo-bg);
  color: var(--echo-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.select-tag--small {
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 14px;
}

.select-tag--active {
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  font-weight: 600;
}

/* 底部确认 */
.select-footer {
  position: fixed;
  bottom: 32px;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 375px;
  background: var(--echo-white);
  padding: 12px 16px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  box-shadow: 0 -2px 8px rgba(0,0,0,0.06);
  z-index: 100;
  box-sizing: border-box;
}

.select-confirm {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  border: none;
  background: var(--echo-primary);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.select-confirm:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.select-confirm--disabled {
  background: var(--echo-border);
  color: var(--echo-text-hint);
  cursor: not-allowed;
}
</style>
