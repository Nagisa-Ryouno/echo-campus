<template>
  <div class="page-root">
    <!-- ═══════════════════════════════════════════ -->
    <!-- 固定层：position:fixed，绝对定位在手机屏幕顶部      -->
    <!-- ═══════════════════════════════════════════ -->
    <div class="fixed-header">
      <!-- 标题栏：随滚动隐藏，高度收缩为0 -->
      <div class="logo-header" :class="{ hidden: scrollTop > 10 }">
        <div class="discover-header-left">
          <h1 class="discover-title">发现</h1>
          <span class="trend-intro-btn" @click="showTrendIntro">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </span>
        </div>
        <div class="discover-search-btn" @click="$router.push('/search?from=discover')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      <!-- Tab大频道栏：永久固定在顶部 -->
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

      <div class="discover-container">
        
        <!-- ========================================== -->
        <!-- 1. 热点榜单区（除“圈子”大Tab外的所有大频道展示） -->
        <!-- ========================================== -->
        <div v-if="activeTab !== 'circle'" class="trend-section-card">
          <div class="section-title-row">
            <span class="section-title-icon">🔥</span>
            <span class="section-title-text">{{ currentTrendTitle }}</span>
          </div>

          <div class="trend-list">
            <div
              v-for="(item, idx) in currentTrends"
              :key="item.id"
              class="trend-item"
              @click="goTrendDetail(item.id)"
            >
              <!-- 排名数字 -->
              <div class="trend-rank" :class="{ 'trend-rank--top': idx < 3 }">
                {{ idx + 1 }}
              </div>
              <!-- 中间内容 -->
              <div class="trend-info">
                <div class="trend-item-title">{{ item.title }}</div>
                <div class="trend-item-desc" v-if="item.desc">{{ item.desc }}</div>
                <div class="trend-item-meta">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 2px; vertical-align: middle;">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span>{{ item.heat }} 讨论</span>
                </div>
              </div>
              <!-- 右侧气泡及跳转 -->
              <div class="trend-right">
                <span v-if="item.trend === 'hot'" class="trend-badge trend-badge--hot">爆</span>
                <span v-else-if="item.trend === 'up'" class="trend-badge trend-badge--up">↑</span>
                <span v-else-if="item.trend === 'new'" class="trend-badge trend-badge--new">新</span>
                <van-icon name="arrow" size="14" color="#c8c9cc" />
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- 2. 趋势专题区（微博/小红书话题聚合卡片，横向滑动） -->
        <!-- ========================================== -->
        <div class="topic-section-card">
          <div class="section-title-row">
            <span class="section-title-icon">✨</span>
            <span class="section-title-text">今日趋势专题</span>
          </div>
          <div class="topic-scroll-row">
            <div
              v-for="topic in mockTopics"
              :key="topic.id"
              class="topic-card"
              :style="{ background: topic.gradient }"
              @click="goTopicTag(topic.relatedTag)"
            >
              <div class="topic-card-icon">{{ topic.icon }}</div>
              <div class="topic-card-info">
                <div class="topic-card-name">#{{ topic.name }}</div>
                <div class="topic-card-desc">{{ topic.desc }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- 3. 圈子热度榜（在“圈子”大Tab或作为版块展示）     -->
        <!-- ========================================== -->
        <div class="circle-section-card" :class="{ 'circle-section-card--highlight': activeTab === 'circle' }">
          <div class="section-title-row">
            <span class="section-title-icon">👥</span>
            <span class="section-title-text">{{ activeTab === 'circle' ? '全站圈子热度总榜' : '热门圈子推荐' }}</span>
          </div>

          <div class="circle-rank-list">
            <div
              v-for="(circle, idx) in displayCircles"
              :key="circle.id"
              class="circle-rank-item"
              @click="goCircle(circle.id)"
            >
              <!-- 排名数字（在圈子Tab下显示） -->
              <div v-if="activeTab === 'circle'" class="circle-rank-num" :class="{ 'circle-rank-num--top': idx < 3 }">
                {{ idx + 1 }}
              </div>
              <div class="circle-rank-avatar" :style="{ background: circle.color }">
                {{ circle.icon }}
              </div>
              <div class="circle-rank-info">
                <div class="circle-rank-name">{{ circle.name }}</div>
                <div class="circle-rank-desc">{{ circle.description }}</div>
                <div class="circle-rank-meta">
                  <span>{{ circle.memberCount }} 成员</span>
                  <span class="dot">·</span>
                  <span>{{ circle.postCount }} 帖子</span>
                </div>
              </div>
              <div class="circle-rank-action">
                <span class="circle-active-badge">
                  <span class="active-dot"></span>
                  今日活跃
                </span>
                <van-icon name="arrow" size="14" color="#c8c9cc" />
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- 4. 猜你感兴趣（标签云形式，轻量化不占屏）          -->
        <!-- ========================================== -->
        <div class="interest-section-card">
          <div class="section-title-row">
            <span class="section-title-icon">💡</span>
            <span class="section-title-text">猜你想搜</span>
          </div>
          <div class="interest-tags">
            <span
              v-for="tag in mockInterestTags"
              :key="tag"
              class="interest-tag-pill"
              @click="goInterestSearch(tag)"
            >
              #{{ tag }}
            </span>
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
import { showDialog, showToast } from 'vant'
import { mockTrends, mockTopics, mockInterestTags } from '@/mock/trends.js'

const router = useRouter()
const store = useAppStore()

// ===== 滚动监听 =====
const scrollTop = ref(0)
const scrollRef = ref(null)

function handleScroll() {
  scrollTop.value = scrollRef.value?.scrollTop ?? 0
}

// ===== Tab 大频道 =====
const tabs = [
  { key: 'hot', label: '热门' },
  { key: 'newest', label: '最新' },
  { key: 'school', label: '本校' },
  { key: 'city', label: '同城' },
  { key: 'circle', label: '圈子' }
]

const activeTab = ref('hot')

function switchTab(key) {
  activeTab.value = key
}

// ===== 趋势列表过滤 =====
const currentTrends = computed(() => {
  return mockTrends.filter(t => t.category === activeTab.value)
})

const currentTrendTitle = computed(() => {
  const map = {
    hot: '实时热度排行榜',
    newest: '最新讨论上升榜',
    school: '本校专属讨论话题',
    city: '同城高校热议中心'
  }
  return map[activeTab.value] || '讨论排行榜'
})

// ===== 热门圈子推荐 =====
const displayCircles = computed(() => {
  // 从 store 中获取所有的圈子数据，按照成员数由大到小排序
  const sorted = [...store.circles].sort((a, b) => b.memberCount - a.memberCount)
  // 如果是圈子 Tab 展示 8 个，如果是其他 Tab 作为板块推荐展示 4 个
  return activeTab.value === 'circle' ? sorted.slice(0, 8) : sorted.slice(0, 4)
})

// ===== 交互跳转 =====
function goTrendDetail(trendId) {
  router.push(`/trend/${trendId}`)
}

function goTopicTag(tag) {
  // 携带 tag 参数跳转到搜索结果页或者大搜索页
  router.push(`/search?from=discover&keyword=${encodeURIComponent(tag)}`)
}

function goCircle(circleId) {
  router.push(`/circle/${circleId}`)
}

function goInterestSearch(tag) {
  router.push(`/search?from=discover&keyword=${encodeURIComponent(tag)}`)
}

function showTrendIntro() {
  showDialog({
    title: '关于发现·趋势榜单',
    message: '发现页榜单数据根据校声用户对相关话题的发帖数、互动量（赞/评/藏）以及热度上升趋势实时计算生成。分享校园热点，看见正在发生的校园生活。',
    confirmButtonText: '我知道了',
    teleport: '#phone-screen'
  })
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
  background: #f6f7f9; /* 柔和浅灰底色，与纯白卡片相得益彰 */
}

/* ═══════════════════════════════════════════ */
/* 固定层：position:fixed，不透明纯白背景，层级最高  */
/* ═══════════════════════════════════════════ */
.fixed-header {
  position: fixed;
  top: 48px;
  left: 50%;
  transform: translateX(-50%);
  width: 375px;
  z-index: 1000;
  background: var(--echo-white);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* ── 标题栏 ── */
.logo-header {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px 6px;
  box-sizing: border-box;
  transition: height 0.2s ease, padding 0.2s ease, opacity 0.2s ease;
  overflow: hidden;
  background: var(--echo-white);
}

.logo-header.hidden {
  height: 0;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
}

.discover-header-left {
  display: flex;
  align-items: center;
}

.discover-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--echo-text);
  letter-spacing: 0.5px;
  margin: 0;
}

