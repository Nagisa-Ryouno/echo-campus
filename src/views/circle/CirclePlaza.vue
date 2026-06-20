<template>
  <div class="plaza-page">
    <!-- 顶部状态栏占位 & 返回导航 -->
    <div class="plaza-header">
      <div class="nav-back" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </div>
      <h2 class="plaza-title">圈子广场</h2>
      <div style="width: 32px;"></div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar-wrap">
      <div class="search-input-box">
        <van-icon name="search" size="16" color="var(--echo-text-hint)" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索圈号/圈名"
          class="search-input"
        />
        <van-icon
          v-if="searchQuery"
          name="clear"
          size="16"
          color="var(--echo-text-hint)"
          @click="searchQuery = ''"
        />
      </div>
    </div>

    <!-- 标签横滚栏 & 筛选按钮 -->
    <div class="tab-filter-bar">
      <div class="tab-scroll-wrap">
        <div
          v-for="cat in categories"
          :key="cat"
          class="tab-item"
          :class="{ active: activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </div>
      </div>
      <div class="filter-toggle-btn" :class="{ 'is-active': filterVisible }" @click="toggleFilter">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
        </svg>
        <span class="filter-btn-text">筛选</span>
      </div>
    </div>

    <!-- 毛玻璃筛选下拉面板 -->
    <transition name="fade-slide">
      <div v-if="filterVisible" class="filter-overlay" @click.self="closeFilter">
        <div class="filter-panel">
          <div class="filter-scroll">
            <!-- 按城市筛选 -->
            <div class="filter-section">
              <h4 class="filter-section-title">城市</h4>
              <div class="filter-options-grid">
                <button
                  v-for="opt in cityOptions"
                  :key="opt.value"
                  class="filter-opt-btn"
                  :class="{ active: tempFilters.city === opt.value }"
                  @click="tempFilters.city = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <!-- 按学校筛选 -->
            <div class="filter-section">
              <h4 class="filter-section-title">学校</h4>
              <div class="filter-options-grid">
                <button
                  v-for="opt in schoolOptions"
                  :key="opt.value"
                  class="filter-opt-btn"
                  :class="{ active: tempFilters.school === opt.value }"
                  @click="tempFilters.school = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <!-- 按人数筛选 -->
            <div class="filter-section">
              <h4 class="filter-section-title">成员人数</h4>
              <div class="filter-options-grid">
                <button
                  v-for="opt in rangeOptions"
                  :key="opt.value"
                  class="filter-opt-btn"
                  :class="{ active: tempFilters.memberRange === opt.value }"
                  @click="tempFilters.memberRange = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <!-- 是否官方 -->
            <div class="filter-section">
              <h4 class="filter-section-title">圈子类型</h4>
              <div class="filter-options-grid">
                <button
                  v-for="opt in officialOptions"
                  :key="opt.value"
                  class="filter-opt-btn"
                  :class="{ active: tempFilters.official === opt.value }"
                  @click="tempFilters.official = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <!-- 是否匿名 -->
            <div class="filter-section">
              <h4 class="filter-section-title">匿名设置</h4>
              <div class="filter-options-grid">
                <button
                  v-for="opt in anonOptions"
                  :key="opt.value"
                  class="filter-opt-btn"
                  :class="{ active: tempFilters.isAnon === opt.value }"
                  @click="tempFilters.isAnon = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- 筛选底栏操作 -->
          <div class="filter-actions">
            <button class="btn-reset" @click="resetFilters">重置</button>
            <button class="btn-submit" @click="applyFilters">确定</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 圈子列表 -->
    <div class="circle-list-container">
      <div v-if="filteredCircles.length > 0" class="circles-plaza-list">
        <div
          v-for="circle in filteredCircles"
          :key="circle.id"
          class="plaza-circle-card"
          @click="goCircleDetail(circle.id)"
        >
          <!-- 头像 -->
          <div class="circle-avatar-box" :style="{ background: circle.color }">
            <span class="avatar-icon">{{ circle.icon }}</span>
          </div>

          <!-- 内容 -->
          <div class="circle-card-content">
            <div class="circle-name-line">
              <span class="circle-name-text">{{ circle.name }}</span>
              <span v-if="circle.official" class="badge-official">官方</span>
              <span v-if="circle.isAnon" class="badge-anon">匿名</span>
            </div>

            <!-- 药丸小标签 -->
            <div class="circle-pills-row">
              <span class="pill-item">👥 {{ circle.memberCount }}/{{ circle.maxMemberCount }}</span>
              <span v-if="circle.memberCount > 100" class="pill-item text-highlight">00后多</span>
              <span class="pill-item">{{ circle.category === '推荐' ? '火爆' : circle.category }}</span>
              <span class="pill-item">{{ getBuiltTimeText(circle.createdAt) }}</span>
            </div>

            <p class="circle-intro-text van-ellipsis">{{ circle.description }}</p>
            <div v-if="circle.memberStats?.recentActiveText" class="circle-hot-indicator">
              💬 {{ circle.memberStats.recentActiveText.replace('最近有', '').replace('人发言', '人正在热聊') }}
            </div>
          </div>

          <!-- 右侧动作 -->
          <div class="circle-card-action">
            <button
              v-if="!circle.joined"
              class="join-btn-plaza"
              @click.stop="joinCircle(circle.id)"
            >
              加入
            </button>
            <span v-else class="joined-label-plaza">已加入</span>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="plaza-empty">
        <van-icon name="warning-o" size="48" color="var(--echo-text-hint)" />
        <p class="empty-title">没有找到匹配的圈子</p>
        <p class="empty-desc">尝试换个搜索词或清除筛选条件吧</p>
        <button class="clear-filter-btn" @click="clearAllSearch">清除所有条件</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { showToast } from 'vant'

