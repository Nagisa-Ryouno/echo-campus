<template>
  <div class="page-root">
    <!-- ═══════════════════════════════════════════ -->
    <!-- 固定层：包括 Logo、一级大频道、二级筛选与排序   -->
    <!-- ═══════════════════════════════════════════ -->
    <div class="fixed-header-wrapper" ref="headerRef">
      <!-- 1. Logo 区：滚动后隐藏 -->
      <div class="logo-header" :class="{ hidden: scrollTop > 10 }">
        <h1 class="home-title">校声</h1>
        <div class="home-search" @click="$router.push(`/search?from=home`)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
      </div>

      <!-- 2. 一级大频道：永久固定常驻 -->
      <div class="channel-header">
        <div
          v-for="ch in channelList"
          :key="ch.key"
          class="channel-tab"
          :class="{ 'channel-tab--active': activeChannel === ch.key }"
          @click="onChannelSwitch(ch.key)"
        >
          <span class="channel-tab-text">
            {{ ch.label }}
            <span v-if="ch.key === 'city' && activeChannel === 'city'" class="city-name-badge">
              ({{ activeCity }})
            </span>
          </span>
          <span v-if="activeChannel === ch.key" class="channel-tab-bar"></span>
        </div>
      </div>

      <!-- 3. 二级排序栏+筛选工具栏：常驻，遇见和关注频道下不展示 -->
      <div class="filter-sort-bar" v-if="activeChannel !== 'meet' && activeChannel !== 'follow'">
        <!-- 左侧：最新/最热 二选一 -->
        <div class="sort-options">
          <span
            class="sort-btn"
            :class="{ 'sort-btn--active': sortMode === 'hot' }"
            @click="sortMode = 'hot'"
          >热门</span>
          <span
            class="sort-btn"
            :class="{ 'sort-btn--active': sortMode === 'latest' }"
            @click="sortMode = 'latest'"
          >最新</span>
        </div>

        <!-- 右侧：筛选按钮，带有小向下箭头 -->
        <div class="filter-actions">
          <div
            class="filter-dropdown-btn"
            :class="{ 'filter-dropdown-btn--active': selectedTags.length > 0 }"
            @click="openTagDrawer"
          >
            <span>{{ selectedTags.length > 0 ? (selectedTags.length === 1 ? selectedTags[0] : `标签(${selectedTags.length})`) : '标签选择' }}</span>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>

          <div
            class="filter-dropdown-btn"
            :class="{ 'filter-dropdown-btn--active': selectedTime !== 'all' }"
            @click="openTimeSheet"
          >
            <span>{{ timeLabelMap[selectedTime] || '时间筛选' }}</span>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- 4. 筛选状态汇总条：非默认状态下显示，支持一键清除 -->
      <div class="filter-status-banner" v-if="activeChannel !== 'meet' && activeChannel !== 'follow' && (selectedTags.length > 0 || selectedTime !== 'all')">
        <div class="status-tags">
          <span class="status-tag-item">{{ channelLabelMap[activeChannel] }}</span>
          <span class="status-tag-item">{{ sortMode === 'hot' ? '热门' : '最新' }}</span>
          <span class="status-tag-item" v-for="tag in selectedTags" :key="tag">{{ tag }}</span>
          <span class="status-tag-item" v-if="selectedTime !== 'all'">{{ timeLabelMap[selectedTime] }}</span>
        </div>
        <div class="status-reset-btn" @click="resetFilters">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          <span>清除</span>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- 滚动层：高度由 padding-top 动态计算自适应     -->
    <!-- ═══════════════════════════════════════════ -->
    <div
      ref="scrollRef"
      class="scroll-content"
      :style="{ paddingTop: headerHeight + 'px' }"
      @scroll="handleScroll"
    >
      <div class="post-list">
        <!-- A. 遇见频道：用户推荐卡片 -->
        <div v-if="activeChannel === 'meet'" class="meet-users">
          <div class="section-title">
            <span>可能感兴趣的人</span>
            <span class="section-title-hint">基于你的兴趣推荐</span>
          </div>
          <div class="meet-user-grid">
            <div
              v-for="user in meetUsers"
              :key="user.id"
              class="meet-user-card"
              @click="$router.push(`/profile/${user.id}`)"
            >
              <div class="meet-user-avatar" :style="{ background: user.avatarColor }">
                {{ user.nickname.slice(0, 1) }}
              </div>
              <div class="meet-user-name">{{ user.nickname }}</div>
              <div class="meet-user-school">{{ user.school }}</div>
              <div class="meet-user-tags">
                <span v-for="t in user.tags.slice(0, 2)" :key="t" class="meet-user-tag">{{ t }}</span>
              </div>
              <div class="meet-user-stats">
                <span>{{ user.postCount }} 帖</span>
                <span class="meet-user-divider">·</span>
                <span>{{ user.fanCount }} 粉丝</span>
              </div>
            </div>
          </div>
        </div>

        <!-- B. 其他频道：多维筛选后的帖子流 -->
        <div v-else class="post-feed">
          <!-- 关注频道 ➔ 已关注用户头像横滑 -->
          <div v-if="activeChannel === 'follow'" class="follow-avatars-bar">
            <div class="follow-avatars-scroll">
              <div
                class="follow-avatar-item"
                :class="{ 'follow-avatar-item--active': followFilterUid === null }"
                @click="followFilterUid = null"
              >
                <div class="follow-avatar-ring">
                  <span class="follow-avatar-all-text">全部</span>
                </div>
              </div>
              <div
                v-for="user in store.followedUsers"
                :key="user.id"
                class="follow-avatar-item"
                :class="{ 'follow-avatar-item--active': followFilterUid === user.id }"
                @click="followFilterUid = followFilterUid === user.id ? null : user.id"
              >
                <div class="follow-avatar-ring">
                  <div class="follow-avatar-img" :style="{ background: user.avatarColor }">
                    {{ user.nickname.slice(0, 1) }}
                  </div>
                </div>
                <span class="follow-avatar-name">{{ user.nickname.length > 3 ? user.nickname.slice(0, 3) + '...' : user.nickname }}</span>
              </div>
              <div class="follow-avatar-item follow-avatar-manage" @click="onFollowManage">
                <div class="follow-avatar-ring follow-avatar-ring--manage">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div v-if="displayPosts.length === 0" class="empty-feed">
            <div class="empty-icon">📭</div>
            <template v-if="activeChannel === 'follow'">
              <p v-if="followFilterUid">该用户还没有发布过帖子</p>
              <p v-else>这里还没有内容，去关注些有趣的人吧</p>
            </template>
            <template v-else>
              <p>这里还没有符合筛选条件的内容</p>
              <p class="empty-hint">去换个标签或时间试试，或者发一条新帖子吧</p>
            </template>
          </div>

          <div
            v-for="post in displayPosts"
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
              <div class="header-left" @click.stop="goUserProfile(post.authorId)">
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

              <!-- 右侧：三个点 More 按钮 -->
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

            <!-- 正文内容 -->
            <div class="post-card-body">
              <p class="post-card-content">{{ post.content }}</p>
            </div>

            <!-- 图片展示 -->
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

            <!-- 底部操作与分类标签 -->
            <div class="post-card-footer">
              <span class="tag-badge" v-if="post.categoryTag">{{ post.categoryTag }}</span>

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
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- 弹层部分：【标签选择】Drawer、时间/城市等面板   -->
    <!-- ═══════════════════════════════════════════ -->

    <!-- A. 标签选择滑动 Drawer 改为液态玻璃中心弹窗 -->
    <teleport to=".phone-body">
      <transition name="glass-modal-fade">
        <div v-if="showTagDrawer" class="glass-overlay" @click.self="closeTagDrawer">
          <div class="glass-modal tag-glass-modal">
            <div class="glass-modal-header">
              <span class="glass-modal-title">⭐ 分类标签</span>
              <button class="glass-modal-edit-btn" @click="isTagEditing = !isTagEditing">
                {{ isTagEditing ? '完成' : '编辑' }}
              </button>
            </div>

            <div class="glass-modal-body">
              <!-- 1. 常看频道 -->
              <div class="glass-section">
                <div class="glass-section-hdr">
                  <span class="glass-section-title">常看频道</span>
                  <span class="glass-section-subtitle">{{ isTagEditing ? '拖动排序或点击移除' : '点击筛选' }}</span>
                </div>
                <div class="tag-grid" @dragover.prevent>
                  <div
                    v-for="(tag, idx) in frequentTags"
                    :key="tag"
                    class="drawer-tag-item"
                    :class="{
                      'drawer-tag-item--editing': isTagEditing,
                      'drawer-tag-item--selected': selectedTags.includes(tag)
                    }"
                    :draggable="isTagEditing"
                    @dragstart="onTagDragStart(idx, $event)"
                    @dragover.prevent="onTagDragOver(idx, $event)"
                    @drop="onTagDrop(idx, $event)"
                    @click="onTagClick(tag)"
                  >
                    <span class="tag-text-span">{{ tag }}</span>
                    <div v-if="isTagEditing" class="tag-remove-btn" @click.stop="removeFrequentTag(tag, idx)">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 2. 推荐频道 -->
              <div class="glass-section" style="margin-top: 16px;">
                <div class="glass-section-hdr">
                  <span class="glass-section-title">💡 推荐添加</span>
                </div>
                <div class="tag-grid">
                  <div
                    v-for="tag in recommendedTags"
                    :key="tag"
                    class="drawer-tag-item drawer-tag-item--recommend"
                    @click="addFrequentTag(tag)"
                  >
                    <svg class="tag-plus-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    <span class="tag-text-span">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="glass-modal-footer">
              <button class="glass-close-btn" @click="closeTagDrawer">确定</button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- B. 时间筛选面板 改为液态玻璃中心弹窗 -->
    <teleport to=".phone-body">
      <transition name="glass-modal-fade">
        <div v-if="showTimeSheet" class="glass-overlay" @click.self="closeTimeSheet">
          <div class="glass-modal time-glass-modal">
            <div class="glass-modal-header">
              <span class="glass-modal-title">📅 选择发布时间</span>
            </div>

            <div class="glass-modal-body time-actions-list">
              <div
                v-for="action in timeActions"
                :key="action.value"
                class="glass-time-item"
                :class="{ 'glass-time-item--active': selectedTime === action.value }"
                @click="onTimeSelect(action)"
              >
                <span>{{ action.name }}</span>
                <svg v-if="selectedTime === action.value" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>

            <div class="glass-modal-footer" style="margin-top: 12px;">
              <button class="glass-close-btn" @click="closeTimeSheet">取消</button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- C. 城市选择面板 (同城 L1 激活且再次点击时触发) -->
    <van-action-sheet
      v-model:show="showCitySheet"
      title="选择同城定位"
      :actions="cityActions"
      teleport="#phone-screen"
      cancel-text="取消"
      @select="onCitySelect"
    />

    <!-- D. 城市添加对话框 -->
    <van-dialog
      v-model:show="showAddCityDialog"
      title="新增关注城市"
      show-cancel-button
      teleport="#phone-screen"
      @confirm="handleAddCity"
    >
      <div style="padding: 16px 20px;">
        <van-field v-model="newCityName" placeholder="请输入城市名字，如：广州" autofocus />
      </div>
    </van-dialog>

    <!-- E. 转发面板 -->
    <van-action-sheet
      v-model:show="showForwardSheet"
      title="转发"
      :actions="forwardActions"
      teleport="#phone-screen"
      @select="onForwardSelect"
      cancel-text="取消"
    />

    <!-- F. ContextMenu 帖子操作菜单 -->
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { showToast } from 'vant'
import ContextMenu from '@/components/common/ContextMenu.vue'

