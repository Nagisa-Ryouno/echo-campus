<template>
  <div class="page-root">
    <!-- ═══════════════════════════════════════════ -->
    <!-- 固定层：position:fixed，脱离滚动流             -->
    <!-- ═══════════════════════════════════════════ -->
    <div class="fixed-header">
      <!-- LOGO 区：滚动后隐藏 -->
      <div class="logo-header" :class="{ hidden: scrollTop > 10 }">
        <h1 class="home-title">校声</h1>
        <div class="home-search" @click="$router.push(`/search?from=home&channel=${store.activeChannel}`)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      <!-- 大频道 Tab：永久固定 -->
      <div class="channel-header">
        <div
          v-for="ch in store.channelLabels"
          :key="ch.key"
          class="channel-tab"
          :class="{ 'channel-tab--active': store.activeChannel === ch.key }"
          @click="onChannelSwitch(ch.key)"
        >
          <span class="channel-tab-text">
            <!-- ⭐ 星星图标 - 关注 (Follow) -->
            <svg v-if="ch.key === 'follow' && store.activeChannel === 'follow'" class="channel-tab-icon" width="14" height="14" viewBox="0 0 24 24" fill="var(--echo-primary)" stroke="var(--echo-primary)">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>

            <!-- ✨ 闪烁推荐 - 推荐 (Recommend) -->
            <svg v-if="ch.key === 'recommend' && store.activeChannel === 'recommend'" class="channel-tab-icon" width="14" height="14" viewBox="0 0 24 24" fill="var(--echo-primary)" stroke="var(--echo-primary)">
              <path d="M12 2s.5 4 4.5 4.5c0 0-4 .5-4.5 4.5 0 0-.5-4-4.5-4.5 0 0 4-.5 4.5-4.5zm7 11s.3 2 2.5 2.3c0 0-2 .2-2.3 2.2 0 0-.2-2-2.2-2.2 0 0 2-.3 2.3-2.3z"/>
            </svg>

            <!-- 🍃 绿叶图标 - 同城 (City) -->
            <svg v-if="ch.key === 'city' && store.activeChannel === 'city'" class="city-leaf-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 1.5 5.5-3 9.8a7 7 0 0 1-5 8.2z" fill="var(--echo-primary)" stroke="var(--echo-primary)"/>
              <path d="M19 2c-2.06 3-4.5 5.5-8 7" stroke="#fff" stroke-width="1.5"/>
            </svg>

            {{ ch.label }}

            <!-- Caret arrow for city channel (when active) -->
            <span v-if="ch.key === 'city' && store.activeChannel === 'city'" class="city-expand-arrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :class="{ 'rotated': isCityPanelExpanded }">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </span>
          <span v-if="store.activeChannel === ch.key" class="channel-tab-bar"></span>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- 滚动层：独立 overflow-y:auto，与固定层彻底隔离    -->
    <!-- ═══════════════════════════════════════════ -->
    <div ref="scrollRef" class="scroll-content" @scroll="handleScroll">
      <!-- 动态占位：logo 显示时 92px，隐藏后 48px -->
      <div
        class="header-spacer"
        :style="{
          height: (scrollTop > 10 ? 48 : 92) + 'px',
          transition: 'height 0.2s ease'
        }"
      ></div>

      <!-- 小频道：跟随滚动消失 -->
      <div v-if="store.activeChannel !== 'meet'" class="sub-tags">
        <!-- 关注频道 → 已关注用户头像横滑 -->
        <div v-if="store.activeChannel === 'follow'" class="follow-avatars-bar">
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
              <span class="follow-avatar-name">{{ user.nickname.length > 3 ? user.nickname.slice(0, 3) + '…' : user.nickname }}</span>
            </div>
            <div class="follow-avatar-item follow-avatar-manage" @click="onFollowManage">
              <div class="follow-avatar-ring follow-avatar-ring--manage">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- 推荐 / 同城 / 我的学校 → 小标签横向滑动 -->
        <div v-else-if="store.currentChannelTags.length > 0" class="sub-tags-area" style="position: relative;">
          <!-- 城市选择栏：遮挡住小频道 -->
          <transition name="city-panel-fade">
            <div v-if="store.activeChannel === 'city' && isCityPanelExpanded" class="city-selector-overlay">
              <div class="city-selector-scroll">
                <div
                  v-for="(city, idx) in userCities"
                  :key="city"
                  class="city-pill"
                  :class="{ 'city-pill--active': activeCity === city }"
                  @click="selectCity(city)"
                >
                  <span class="city-pill-text">{{ city }}</span>
                  <span v-if="idx === 0" class="city-pill-priority-badge">优先</span>
                  <!-- 允许用户删除添加的城市 -->
                  <div v-if="idx > 0" class="city-pill-delete" @click.stop="removeCity(idx)">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </div>
                </div>
                <!-- 添加按钮 -->
                <div class="city-pill city-pill-add" @click="openAddCityDialog">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
              </div>
            </div>
          </transition>

          <!-- 常规小频道滚动列表 -->
          <div class="sub-tags-scroll">
            <div
              v-for="tag in store.visibleTags"
              :key="tag"
              class="sub-tag"
              :class="{ 'sub-tag--active': store.activeCategoryTag === tag }"
              @click="store.setCategoryTag(tag)"
            >
              {{ tag }}
            </div>
          </div>
          <div class="sub-tags-expand" @click="openTagPanel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      </div>

      <!-- 帖子流 -->
      <div class="post-list">
        <!-- 遇见频道：用户推荐卡片 -->
        <div v-if="store.activeChannel === 'meet'" class="meet-users">
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

        <!-- 其他频道：帖子卡片流 -->
        <div v-else class="post-feed">
          <div v-if="displayPosts.length === 0" class="empty-feed">
            <div class="empty-icon">📭</div>
            <p v-if="followFilterUid">该用户还没有发布过帖子</p>
            <template v-else>
              <p>这里还没有内容</p>
              <p class="empty-hint">去发布第一条帖子吧</p>
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
            <!-- 顶部区域重构 -->
            <div class="post-card-header">
              <!-- 左侧：用户头像、昵称、发布时间 -->
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

            <!-- 内容区 -->
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

            <!-- 底部交互区重构：左侧放分类标签，点赞、评论、收藏靠右排布 -->
            <div class="post-card-footer">
              <!-- 左侧标签 -->
              <span class="tag-badge" v-if="post.categoryTag">{{ post.categoryTag }}</span>

              <div class="footer-actions-right">
                <!-- 点赞 -->
                <div class="post-card-action" @click.stop="store.toggleLike(post.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24" :fill="store.isPostLiked(post.id) ? 'var(--echo-danger)' : 'none'" :stroke="store.isPostLiked(post.id) ? 'var(--echo-danger)' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  <span>{{ post.likeCount }}</span>
                </div>
                <!-- 评论 -->
                <div class="post-card-action" @click.stop="goPostDetail(post.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span>{{ post.commentCount }}</span>
                </div>
                <!-- 收藏 -->
                <div class="post-card-action" @click.stop="store.toggleCollect(post.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24" :fill="store.isPostCollected(post.id) ? 'var(--echo-warning)' : 'none'" :stroke="store.isPostCollected(post.id) ? 'var(--echo-warning)' : 'currentColor'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span>{{ post.collectCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 频道管理全屏界面 ===== -->
    <ChannelManage
      :visible="showTagPanel"
      @close="closeTagPanel"
    />

    <!-- ===== 转发面板 ===== -->
    <van-action-sheet
      v-model:show="showForwardSheet"
      title="转发"
      :actions="forwardActions"
      teleport="#phone-screen"
      @select="onForwardSelect"
      cancel-text="取消"
    />

    <!-- ===== 添加城市弹窗 ===== -->
    <van-dialog
      v-model:show="showAddCityDialog"
      title="添加城市"
      show-cancel-button
      teleport="#phone-screen"
      @confirm="handleAddCity"
    >
      <div style="padding: 16px 20px;">
        <van-field v-model="newCityName" placeholder="请输入城市名称" autofocus />
      </div>
    </van-dialog>

    <!-- ===== 帖子操作悬浮菜单 ===== -->
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { showToast } from 'vant'
import ChannelManage from '@/components/ChannelManage.vue'
import ContextMenu from '@/components/common/ContextMenu.vue'