const router = useRouter()
const store = useAppStore()

onMounted(() => { store.lockPhoneScroll() })
onBeforeUnmount(() => { store.unlockPhoneScroll() })

const searchQuery = ref('')
const activeCategory = ref('推荐')

const categories = ['推荐', '游戏', '动漫', '学习', '音乐', '影视', '运动']

// 筛选面板显示
const filterVisible = ref(false)

// 筛选条件状态
const filters = reactive({
  city: 'all',
  school: 'all',
  memberRange: 'all',
  official: 'all',
  isAnon: 'all'
})

// 临时筛选条件（用于点击确定前保存临时修改）
const tempFilters = reactive({
  city: 'all',
  school: 'all',
  memberRange: 'all',
  official: 'all',
  isAnon: 'all'
})

// 筛选选项
const cityOptions = [
  { label: '全部', value: 'all' },
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '广州', value: '广州' },
  { label: '深圳', value: '深圳' }
]

const schoolOptions = [
  { label: '全部', value: 'all' },
  { label: '中央民族大学', value: '中央民族大学' },
  { label: '北京大学', value: '北京大学' },
  { label: '清华大学', value: '清华大学' },
  { label: '复旦大学', value: '复旦大学' }
]

const rangeOptions = [
  { label: '全部', value: 'all' },
  { label: '100人以下', value: 'under100' },
  { label: '100-500人', value: '100to500' },
  { label: '500人以上', value: 'over500' }
]

const officialOptions = [
  { label: '全部', value: 'all' },
  { label: '官方圈子', value: 'official' },
  { label: '普通圈子', value: 'normal' }
]

const anonOptions = [
  { label: '全部', value: 'all' },
  { label: '匿名圈', value: 'anon' },
  { label: '实名圈', value: 'normal' }
]