const router = useRouter()
const store = useAppStore()

// ===== 滚动与动态高度自适应 =====
const scrollTop = ref(0)
const scrollRef = ref(null)
const headerRef = ref(null)
const headerHeight = ref(100) // 动态自适应初始高度

let resizeObserver = null

function handleScroll() {
  scrollTop.value = scrollRef.value?.scrollTop ?? 0
}

const updateHeaderHeight = () => {
  if (headerRef.value) {
    headerHeight.value = headerRef.value.offsetHeight
  }
}

onMounted(() => {
  // 本地存储恢复用户城市
  const saved = localStorage.getItem('echo_user_cities')
  if (saved) {
    userCities.value = JSON.parse(saved)
  } else {
    userCities.value = ['北京', '上海', '南京']
  }
  const savedActive = localStorage.getItem('echo_active_city')
  if (savedActive && userCities.value.includes(savedActive)) {
    activeCity.value = savedActive
  } else {
    activeCity.value = userCities.value[0] || '北京'
  }

  // 绑定 ResizeObserver，监听高度变化
  if (headerRef.value) {
    updateHeaderHeight()
    resizeObserver = new ResizeObserver(() => {
      updateHeaderHeight()
    })
    resizeObserver.observe(headerRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver && headerRef.value) {
    resizeObserver.unobserve(headerRef.value)
  }
})

// ===== 筛选控制状态 =====
const activeChannel = ref('recommend') // 'meet' | 'recommend' | 'city' | 'school' | 'follow'
const sortMode = ref('hot') // 'hot' | 'latest'
const selectedTags = ref([])
const selectedTime = ref('all') // 'all' | 'today' | 'week' | 'month' | 'half_year' | 'year'

const followFilterUid = ref(null)

function onFollowManage() {
  showToast('关注管理功能建设中...')
}

// 一级大频道映射列表
const channelList = [
  { key: 'meet', label: '遇见' },
  { key: 'follow', label: '关注' },
  { key: 'recommend', label: '推荐' },
  { key: 'city', label: '同城' },
  { key: 'school', label: '本校' }
]

const channelLabelMap = {
  meet: '遇见',
  follow: '关注',
  recommend: '推荐',
  city: '同城',
  school: '本校'
}

function onChannelSwitch(key) {
  if (key === 'city' && activeChannel.value === 'city') {
    showCitySheet.value = true // 二次点击同城打开城市面板
    return
  }
  activeChannel.value = key
  if (key !== 'follow') {
    followFilterUid.value = null
  }
  if (scrollRef.value) {
    scrollRef.value.scrollTop = 0 // 切换频道后帖子流重归顶部
  }
}

// ===== 城市过滤逻辑 =====
const showCitySheet = ref(false)
const userCities = ref(['北京', '上海', '南京'])
const activeCity = ref('北京')
const showAddCityDialog = ref(false)
const newCityName = ref('')

const cityActions = computed(() => {
  const actions = userCities.value.map(city => ({
    name: city,
    value: city,
    className: city === activeCity.value ? 'city-action--selected' : ''
  }))
  actions.push({ name: '+ 新增城市...', value: 'add_city', color: 'var(--echo-primary)' })
  return actions
})

function onCitySelect(action) {
  showCitySheet.value = false
  if (action.value === 'add_city') {
    newCityName.value = ''
    showAddCityDialog.value = true
    return
  }
  activeCity.value = action.value
  localStorage.setItem('echo_active_city', action.value)
  showToast(`城市已切换为：${action.name}`)
}

function handleAddCity() {
  const city = newCityName.value.trim()
  if (!city) return
  if (userCities.value.includes(city)) {
    showToast('该城市已在列表中')
    return
  }
  userCities.value.push(city)
  localStorage.setItem('echo_user_cities', JSON.stringify(userCities.value))
  activeCity.value = city
  localStorage.setItem('echo_active_city', city)
  showToast(`新增成功，已切换至：${city}`)
}

// ===== 标签 Drawer 管理（拖拽+积分系统自动学习） =====
const showTagDrawer = ref(false)
const isTagEditing = ref(false)
const dragStartTagIdx = ref(-1)

// 初始频道分类
const frequentTags = ref(['摄影', '动漫', '考研', '音乐', '游戏'])
const recommendedTags = ref(['失物招领', '二手交易', '学习干货', '校园穿搭', '校园搭子', '游戏开黑'])

// 标签积分（根据用户行为增加，用于非编辑模式下系统自适应排序）
const tagScores = ref({
  '摄影': 15,
  '动漫': 12,
  '考研': 10,
  '音乐': 8,
  '游戏': 6,
  '失物招领': 0,
  '二手交易': 0,
  '学习干货': 0,
  '校园穿搭': 0,
  '校园搭子': 0,
  '游戏开黑': 0
})

function recordTagAction(tag, points) {
  if (tagScores.value[tag] !== undefined) {
    tagScores.value[tag] += points
    // 如果非编辑状态，系统自适应地按积分降序调整“常看频道”的顺序
    if (!isTagEditing.value) {
      frequentTags.value.sort((a, b) => tagScores.value[b] - tagScores.value[a])
    }
  }
}

function openTagDrawer() {
  isTagEditing.value = false
  showTagDrawer.value = true
  store.lockPhoneScroll()
}

function onTagClick(tag) {
  if (isTagEditing.value) return
  const idx = selectedTags.value.indexOf(tag)
  if (idx > -1) {
    selectedTags.value.splice(idx, 1)
  } else {
    selectedTags.value.push(tag)
  }
  
  // 模拟系统自动学习
  recordTagAction(tag, 1)
}

// 移除标签到推荐频道
function removeFrequentTag(tag, idx) {
  frequentTags.value.splice(idx, 1)
  if (!recommendedTags.value.includes(tag)) {
    recommendedTags.value.push(tag)
  }
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

// 添加推荐标签到常看频道
function addFrequentTag(tag) {
  recommendedTags.value = recommendedTags.value.filter(t => t !== tag)
  if (!frequentTags.value.includes(tag)) {
    frequentTags.value.push(tag)
  }
  recordTagAction(tag, 2) // 点击添加也是一种正面行为
}

// 拖拽排序逻辑
function onTagDragStart(idx, event) {
  if (!isTagEditing.value) return
  dragStartTagIdx.value = idx
  event.dataTransfer.effectAllowed = 'move'
}

function onTagDragOver(idx, event) {
  if (!isTagEditing.value) return
  event.preventDefault()
}

function onTagDrop(idx, event) {
  if (!isTagEditing.value) return
  event.preventDefault()
  const from = dragStartTagIdx.value
  if (from < 0 || from === idx) return
  const list = [...frequentTags.value]
  const [moved] = list.splice(from, 1)
  list.splice(idx, 0, moved)
  frequentTags.value = list
  dragStartTagIdx.value = -1
}

// ===== 时间筛选逻辑 =====
const showTimeSheet = ref(false)
const timeLabelMap = {
  all: '全部时间',
  today: '今天',
  week: '本周',
  month: '最近30天',
  half_year: '最近半年',
  year: '最近一年'
}

const timeActions = [
  { name: '全部时间', value: 'all' },
  { name: '今天', value: 'today' },
  { name: '本周', value: 'week' },
  { name: '最近30天', value: 'month' },
  { name: '最近半年', value: 'half_year' },
  { name: '最近一年', value: 'year' }
]

function openTimeSheet() {
  showTimeSheet.value = true
  store.lockPhoneScroll()
}

function closeTimeSheet() {
  showTimeSheet.value = false
  store.unlockPhoneScroll()
}

function onTimeSelect(action) {
  showTimeSheet.value = false
  selectedTime.value = action.value
  showToast(`时间范围筛选: ${action.name}`)
  store.unlockPhoneScroll()
}

function closeTagDrawer() {
  showTagDrawer.value = false
  store.unlockPhoneScroll()
}

function isWithinTimeRange(createdAtStr, range) {
  if (range === 'all') return true
  try {
    const cleanStr = createdAtStr.replace(/-/g, '/')
    const postDate = new Date(cleanStr)
    const now = new Date()
    const diffMs = now.getTime() - postDate.getTime()
    const oneDayMs = 24 * 60 * 60 * 1000
    if (range === 'today') {
      return diffMs < oneDayMs
    } else if (range === 'week') {
      return diffMs < oneDayMs * 7
    } else if (range === 'month') {
      return diffMs < oneDayMs * 30
    } else if (range === 'half_year') {
      return diffMs < oneDayMs * 180
    } else if (range === 'year') {
      return diffMs < oneDayMs * 365
    }
  } catch (e) {
    console.error(e)
  }
  return true
}

// 清除所有过滤器
function resetFilters() {
  selectedTags.value = []
  selectedTime.value = 'all'
  showToast('筛选已清空')
}

// ===== 帖子流核心筛选排序逻辑 =====
const displayPosts = computed(() => {
  if (activeChannel.value === 'follow') {
    let list = store.posts.filter(p => p.channel === 'follow')
    if (followFilterUid.value) {
      list = list.filter(p => p.authorId === followFilterUid.value)
    }
    // 清理拉黑和隐藏的帖子
    list = list.filter(p => !store.hiddenPostIds.has(p.id) && !store.isUserBlocked(p.authorId))
    // 关注频道默认按发布时间逆序（最新优先）
    list.sort((a, b) => new Date(b.createdAt.replace(/-/g, '/')) - new Date(a.createdAt.replace(/-/g, '/')))
    return list
  }

  let list = [...store.posts]

  // 1. 一级来源筛选
  if (activeChannel.value === 'recommend') {
    // 全局推荐，必须是公开可见的帖子
    list = list.filter(p => p.visibility === 'public')
  } else if (activeChannel.value === 'city') {
    // 同城，匹配对应选中的城市
    list = list.filter(p => {
      const postCity = p.city || '北京'
      return postCity === activeCity.value
    })
  } else if (activeChannel.value === 'school') {
    // 本校，匹配当前用户学校，或者标记为仅本校可见
    list = list.filter(p => {
      const author = store.getUserById(p.authorId)
      const userSchool = store.currentUser?.school || '中央民族大学'
      return p.schoolOnly || (author && author.school === userSchool)
    })
  }

  // 2. 标签/分类筛选
  if (selectedTags.value.length > 0) {
    list = list.filter(p => selectedTags.value.includes(p.categoryTag))
  }

  // 3. 时间筛选
  if (selectedTime.value !== 'all') {
    list = list.filter(p => isWithinTimeRange(p.createdAt, selectedTime.value))
  }

  // 4. 清理拉黑和隐藏的帖子
  list = list.filter(p => !store.hiddenPostIds.has(p.id) && !store.isUserBlocked(p.authorId))

  // 5. 排序规则应用
  if (sortMode.value === 'hot') {
    list.sort((a, b) => {
      // 综合热度算法 = 赞数 + 评论数 * 2 + 收藏数 * 3
      const scoreA = (a.likeCount || 0) + (a.commentCount || 0) * 2 + (a.collectCount || 0) * 3
      const scoreB = (b.likeCount || 0) + (b.commentCount || 0) * 2 + (b.collectCount || 0) * 3
      return scoreB - scoreA
    })
  } else {
    // 最新排序：发布日期逆序
    list.sort((a, b) => new Date(b.createdAt.replace(/-/g, '/')) - new Date(a.createdAt.replace(/-/g, '/')))
  }

  return list
})

// 用户卡片推荐
const meetUsers = computed(() => {
  return store.users.filter(u => u.id !== 'u1').slice(0, 6)
})

// ===== 帖子互动与自动学习更新积分 =====
function onPostLike(post) {
  store.toggleLike(post.id)
  if (store.isPostLiked(post.id)) {
    recordTagAction(post.categoryTag, 5) // 点赞累积标签分数
  }
}

function onPostCollect(post) {
  store.toggleCollect(post.id)
  if (store.isPostCollected(post.id)) {
    recordTagAction(post.categoryTag, 5) // 收藏累积标签分数
  }
}

function goPostDetail(postId) {
  if (wasLongPressed.value) {
    wasLongPressed.value = false
    return
  }
  const post = store.posts.find(p => p.id === postId)
  if (post) {
    recordTagAction(post.categoryTag, 3) // 点击进入详情累积标签分数
  }
  router.push(`/post/${postId}`)
}

// ===== 转发面板 =====
const showForwardSheet = ref(false)
const forwardPostId = ref(null)
const forwardActions = [
  { name: '联系人', value: 'friend' },
  { name: '圈子', value: 'circle' }
]

function onForward(postId) {
  forwardPostId.value = postId
  showForwardSheet.value = true
  store.lockPhoneScroll()
}

function onForwardSelect(action) {
  showForwardSheet.value = false
  if (!forwardPostId.value) return
  store.toggleForward(forwardPostId.value)
  const targetMap = { friend: '联系人', circle: '圈子' }
  showToast(`已转发至${targetMap[action.value] || action.name}`)
  store.unlockPhoneScroll()
}

// ===== 工具函数 =====
function getAuthor(uid) {
  return store.getUserById(uid)
}

function goUserProfile(uid) {
  router.push(`/profile/${uid}`)
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

function handleLongPressStart(postId, event) {
  if (longPressTimer) clearTimeout(longPressTimer)
  wasLongPressed.value = false
  const touch = event.type.startsWith('touch') ? event.touches[0] : event
  lastClientX = touch.clientX
  lastClientY = touch.clientY
  longPressTimer = setTimeout(() => {
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
  const postId = selectedPostId.value
  if (!postId) return
  const post = store.posts.find(p => p.id === postId)
  if (!post) return
  if (value === 'edit') {
    showToast('编辑帖子（原型模拟）')
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
</script>

<style scoped>
.page-root {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* ═══════════════════════════════════════════ */
/* 固定定位容器：包括 Logo、L1、L2 筛选            */
/* ═══════════════════════════════════════════ */
.fixed-header-wrapper {
  position: fixed;
  top: 48px;
  left: 50%;
  transform: translateX(-50%);
  width: 375px;
  z-index: 1000;
  background: var(--echo-white);
  box-shadow: 0 1px 0 var(--echo-border);
}

/* Logo 头部 */
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

.home-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--echo-text);
  letter-spacing: 0.5px;
  margin: 0;
}

.home-search {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--echo-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.home-search:active {
  background: rgba(0, 0, 0, 0.05);
  transform: scale(0.92);
}

/* ── 一级大频道：常驻，z-index:100 ── */
.channel-header {
  height: 44px;
  display: flex;
  background: var(--echo-white);
  z-index: 100;
}

.channel-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
  min-width: 0;
}

.channel-tab-text {
  font-size: 13.5px;
  color: var(--echo-text-secondary);
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
  position: relative;
}

.channel-tab--active .channel-tab-text {
  color: var(--echo-text);
  font-weight: 700;
}

.city-name-badge {
  font-size: 10.5px;
  color: var(--echo-primary);
  font-weight: 600;
}

.channel-tab-bar {
  position: absolute;
  bottom: 2px;
  width: 20px;
  height: 2.5px;
  border-radius: 2px;
  background: var(--echo-primary);
}

/* ── 二级排序+筛选工具栏：常驻，z-index:99 ── */
.filter-sort-bar {
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--echo-white);
  z-index: 99;
}

/* 左侧最新/最热 */
.sort-options {
  display: flex;
  gap: 12px;
}

.sort-btn {
  font-size: 12px;
  color: var(--echo-text-secondary);
  cursor: pointer;
  font-weight: 500;
  padding: 2px 4px;
  user-select: none;
}

.sort-btn--active {
  color: var(--echo-primary);
  font-weight: 700;
}

/* 右侧筛选下拉按钮 */
.filter-actions {
  display: flex;
  gap: 8px;
}

.filter-dropdown-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  background: transparent;
  color: var(--echo-text-secondary);
  font-size: 12px;
  font-weight: 500;
  padding: 2px 4px;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}

.filter-dropdown-btn span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}

.filter-dropdown-btn:active {
  opacity: 0.7;
  transform: scale(0.96);
}

.filter-dropdown-btn--active {
  color: var(--echo-primary) !important;
  font-weight: 700;
}

/* ── 筛选状态汇总条 ── */
.filter-status-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 16px;
  background: #f0f9f4;
  border-top: 1px solid rgba(76, 175, 125, 0.08);
}

.status-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.status-tag-item {
  font-size: 10px;
  color: var(--echo-primary);
  font-weight: 600;
  background: rgba(76, 175, 125, 0.08);
  padding: 2px 8px;
  border-radius: 10px;
  white-space: nowrap;
}

.status-reset-btn {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 10.5px;
  color: var(--echo-primary);
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
  padding: 2px 6px;
}

.status-reset-btn:active {
  opacity: 0.7;
}

/* ═══════════════════════════════════════════ */
/* 滚动帖子流区域                                */
/* ═══════════════════════════════════════════ */
.scroll-content {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  background: #f6f7f9;
  box-sizing: border-box;
}

.post-list {
  min-height: calc(100% - 50px);
}

.post-feed {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.empty-feed {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  color: var(--echo-text-hint);
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-hint {
  font-size: 11.5px;
  margin-top: 4px;
  opacity: 0.8;
}

/* ── 帖子卡片样式 (无大圆角，贴边高密度) ── */
.post-card {
  background: var(--echo-white);
  border-bottom: 1px solid var(--echo-border);
  padding: 16px;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
  box-sizing: border-box;
}

.post-card--active-menu {
  transform: scale(0.99) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03) !important;
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
  margin-bottom: 10px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

.post-card-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 13.5px;
  font-weight: 700;
  flex-shrink: 0;
}

.post-card-meta {
  flex: 1;
  min-width: 0;
}

.post-card-name {
  font-size: 13px;
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

.post-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: var(--echo-text-hint);
  opacity: 0.55;
  cursor: pointer;
}

.post-card-content {
  font-size: 14px;
  color: var(--echo-text);
  line-height: 1.6;
  margin: 0 0 10px 0;
  word-break: break-word;
}

.post-card-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-bottom: 10px;
}

.post-card-img {
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
}

.post-card-img--single {
  grid-column: span 2;
  grid-row: span 2;
  aspect-ratio: 4/3;
}

.post-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag-badge {
  font-size: 10.5px;
  padding: 3px 8px;
  border-radius: 10px;
  background: var(--echo-bg);
  color: var(--echo-text-secondary);
  font-weight: 500;
}

.footer-actions-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.post-card-action {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--echo-text-hint);
  font-size: 11.5px;
  cursor: pointer;
}

/* ── 遇见用户卡片 ── */
.meet-users {
  padding: 16px 12px;
  box-sizing: border-box;
}

.section-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 700;
  color: var(--echo-text);
}

