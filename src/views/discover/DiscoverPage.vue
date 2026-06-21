<template>
  <div class="page-root">
    <!-- ═══════════════════════════════════════════ -->
    <!-- 滚动层：独立 overflow-y:auto                  -->
    <!-- ═══════════════════════════════════════════ -->
    <div ref="scrollRef" class="scroll-content">
      
      <!-- 统一的粘性顶部包装层：z-index: 120 -->
      <div class="discover-header-wrapper">
        <!-- 趋势搜索栏 -->
        <div class="trend-search-bar-wrap" @click="goSearchPage">
          <div class="trend-search-bar-inner">
            <span class="search-bar-left">
              <van-icon name="search" size="15" class="search-bar-icon" />
              <div class="search-word-carousel">
                <transition name="search-word-fade" mode="out-in">
                  <span :key="currentWord" class="search-word-text">大家都在搜：{{ currentWord }}</span>
                </transition>
              </div>
            </span>
            <span class="search-bar-heat-icon">🔥</span>
          </div>
        </div>

        <!-- Tab大频道栏 -->
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

        <!-- "更多" 子小频道标签流 -->
        <transition name="drawer-fade">
          <div v-if="activeTab === 'more'" class="sub-channel-menu">
            <span
              v-for="sub in subChannels"
              :key="sub.key"
              class="sub-channel-tag"
              :class="{ 'sub-channel-tag--active': activeSmallChannel === sub.key }"
              @click="switchSmallChannel(sub.key)"
            >
              {{ sub.label }}
            </span>
          </div>
        </transition>
      </div>

      <!-- 切屏微移与淡入淡出动效 -->
      <transition name="fade-slide" mode="out-in">
        <div :key="activeTab + '_' + activeSmallChannel" class="discover-container">
          
          <!-- 1. 「我的」频道 -->
          <div v-if="activeTab === 'mine'">
            <div class="channel-description">根据你的浏览、点赞与圈子行为推荐</div>
            
            <div class="hot-trend-section">
              <div class="section-sub-title">猜你喜欢</div>
              <div class="trend-list-density">
                <div
                  v-for="(item, idx) in mineLikes"
                  :key="item.id"
                  class="trend-item-density"
                  @click="goTrendDetail(item.id)"
                >
                  <!-- 排名 -->
                  <div class="trend-rank" :class="'rank-' + (idx + 1)">{{ idx + 1 }}</div>
                  
                  <!-- 话题名与简述 -->
                  <div class="trend-main-info">
                    <div class="trend-title-row">
                      <span class="trend-title">{{ item.title }}</span>
                      <span v-if="item.trend === 'hot'" class="status-badge status-badge--hot">爆</span>
                      <span v-else-if="item.trend === 'up'" class="status-badge status-badge--up">热</span>
                      <span v-else-if="item.trend === 'new'" class="status-badge status-badge--new">新</span>
                    </div>
                    <div class="trend-desc" v-if="item.desc">{{ item.desc }}</div>
                  </div>
                  
                  <!-- 热度 -->
                  <div class="trend-heat">{{ item.heat }}</div>
                </div>
              </div>
            </div>

            <!-- 最近浏览 -->
            <div class="hot-trend-section recent-section">
              <div class="section-sub-title">最近浏览</div>
              <div class="trend-list-density recent-list">
                <div
                  v-for="item in recentViews"
                  :key="item.id"
                  class="trend-item-density recent-item"
                  @click="goTrendDetail(item.id)"
                >
                  <span class="recent-dot"></span>
                  <span class="recent-title">{{ item.title }}</span>
                  <span class="recent-desc" v-if="item.desc">- {{ item.desc }}</span>
                  <span class="recent-heat">{{ item.heat }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 「热门」频道 -->
          <div v-else-if="activeTab === 'hot'">
            <div class="channel-description">当前全平台实时讨论热度最高的话题</div>
            
            <div class="hot-trend-section">
              <div class="section-sub-title">实时热榜</div>
              <div class="trend-list-density">
                <div
                  v-for="(item, idx) in hotTrends"
                  :key="item.id"
                  class="trend-item-density"
                  @click="goTrendDetail(item.id)"
                >
                  <!-- 排名 -->
                  <div class="trend-rank" :class="'rank-' + (idx + 1)">{{ idx + 1 }}</div>
                  
                  <!-- 话题名与简述 -->
                  <div class="trend-main-info">
                    <div class="trend-title-row">
                      <span class="trend-title">{{ item.title }}</span>
                      <span v-if="item.trend === 'hot'" class="status-badge status-badge--hot">爆</span>
                      <span v-else-if="item.trend === 'up'" class="status-badge status-badge--up">热</span>
                      <span v-else-if="item.trend === 'new'" class="status-badge status-badge--new">新</span>
                    </div>
                    <div class="trend-desc" v-if="item.desc">{{ item.desc }}</div>
                  </div>
                  
                  <!-- 热度 -->
                  <div class="trend-heat">{{ item.heat }}</div>
                </div>
              </div>
            </div>

            <!-- 实时上升 -->
            <div class="hot-trend-section rising-section">
              <div class="section-sub-title">实时上升</div>
              <div class="trend-list-density">
                <div
                  v-for="(item, idx) in risingTrends"
                  :key="item.id"
                  class="trend-item-density"
                  @click="goTrendDetail(item.id)"
                >
                  <div class="trend-rank rank-rising">↑</div>
                  <div class="trend-main-info">
                    <div class="trend-title-row">
                      <span class="trend-title">{{ item.title }}</span>
                      <span class="status-badge status-badge--new">新</span>
                    </div>
                    <div class="trend-desc" v-if="item.desc">{{ item.desc }}</div>
                  </div>
                  <div class="trend-heat">{{ item.heat }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. 「同城」频道 -->
          <div v-else-if="activeTab === 'city'">
            <div class="channel-description">你所在城市高校圈正在讨论的话题</div>
            <div class="trend-list-density">
              <div
                v-for="(item, idx) in cityTrends"
                :key="item.id"
                class="trend-item-density"
                @click="goTrendDetail(item.id)"
              >
                <!-- 排名 -->
                <div class="trend-rank" :class="'rank-' + (idx + 1)">{{ idx + 1 }}</div>
                
                <!-- 话题名与简述 -->
                <div class="trend-main-info">
                  <div class="trend-title-row">
                    <span class="trend-title">{{ item.title }}</span>
                    <span v-if="item.trend === 'hot'" class="status-badge status-badge--hot">爆</span>
                    <span v-else-if="item.trend === 'up'" class="status-badge status-badge--up">热</span>
                    <span v-else-if="item.trend === 'new'" class="status-badge status-badge--new">新</span>
                  </div>
                  <div class="trend-desc" v-if="item.desc">{{ item.desc }}</div>
                </div>
                
                <!-- 热度 -->
                <div class="trend-heat">{{ item.heat }}</div>
              </div>
            </div>
          </div>

          <!-- 4. 「本校」频道 -->
          <div v-else-if="activeTab === 'school'">
            <div class="channel-description">来自你所在学校的实时讨论，最有校园感</div>
            <div class="trend-list-density">
              <div
                v-for="(item, idx) in schoolTrends"
                :key="item.id"
                class="trend-item-density"
                @click="goTrendDetail(item.id)"
              >
                <!-- 排名 -->
                <div class="trend-rank" :class="'rank-' + (idx + 1)">{{ idx + 1 }}</div>
                
                <!-- 话题名与简述 -->
                <div class="trend-main-info">
                  <div class="trend-title-row">
                    <span class="trend-title">{{ item.title }}</span>
                    <span v-if="item.trend === 'hot'" class="status-badge status-badge--hot">爆</span>
                    <span v-else-if="item.trend === 'up'" class="status-badge status-badge--up">热</span>
                    <span v-else-if="item.trend === 'new'" class="status-badge status-badge--new">新</span>
                  </div>
                  <div class="trend-desc" v-if="item.desc">{{ item.desc }}</div>
                </div>
                
                <!-- 热度 -->
                <div class="trend-heat">{{ item.heat }}</div>
              </div>
            </div>
          </div>

          <!-- 5. 「更多」频道：切换小标签获取对应的话题榜 -->
          <div v-else-if="activeTab === 'more'">
            <div class="channel-description">
              分类话题中心：{{ currentSubChannelLabel }}话题榜
            </div>
            
            <div class="trend-list-density" v-if="moreChannelTrends.length">
              <div
                v-for="(item, idx) in moreChannelTrends"
                :key="item.id"
                class="trend-item-density"
                @click="goTrendDetail(item.id)"
              >
                <!-- 排名 -->
                <div class="trend-rank" :class="'rank-' + (idx + 1)">{{ idx + 1 }}</div>
                
                <!-- 话题内容 -->
                <div class="trend-main-info">
                  <div class="trend-title-row">
                    <span class="trend-title">{{ item.title }}</span>
                    <span v-if="item.trend === 'hot'" class="status-badge status-badge--hot">爆</span>
                    <span v-else-if="item.trend === 'up'" class="status-badge status-badge--up">热</span>
                    <span v-else-if="item.trend === 'new'" class="status-badge status-badge--new">新</span>
                  </div>
                  <div class="trend-desc" v-if="item.desc">{{ item.desc }}</div>
                </div>
                
                <!-- 热度 -->
                <div class="trend-heat">{{ item.heat }}</div>
              </div>
            </div>
            <div v-else class="list-empty">
              该频道暂无讨论话题，点击上方标签切换看看吧
            </div>
          </div>

        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { mockTrends } from '@/mock/trends.js'

const router = useRouter()

// ===== 趋势搜索词轮播 =====
const hotSearchWords = [
  '期末周',
  '考研复试',
  '四六级',
  'Labubu',
  '毕业旅行',
  '校园歌手大赛'
]

const currentIndex = ref(0)
const currentWord = computed(() => hotSearchWords[currentIndex.value])

let searchTimer = null

onMounted(() => {
  searchTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % hotSearchWords.length
  }, 4000) // 4秒切换一次
})