.trend-intro-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--echo-text-secondary);
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}
.trend-intro-btn:active {
  color: var(--echo-primary);
}

.discover-search-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--echo-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.discover-search-btn:active {
  background: rgba(0, 0, 0, 0.05);
  transform: scale(0.92);
}

/* ── Tab 大频道栏 ── */
.channel-header {
  height: 48px;
  display: flex;
  background: var(--echo-white);
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
  font-weight: 700;
}

.discover-tab-bar {
  position: absolute;
  bottom: 4px;
  width: 20px;
  height: 3px;
  border-radius: 2px;
  background: var(--echo-primary);
}

/* ═══════════════════════════════════════════ */
/* 滚动层：独立滚动容器                            */
/* ═══════════════════════════════════════════ */
.scroll-content {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

.discover-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 12px 84px; /* 底部预留安全距离避开TabBar */
}

/* ===== 统一卡片容器基础样式 ===== */
.trend-section-card,
.topic-section-card,
.circle-section-card,
.interest-section-card {
  background: var(--echo-white);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.015);
  box-sizing: border-box;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
}

.section-title-icon {
  font-size: 15px;
}

.section-title-text {
  font-size: 14px;
  font-weight: 700;
  color: var(--echo-text);
}

/* ===== 1. 热点榜单区 ===== */
.trend-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trend-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 4px 0;
  border-radius: 8px;
}
.trend-item:active {
  opacity: 0.7;
}