const router = useRouter()
const store = useAppStore()

// ===== 滚动监听：直接监听 .scroll-content 的 scroll 事件 =====
const scrollTop = ref(0)
const scrollRef = ref(null)

function handleScroll() {
  scrollTop.value = scrollRef.value?.scrollTop ?? 0
}

// ===== 同城频道城市选择 =====
const isCityPanelExpanded = ref(false)
const userCities = ref(['北京'])
const activeCity = ref('北京')
const showAddCityDialog = ref(false)
const newCityName = ref('')

onMounted(() => {
  const saved = localStorage.getItem('echo_user_cities')
  if (saved) {
    userCities.value = JSON.parse(saved)
  } else {
    userCities.value = ['北京']
  }
  const savedActive = localStorage.getItem('echo_active_city')
  if (savedActive && userCities.value.includes(savedActive)) {
    activeCity.value = savedActive
  } else {
    activeCity.value = userCities.value[0] || '北京'
  }
})

function saveCities() {
  localStorage.setItem('echo_user_cities', JSON.stringify(userCities.value))
}

function toggleCityPanel() {
  isCityPanelExpanded.value = !isCityPanelExpanded.value
}

function selectCity(city) {
  activeCity.value = city
  localStorage.setItem('echo_active_city', city)
  showToast(`已切换城市为: ${city}`)
}