onBeforeUnmount(() => {
  if (searchTimer) {
    clearInterval(searchTimer)
  }
})

function goSearchPage() {
  router.push('/search')
}

// ===== Tab大频道 =====
const tabs = [
  { key: 'mine', label: '推荐' },
  { key: 'hot', label: '热门' },
  { key: 'city', label: '同城' },
  { key: 'school', label: '本校' },
  { key: 'more', label: '更多' }
]

const activeTab = ref('hot')

// ===== 更多子小频道 =====
const subChannels = [
  { key: 'photography', label: '摄影' },
  { key: 'anime', label: '动漫' },
  { key: 'music', label: '音乐' },
  { key: 'gaming', label: '游戏' },
  { key: 'ootd', label: '穿搭' },
  { key: 'postgrad', label: '考研' },
  { key: 'gossip', label: '吃瓜' },
  { key: 'lost_found', label: '失物招领' },
  { key: 'wall', label: '校园墙' },
  { key: 'second_hand', label: '二手' }
]

const activeSmallChannel = ref('photography')

const currentSubChannelLabel = computed(() => {
  const ch = subChannels.find(c => c.key === activeSmallChannel.value)
  return ch ? ch.label : ''
})

function switchTab(key) {
  activeTab.value = key
  if (key === 'more') {
    activeSmallChannel.value = 'photography'
  }
}