.trend-rank {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  background: #eef0f3;
  color: #7f8c8d;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.trend-rank--top {
  background: linear-gradient(135deg, #ff6b35 0%, #e74c3c 100%);
  color: #ffffff;
}

.trend-info {
  flex: 1;
  min-width: 0;
}

.trend-item-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--echo-text);
  line-height: 1.4;
  margin-bottom: 2px;
  word-break: break-all;
}

.trend-item-desc {
  font-size: 12px;
  color: var(--echo-text-secondary);
  line-height: 1.5;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.trend-item-meta {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: var(--echo-text-hint);
}

.trend-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  align-self: center;
}

.trend-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 4px;
  line-height: 1.2;
}
.trend-badge--hot {
  background: #fff0f0;
  color: #e74c3c;
}
.trend-badge--up {
  background: #fbf5e6;
  color: #f39c12;
}
.trend-badge--new {
  background: #eafaf1;
  color: #2ecc71;
}

/* ===== 2. 趋势专题区 ===== */
.topic-scroll-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  padding-bottom: 4px;
}
.topic-scroll-row::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.topic-card {
  flex-shrink: 0;
  width: 146px;
  height: 80px;
  border-radius: 12px;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.15s;
}
.topic-card:active {
  transform: scale(0.96);
}

.topic-card-icon {
  font-size: 18px;
  background: rgba(255, 255, 255, 0.4);
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.topic-card-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.topic-card-name {
  font-size: 12px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 1px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.topic-card-desc {
  font-size: 10px;
  color: rgba(26, 26, 46, 0.65);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* ===== 3. 圈子推荐与榜单 ===== */
.circle-rank-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.circle-rank-item {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 4px 0;
}
.circle-rank-item:active {
  opacity: 0.75;
}

.circle-rank-num {
  width: 18px;
  font-size: 12px;
  font-weight: 700;
  color: var(--echo-text-hint);
  text-align: center;
  flex-shrink: 0;
}
.circle-rank-num--top {
  color: #ff6b35;
  font-size: 14px;
}

.circle-rank-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}

.circle-rank-info {
  flex: 1;
  min-width: 0;
}

.circle-rank-name {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--echo-text);
  margin-bottom: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.circle-rank-desc {
  font-size: 11px;
  color: var(--echo-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.circle-rank-meta {
  font-size: 10px;
  color: var(--echo-text-hint);
  display: flex;
  align-items: center;
  gap: 4px;
}

.circle-rank-action {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.circle-active-badge {
  font-size: 10px;
  color: #2ecc71;
  background: #eafaf1;
  padding: 2px 6px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-weight: 500;
}

.active-dot {
  width: 5px;
  height: 5px;
  background: #2ecc71;
  border-radius: 50%;
}

.circle-section-card--highlight {
  border: 1.5px solid rgba(76, 175, 125, 0.12);
  box-shadow: 0 4px 16px rgba(76, 175, 125, 0.04);
}

/* ===== 4. 猜你想搜 ===== */
.interest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.interest-tag-pill {
  font-size: 11.5px;
  color: var(--echo-text-secondary);
  background: #f1f2f5;
  padding: 5px 12px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.interest-tag-pill:active {
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  transform: scale(0.95);
}
</style>