function openAddCityDialog() {
  newCityName.value = ''
  showAddCityDialog.value = true
}

function handleAddCity() {
  const city = newCityName.value.trim()
  if (!city) return
  if (userCities.value.includes(city)) {
    showToast('该城市已在列表中')
    return
  }
  userCities.value.push(city)
  saveCities()
  selectCity(city)
}

function removeCity(index) {
  const removed = userCities.value[index]
  userCities.value.splice(index, 1)
  saveCities()
  showToast(`已删除城市: ${removed}`)
  if (activeCity.value === removed) {
    selectCity(userCities.value[0] || '北京')
  }
}

// ===== 频道切换（同步标签池）=====
const channelDisplayName = computed(() => {
  const ch = store.channelLabels.find(c => c.key === store.activeChannel)
  return ch ? ch.label : ''
})

function onChannelSwitch(key) {
  if (key === 'city' && store.activeChannel === 'city') {
    toggleCityPanel()
    return
  }
  store.setChannel(key)
  store.syncTagsToChannel(key)
  isCityPanelExpanded.value = false
}

// 首次加载同步推荐频道标签
if (store.userTags.length === 0 || store.activeChannel === 'recommend') {
  store.syncTagsToChannel(store.activeChannel)
}

// ===== 标签面板 =====
const showTagPanel = ref(false)

function openTagPanel() {
  showTagPanel.value = true
  store.lockPhoneScroll()
}

function closeTagPanel() {
  showTagPanel.value = false
  store.unlockPhoneScroll()
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

function closeForwardSheet() {
  showForwardSheet.value = false
  store.unlockPhoneScroll()
}

// ===== 关注频道 - 用户筛选 =====
const followFilterUid = ref(null)

const displayPosts = computed(() => {
  let list = store.filteredPosts
  if (store.activeChannel === 'follow' && followFilterUid.value) {
    list = list.filter(p => p.authorId === followFilterUid.value)
  } else if (store.activeChannel === 'city' && activeCity.value) {
    list = list.filter(p => {
      const postCity = p.city || '北京'
      return postCity === activeCity.value
    })
  }
  return list
})

function onFollowManage() {}

// ===== 遇见频道推荐用户 =====
const meetUsers = computed(() => {
  return store.users.filter(u => u.id !== 'u1').slice(0, 6)
})

// ===== 工具函数 =====
function getAuthor(uid) {
  return store.getUserById(uid)
}

// ===== 长按操作菜单 =====
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
  if (event.target.closest('.post-more-btn')) return // Skip for three-dot button click
  if (event.button !== 0) return // Only trigger for left-click
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
    // 隐藏该作者的所有帖子
    const authorPostIds = store.posts.filter(p => p.authorId === post.authorId).map(p => p.id)
    authorPostIds.forEach(id => hidingPostIds.value.add(id))
    setTimeout(() => {
      authorPostIds.forEach(id => store.hidePost(id))
      // clear hiding state
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

function goUserProfile(uid) {
  router.push(`/profile/${uid}`)
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
/* phone-body 的 transform:translateZ(0) 是    */
/* 包含块，故 fixed 不相对 viewport                */
/* ═══════════════════════════════════════════ */
.fixed-header {
  position: fixed;
  top: 48px;
  left: 50%;
  transform: translateX(-50%);
  width: 375px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* ── Logo 区：滚动后 translateY 隐藏 ── */
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
  background: transparent;
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

/* ── 大频道栏：永久固定，禁止 sticky ── */
.channel-header {
  height: 48px;
  display: flex;
  background: transparent;
  border-bottom: 1px solid var(--echo-divider);
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
  font-size: 13px;
  color: var(--echo-text-secondary);
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
  position: relative;
}

.channel-tab--active .channel-tab-text {
  color: var(--echo-text);
  font-weight: 600;
}

.channel-tab-bar {
  position: absolute;
  bottom: 6px;
  width: 20px;
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

/* 动态占位高度由 :style 控制，无需静态定义 */

/* ── 关注频道：用户头像横滑栏 ── */
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

/* ── 小频道标签（推荐/同城/我的学校）── */
.sub-tags-area {
  display: flex;
  align-items: center;
  padding: 8px 0 8px 12px;
  border-bottom: 1px solid var(--echo-border);
  background: var(--echo-white);
}

.sub-tags-scroll {
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  min-width: 0;
}

.sub-tags-scroll::-webkit-scrollbar {
  display: none;
}

.sub-tag {
  flex-shrink: 0;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 13px;
  background: var(--echo-bg);
  color: var(--echo-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}

.sub-tag--active {
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  font-weight: 600;
}

.sub-tags-expand {
  flex-shrink: 0;
  width: 44px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--echo-text-hint);
  cursor: pointer;
  background: linear-gradient(90deg, transparent 0%, var(--echo-white) 50%);
}

/* ── 遇见频道 - 用户卡片 ── */
.meet-users {
  padding: 16px 12px;
  max-width: 375px;
  box-sizing: border-box;
}

.section-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--echo-text);
}

.section-title-hint {
  font-size: 12px;
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
  border-radius: var(--echo-radius);
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 0;
}

.meet-user-card:active {
  transform: scale(0.98);
}

.meet-user-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
}

.meet-user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--echo-text);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meet-user-school {
  font-size: 11px;
  color: var(--echo-text-hint);
}

.meet-user-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.meet-user-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--echo-primary-light);
  color: var(--echo-primary);
}