function switchSmallChannel(key) {
  activeSmallChannel.value = key
}

// ===== 各大频道数据源过滤 =====

// 我的 - 猜你喜欢 (10条)
const mineLikes = computed(() => {
  return mockTrends.filter(t => t.category === 'mine').slice(0, 10)
})

// 我的 - 最近浏览 (3条)
const recentViews = computed(() => {
  return mockTrends.filter(t => t.category === 'hot').slice(4, 7)
})

// 热门 - 实时热榜 (10条)
const hotTrends = computed(() => {
  return mockTrends.filter(t => t.category === 'hot').slice(0, 10)
})

// 热门 - 实时上升 (3条)
const risingTrends = computed(() => {
  return mockTrends.filter(t => t.category === 'school').slice(3, 6)
})

// 同城
const cityTrends = computed(() => {
  return mockTrends.filter(t => t.category === 'city')
})

// 本校
const schoolTrends = computed(() => {
  return mockTrends.filter(t => t.category === 'school')
})

// 更多 - 对应小频道的话题榜
const moreChannelTrends = computed(() => {
  return mockTrends.filter(t => t.category === activeSmallChannel.value)
})

// ===== 页面跳转 =====
function goTrendDetail(trendId) {
  router.push(`/trend/${trendId}`)
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
  background: var(--echo-white);
}

/* ═══════════════════════════════════════════ */
/* 粘性顶部包裹容器：集成搜索栏与大Tab             */
/* ═══════════════════════════════════════════ */
.discover-header-wrapper {
  position: sticky;
  top: 0;
  z-index: 120;
  background: rgba(244, 249, 246, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--echo-border);
  box-sizing: border-box;
}

/* 趋势搜索栏 */
.trend-search-bar-wrap {
  padding: 10px 16px 6px;
  cursor: pointer;
  box-sizing: border-box;
}

.trend-search-bar-inner {
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(76, 175, 125, 0.15);
  border-radius: 17px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.trend-search-bar-wrap:active .trend-search-bar-inner {
  background: rgba(255, 255, 255, 0.85);
  transform: scale(0.98);
}

.search-bar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.search-bar-icon {
  color: var(--echo-primary);
  flex-shrink: 0;
}

.search-word-carousel {
  flex: 1;
  min-width: 0;
  height: 20px;
  line-height: 20px;
  overflow: hidden;
}

.search-word-text {
  font-size: 13px;
  color: var(--echo-text-secondary);
  font-weight: 500;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-bar-heat-icon {
  font-size: 14px;
  animation: heat-pulse 1.5s infinite ease-in-out;
  flex-shrink: 0;
}

@keyframes heat-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.18);
    opacity: 1;
    text-shadow: 0 0 4px rgba(255, 94, 0, 0.3);
  }
}

/* 轮播词淡入淡出动画 */
.search-word-fade-enter-active,
.search-word-fade-leave-active {
  transition: all 0.3s ease;
}