.section-title-hint {
  font-size: 11.5px;
  color: var(--echo-text-hint);
  font-weight: 400;
}

.meet-user-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.meet-user-card {
  background: var(--echo-white);
  border-radius: 14px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.meet-user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
}

.meet-user-name {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--echo-text);
}

.meet-user-school {
  font-size: 11px;
  color: var(--echo-text-hint);
}

.meet-user-tags {
  display: flex;
  gap: 4px;
}

.meet-user-tag {
  font-size: 9.5px;
  padding: 1px 6px;
  border-radius: 8px;
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  font-weight: 500;
}

.meet-user-stats {
  font-size: 10.5px;
  color: var(--echo-text-hint);
}

.meet-user-divider {
  margin: 0 3px;
}

/* ── 标签选择滑动 Drawer ── */
.tag-drawer-popup {
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  background: var(--echo-white);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  border-bottom: 1px solid var(--echo-border);
  flex-shrink: 0;
}

.drawer-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--echo-text-secondary);
  cursor: pointer;
}

.drawer-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--echo-text);
}

.drawer-edit-btn {
  font-size: 13.5px;
  color: var(--echo-primary);
  background: transparent;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.drawer-section {
  margin-bottom: 20px;
}

.section-hdr {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--echo-text);
}

.section-subtitle {
  font-size: 10.5px;
  color: var(--echo-text-hint);
}

.tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.drawer-tag-item {
  position: relative;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 12.5px;
  background: var(--echo-bg);
  color: var(--echo-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}

.drawer-tag-item--selected {
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  font-weight: 700;
}

.drawer-tag-item--editing {
  background: rgba(0,0,0,0.03);
  border: 1px dashed var(--echo-border);
  cursor: move;
}

.drawer-tag-item--recommend {
  background: #f1f2f6;
  display: flex;
  align-items: center;
  gap: 3px;
  color: var(--echo-text-secondary);
}

.tag-remove-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #ff3b30;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.tag-plus-icon {
  color: var(--echo-primary);
}

/* 城市列表项高亮 */
:deep(.city-action--selected) {
  color: var(--echo-primary) !important;
  font-weight: 700 !important;
}

/* 关注频道已关注用户头像横滑栏 styles */
.follow-avatars-bar {
  padding: 8px 0;
  border-bottom: 1px solid var(--echo-border);
  background: var(--echo-white);
}

.follow-avatars-scroll {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 12px;
}

.follow-avatars-scroll::-webkit-scrollbar {
  display: none;
}

.follow-avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  flex-shrink: 0;
  min-width: 56px;
  padding: 2px 4px;
  -webkit-tap-highlight-color: transparent;
}

.follow-avatar-item--active .follow-avatar-ring {
  border-color: var(--echo-primary);
  box-shadow: 0 0 0 2px rgba(76, 175, 125, 0.3);
}