.meet-user-stats {
  font-size: 11px;
  color: var(--echo-text-hint);
}

.meet-user-divider {
  margin: 0 4px;
  opacity: 0.5;
}

/* ── 帖子流 ── */
.post-list {
  min-height: calc(100% - 48px + 45px);
}

.post-feed {
  padding: 0;
}

.empty-feed {
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

.empty-hint {
  font-size: 13px;
  margin-top: 4px;
}

/* ── 帖子卡片 ── */
.post-card {
  background: var(--echo-white);
  border-bottom: 1px solid var(--echo-border);
  padding: 16px;
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

/* ═══════════════════════════════════════════ */
/* 弹层面板（标签管理 / 分享）                   */
/* ═══════════════════════════════════════════ */
.tag-panel-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 500;
  display: flex;
  align-items: flex-end;
  max-width: 375px;
  box-sizing: border-box;
}

.tag-panel-sheet {
  width: 100%;
  max-width: 375px;
  background: var(--echo-white);
  border-radius: 16px 16px 0 0;
  padding: 20px 16px 36px;
  box-sizing: border-box;
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.tag-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.tag-panel-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--echo-text);
  margin: 0;
}

.tag-panel-close {
  font-size: 15px;
  color: var(--echo-primary);
  cursor: pointer;
  font-weight: 500;
}

.tag-panel-hint {
  font-size: 12px;
  color: var(--echo-text-hint);
  margin: 0 0 16px 0;
}

.tag-panel-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-panel-item {
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 14px;
  background: var(--echo-bg);
  color: var(--echo-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tag-panel-item--hidden {
  opacity: 0.35;
  background: var(--echo-border);
}

.tag-panel-item:active {
  transform: scale(0.95);
}

.tag-panel-empty {
  text-align: center;
  padding: 32px 0;
  color: var(--echo-text-hint);
  font-size: 14px;
}

/* ── 面板动画 ── */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.3s ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
}

.panel-slide-enter-from .tag-panel-sheet,
.panel-slide-leave-to .tag-panel-sheet {
  transform: translateY(100%);
}

/* ── 同城城市选择面板 ── */
.city-leaf-icon,
.channel-tab-icon {
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 4px;
  flex-shrink: 0;
}

.city-expand-arrow {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 4px;
  color: var(--echo-text-secondary);
  transition: transform 0.25s ease;
  flex-shrink: 0;
}

.city-expand-arrow svg {
  transition: transform 0.25s ease;
  display: block;
}

.city-expand-arrow svg.rotated {
  transform: rotate(180deg);
}

.city-selector-overlay {
  position: absolute;
  inset: 0;
  background: var(--echo-white);
  z-index: 15;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.city-selector-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: none;
  width: 100%;
  align-items: center;
  padding: 4px 0;
}

.city-selector-scroll::-webkit-scrollbar {
  display: none;
}

.city-pill {
  position: relative;
  flex-shrink: 0;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 13px;
  background: var(--echo-white);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: var(--echo-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  white-space: nowrap;
}

.city-pill--active {
  border-color: var(--echo-primary);
  color: var(--echo-primary);
  background: rgba(76, 175, 125, 0.05);
  font-weight: 600;
}

.city-pill-priority-badge {
  position: absolute;
  top: -8px;
  right: 0;
  background: var(--echo-primary);
  color: #fff;
  font-size: 8px;
  padding: 1px 4px;
  border-radius: 6px 6px 6px 0;
  font-weight: 500;
  transform: scale(0.85) translate(15%, 0);
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(76, 175, 125, 0.3);
}

.city-pill-delete {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.06);
  color: var(--echo-text-secondary);
  transition: all 0.2s;
  margin-left: 2px;
}

.city-pill-delete:active {
  background: rgba(255, 80, 80, 0.2);
  color: #ff5050;
}

.city-pill-add {
  justify-content: center;
  border-style: dashed;
  color: var(--echo-text-hint);
  background: transparent;
  padding: 5px 12px;
}

/* ── 城市面板淡入淡出动画 ── */
.city-panel-fade-enter-active,
.city-panel-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.city-panel-fade-enter-from,
.city-panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