// 过滤后的圈子列表
const filteredCircles = computed(() => {
  return store.circles.filter(circle => {
    // 1. 搜索条件
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      const matchName = circle.name.toLowerCase().includes(q)
      const matchNumber = circle.number.includes(q)
      if (!matchName && !matchNumber) return false
    }

    // 2. 兴趣分类标签切换
    if (activeCategory.value !== '推荐') {
      if (circle.category !== activeCategory.value) return false
    }

    // 3. 筛选面板过滤条件
    if (filters.city !== 'all' && circle.city !== filters.city) return false
    if (filters.school !== 'all' && circle.school !== filters.school) return false
    if (filters.official !== 'all') {
      const isOfficial = filters.official === 'official'
      if (circle.official !== isOfficial) return false
    }
    if (filters.isAnon !== 'all') {
      const isAnon = filters.isAnon === 'anon'
      if (circle.isAnon !== isAnon) return false
    }
    if (filters.memberRange !== 'all') {
      const count = circle.memberCount
      if (filters.memberRange === 'under100' && count >= 100) return false
      if (filters.memberRange === '100to500' && (count < 100 || count > 500)) return false
      if (filters.memberRange === 'over500' && count <= 500) return false
    }

    return true
  })
})

function toggleFilter() {
  if (!filterVisible.value) {
    // 打开时，同步临时条件
    Object.assign(tempFilters, filters)
  }
  filterVisible.value = !filterVisible.value
}

function closeFilter() {
  filterVisible.value = false
}

function applyFilters() {
  Object.assign(filters, tempFilters)
  closeFilter()
  showToast('筛选已应用')
}

function resetFilters() {
  tempFilters.city = 'all'
  tempFilters.school = 'all'
  tempFilters.memberRange = 'all'
  tempFilters.official = 'all'
  tempFilters.isAnon = 'all'
}

function clearAllSearch() {
  searchQuery.value = ''
  activeCategory.value = '推荐'
  resetFilters()
  applyFilters()
}

// 模拟计算建圈时间（QQ风格）
function getBuiltTimeText(dateStr) {
  if (!dateStr) return '新建立'
  const year = parseInt(dateStr.split('/')[0])
  const diff = 2026 - year
  if (diff <= 0) {
    return '建圈数月'
  }
  return `建圈${diff}年`
}

function joinCircle(circleId) {
  const success = store.joinCircle(circleId)
  if (success) {
    showToast({
      message: '加圈申请已发送，已自动同意加入！',
      icon: 'success'
    })
  }
}

function goCircleDetail(circleId) {
  router.push(`/circle/${circleId}`)
}
</script>

<style scoped>
.plaza-page {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: var(--echo-bg);
  overflow: hidden;
}

/* 导航栏 */
.plaza-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: var(--echo-white);
  flex-shrink: 0;
}
.nav-back {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--echo-text);
}
.nav-back:active {
  background: var(--echo-bg);
}
.plaza-title {
  font-size: var(--echo-text-lg);
  font-weight: var(--echo-weight-bold);
  color: var(--echo-text);
}

/* 搜索栏 */
.search-bar-wrap {
  padding: 8px 16px;
  background: var(--echo-white);
  flex-shrink: 0;
}
.search-input-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--echo-bg);
  border-radius: 20px;
}
.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--echo-text);
  outline: none;
}

/* 滚动栏 & 筛选 */
.tab-filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--echo-white);
  border-bottom: 1px solid var(--echo-border);
  padding: 0 16px;
  height: 40px;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}
.tab-scroll-wrap {
  display: flex;
  align-items: center;
  gap: 20px;
  overflow-x: auto;
  flex: 1;
  height: 100%;
  margin-right: 12px;
}
.tab-scroll-wrap::-webkit-scrollbar {
  display: none;
}
.tab-item {
  font-size: 13px;
  color: var(--echo-text-secondary);
  cursor: pointer;
  padding: 10px 0;
  position: relative;
  flex-shrink: 0;
  transition: all var(--echo-transition-fast);
}
.tab-item.active {
  color: var(--echo-primary);
  font-weight: var(--echo-weight-semibold);
}
.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2.5px;
  background: var(--echo-primary);
  border-radius: 2px;
}