.follow-avatar-ring {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid var(--echo-border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: var(--echo-bg);
}

.follow-avatar-ring--manage {
  border-style: dashed;
}

.follow-avatar-img {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.follow-avatar-all-text {
  font-size: 11px;
  color: var(--echo-text-secondary);
  font-weight: 500;
}

.follow-avatar-name {
  font-size: 10px;
  color: var(--echo-text-hint);
  white-space: nowrap;
  max-width: 52px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Glassmorphism Custom Modals ── */
.glass-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  z-index: 1999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.glass-modal {
  width: 320px;
  max-height: 80%;
  background: var(--echo-white);
  border: 1px solid var(--echo-border);
  border-radius: 16px;
  padding: 18px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.06);
  transform: scale(1);
}

.glass-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  flex-shrink: 0;
}

.glass-modal-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--echo-text);
  background: linear-gradient(135deg, var(--echo-text) 0%, #2f3542 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass-modal-edit-btn {
  font-size: 12px;
  color: var(--echo-primary);
  background: rgba(76, 175, 125, 0.1);
  border: none;
  padding: 4px 10px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.glass-modal-edit-btn:active {
  transform: scale(0.95);
  background: rgba(76, 175, 125, 0.2);
}

.glass-modal-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 2px;
}

.glass-modal-body::-webkit-scrollbar {
  width: 4px;
}
.glass-modal-body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.glass-section {
  display: flex;
  flex-direction: column;
}