.search-word-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.search-word-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 大频道栏样式 */
.channel-header {
  height: 48px;
  display: flex;
  background: transparent;
}

.discover-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  font-size: 13.5px;
  color: var(--echo-text-secondary);
  font-weight: 500;
  transition: all 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.discover-tab--active {
  color: var(--echo-text);
  font-weight: 700;
}

.discover-tab-bar {
  position: absolute;
  bottom: 0;
  width: 22px;
  height: 3px;
  border-radius: 2px;
  background: var(--echo-primary);
}

/* 小频道菜单流：大Tab下方展开，flex-wrap 样式 */
.sub-channel-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 16px;
  background: transparent;
  border-top: 1px solid rgba(0, 0, 0, 0.03);
  box-sizing: border-box;
}

.sub-channel-tag {
  font-size: 11px;
  color: var(--echo-text-secondary);
  background: var(--echo-bg);
  padding: 5px 11px;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  transition: all 0.15s ease;
}

.sub-channel-tag--active {
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  font-weight: 600;
}

/* ═══════════════════════════════════════════ */
/* 滚动层：独立高密度滚动列表                        */
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
  padding-bottom: 84px; /* 底部预留安全距离避开TabBar */
}

/* 频道顶部背景小说明 */
.channel-description {
  padding: 10px 16px;
  font-size: 11px;
  color: var(--echo-text-hint);
  background: var(--echo-bg);
  font-weight: 500;
}

.hot-trend-section {
  display: flex;
  flex-direction: column;
}

.section-sub-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--echo-text-secondary);
  padding: 12px 16px 6px;
  background: var(--echo-white);
}

/* 微博热搜式高密度列表 */
.trend-list-density {
  display: flex;
  flex-direction: column;
  background: var(--echo-white);
}

.trend-item-density {
  display: flex;
  align-items: center;
  padding: 11px 16px;
  border-bottom: 1px solid var(--echo-border);
  background: var(--echo-white);
  cursor: pointer;
  transition: background-color 0.1s ease;
  box-sizing: border-box;
}

.trend-item-density:active {
  background-color: rgba(0, 0, 0, 0.02);
}

/* 排名视觉样式 */
.trend-rank {
  width: 28px;
  font-size: 14px;
  font-weight: 850;
  color: var(--echo-text-hint);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
}

.rank-1 { color: #ff3b30; } /* 微博橙红 */
.rank-2 { color: #ff9500; } /* 微博橙 */
.rank-3 { color: #ffcc00; } /* 微博黄 */

.rank-rising {
  color: #34c759;
  font-size: 13px;
  font-weight: 700;
}

/* 内容板块 */
.trend-main-info {
  flex: 1;
  min-width: 0;
  padding-right: 12px;
}

.trend-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.trend-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--echo-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 状态标签新/热/爆 */
.status-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 1px 3px;
  border-radius: 3px;
  line-height: 1.1;
  flex-shrink: 0;
}

.status-badge--hot {
  background: #fff0f0;
  color: #ff3b30;
}

.status-badge--up {
  background: #fbf5e6;
  color: #ff9500;
}

.status-badge--new {
  background: #eafaf1;
  color: #34c759;
}

.trend-desc {
  font-size: 11.5px;
  color: var(--echo-text-secondary);
  margin-top: 2.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trend-heat {
  font-size: 11px;
  color: var(--echo-text-hint);
  font-weight: 500;
  flex-shrink: 0;
  text-align: right;
  min-width: 40px;
}

/* 最近浏览版块样式（更轻量级） */
.recent-section {
  margin-top: 16px;
  border-top: 5px solid var(--echo-bg);
}

.recent-list {
  padding-top: 2px;
}

.recent-item {
  display: flex;
  align-items: center;
  padding: 9px 16px;
  border-bottom: 1px solid var(--echo-border);
  font-size: 12.5px;
  color: var(--echo-text-secondary);
  cursor: pointer;
  box-sizing: border-box;
}

.recent-dot {
  width: 5px;
  height: 5px;
  background: var(--echo-text-hint);
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
}

.recent-title {
  font-weight: 550;
  color: var(--echo-text-secondary);
  margin-right: 6px;
  white-space: nowrap;
}

.recent-desc {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--echo-text-hint);
  font-size: 11.5px;
}

.recent-heat {
  font-size: 11px;
  color: var(--echo-text-hint);
  margin-left: 8px;
  flex-shrink: 0;
}

/* 实时上升版块 */
.rising-section {
  margin-top: 16px;
  border-top: 5px solid var(--echo-bg);
}

/* 更多空状态 */
.list-empty {
  padding: 48px 16px;
  text-align: center;
  color: var(--echo-text-hint);
  font-size: 13.5px;
  background: var(--echo-white);
}

/* 更多小标签展开淡入淡出 */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Tab 切换微移横滑淡入淡出过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