.filter-toggle-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: var(--echo-text-secondary);
  font-size: 13px;
  flex-shrink: 0;
  transition: color var(--echo-transition-fast);
}
.filter-toggle-btn.is-active,
.filter-toggle-btn:active {
  color: var(--echo-primary);
}
.filter-btn-text {
  font-weight: 500;
}

/* 筛选下拉层 */
.filter-overlay {
  position: absolute;
  top: 96px; /* 导航+搜索(96px) 下方挂载 */
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 99;
  display: flex;
  flex-direction: column;
}
.filter-panel {
  width: 100%;
  max-height: 75%;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}
.filter-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.filter-section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--echo-text-hint);
  text-transform: uppercase;
}
.filter-options-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.filter-opt-btn {
  background: var(--echo-bg);
  border: 1px solid transparent;
  color: var(--echo-text-secondary);
  border-radius: 8px;
  padding: 6px 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all var(--echo-transition-fast);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.filter-opt-btn.active {
  background: rgba(76, 175, 125, 0.1);
  border-color: var(--echo-primary);
  color: var(--echo-primary);
  font-weight: 500;
}
.filter-actions {
  display: flex;
  padding: 12px 16px;
  background: var(--echo-white);
  border-top: 1px solid var(--echo-border);
  gap: 12px;
}
.btn-reset {
  flex: 1;
  background: var(--echo-bg);
  border: none;
  color: var(--echo-text-secondary);
  padding: 10px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
}
.btn-submit {
  flex: 2;
  background: var(--echo-primary);
  border: none;
  color: #fff;
  padding: 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

/* 圈子列表 */
.circle-list-container {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}
.circles-plaza-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.plaza-circle-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 12px;
  background: var(--echo-white);
  border-radius: var(--echo-radius-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  cursor: pointer;
  transition: transform var(--echo-transition-fast);
}
.plaza-circle-card:active {
  transform: scale(0.985);
}

.circle-avatar-box {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
.avatar-icon {
  font-size: 24px;
}

.circle-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.circle-name-line {
  display: flex;
  align-items: center;
  gap: 6px;
}
.circle-name-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--echo-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.badge-official {
  background: #e8f5ee;
  color: var(--echo-primary);
  font-size: 9px;
  padding: 1px 4px;
  border-radius: 4px;
  font-weight: 600;
  flex-shrink: 0;
}
.badge-anon {
  background: #e3f2fd;
  color: #1e88e5;
  font-size: 9px;
  padding: 1px 4px;
  border-radius: 4px;
  font-weight: 600;
  flex-shrink: 0;
}

.circle-pills-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.pill-item {
  font-size: 10px;
  color: var(--echo-text-hint);
  background: var(--echo-bg);
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 500;
}
.pill-item.text-highlight {
  color: #e67e22;
  background: rgba(230, 126, 34, 0.08);
}

.circle-intro-text {
  font-size: 11px;
  color: var(--echo-text-secondary);
  margin-top: 2px;
}
.circle-hot-indicator {
  font-size: 10px;
  color: var(--echo-primary);
  font-weight: 500;
  margin-top: 1px;
}

.circle-card-action {
  flex-shrink: 0;
}
.join-btn-plaza {
  background: #fff;
  border: 1px solid var(--echo-primary);
  color: var(--echo-primary);
  font-size: 12px;
  font-weight: 600;
  border-radius: 14px;
  padding: 4px 12px;
  cursor: pointer;
  transition: all var(--echo-transition-fast);
}
.join-btn-plaza:active {
  background: var(--echo-primary);
  color: #fff;
}
.joined-label-plaza {
  font-size: 12px;
  color: var(--echo-text-hint);
}

/* 空状态 */
.plaza-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}
.empty-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--echo-text);
  margin-top: 12px;
}
.empty-desc {
  font-size: 12px;
  color: var(--echo-text-secondary);
  margin-top: 4px;
}
.clear-filter-btn {
  margin-top: 16px;
  background: var(--echo-primary);
  border: none;
  color: #fff;
  font-size: 12px;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
}

/* 动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease-out;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