.glass-section-hdr {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 8px;
}

.glass-section-title {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--echo-text);
}

.glass-section-subtitle {
  font-size: 10px;
  color: var(--echo-text-hint);
}

/* 时间项选择样式 */
.time-actions-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.glass-time-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  color: var(--echo-text-secondary);
  background: var(--echo-bg);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.glass-time-item:active {
  background: rgba(0, 0, 0, 0.05);
  transform: translateY(1px);
}

.glass-time-item--active {
  color: var(--echo-primary);
  background: var(--echo-primary-light);
  font-weight: 700;
}

.glass-modal-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.glass-close-btn {
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: linear-gradient(135deg, var(--echo-primary) 0%, #3ca073 100%);
  color: white;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(76, 175, 125, 0.2);
  transition: all 0.2s;
}

.glass-close-btn:active {
  transform: scale(0.98);
  box-shadow: 0 2px 6px rgba(76, 175, 125, 0.1);
}

/* ── Custom Transition Animations ── */
.glass-modal-fade-enter-active,
.glass-modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.glass-modal-fade-enter-from,
.glass-modal-fade-leave-to {
  opacity: 0;
}

.glass-modal-fade-enter-active .glass-modal {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s;
  /* Origin at the top-right of the screen where the arrows are */
  transform-origin: 85% 15%;
}

.glass-modal-fade-leave-active .glass-modal {
  transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s;
  transform-origin: 85% 15%;
}

.glass-modal-fade-enter-from .glass-modal,
.glass-modal-fade-leave-to .glass-modal {
  opacity: 0;
  transform: scale(0.02) translate(180px, -220px);
}
</style>
