<template>
  <div v-if="circle" class="circle-home-page">
    <!-- 返回与操作图标：固定定位在页面最上方，不随页面滚动，z-index 最高 -->
    <div class="cover-nav-bar-fixed">
      <div class="cover-icon-btn" @click="$router.back()">
        <van-icon name="arrow-left" size="18" />
      </div>
      <div class="cover-icon-btn" @click="onShare">
        <van-icon name="share-o" size="18" />
      </div>
    </div>

    <!-- 主体内容（可滚动） -->
    <div class="circle-home-scroll">
      <!-- 头部背景图区域：作为滚动内容的第一项，随着向下滚动自然移出屏幕 -->
      <div class="circle-cover-wrap" :style="{ backgroundImage: `url(${circle.backgroundImage})` }">
        <div class="cover-mask"></div>
      </div>

      <!-- 基础卡片：大头像与名字 -->
      <div class="circle-base-card">
        <!-- 头像与主信息：Flex 排版，头像在左，名字与信息在右，最右侧有二维码 -->
        <div class="circle-main-info-row">
          <!-- 大头像 -->
          <div class="big-avatar-box" :style="{ background: circle.color }">
            <span class="big-avatar-icon">{{ circle.icon }}</span>
          </div>

          <!-- 圈子基本数据 -->
          <div class="circle-info-right">
            <!-- 名字与勋章 -->
            <div class="circle-name-line">
              <h1 class="circle-main-name">{{ circle.name }}</h1>
              <div class="badges-wrap">
                <span v-if="circle.official" class="home-badge badge-official">官方</span>
                <span v-if="circle.isAnon" class="home-badge badge-anon">匿名</span>
              </div>
            </div>

            <!-- 人数与圈号 -->
            <div class="circle-meta-row">
              <span class="meta-item">👥 {{ circle.memberCount }} 人</span>
              <span class="meta-divider">|</span>
              <span class="meta-item">圈号: {{ circle.number }}</span>
            </div>

            <!-- 圈子标签放置在该位置 -->
            <div class="circle-tags-inline">
              <span
                v-for="(tag, idx) in circle.tags"
                :key="idx"
                class="circle-tag-pill"
              >
                # {{ tag }}
              </span>
            </div>
          </div>

          <!-- 右上角分享二维码 -->
          <div class="qr-code-btn" @click="onShare">
            <van-icon name="qr" size="22" color="var(--echo-primary)" />
          </div>
        </div>

        <!-- 简介 -->
        <p class="circle-desc-text">{{ circle.description }}</p>

        <!-- 建圈时间 -->
        <div class="circle-create-time">
          <van-icon name="clock-o" size="12" />
          <span>建圈时间: {{ circle.createdAt }}</span>
        </div>
      </div>

      <!-- 成员情况大卡片 -->
      <div class="member-stats-card">
        <h3 class="section-title">成员情况</h3>
        
        <!-- 三栏网格 -->
        <div class="stats-grid">
          <!-- 男女比例 -->
          <div class="stats-grid-item text-pink">
            <div class="item-value">♀ {{ circle.memberStats?.femalePercent }}%</div>
            <div class="item-label">女生共 {{ circle.memberStats?.femaleCount }} 人</div>
          </div>
          <!-- 同城定位 -->
          <div class="stats-grid-item text-blue">
            <div class="item-value">📍 {{ circle.city }}</div>
            <div class="item-label">同城共 {{ circle.memberStats?.cityCount }} 人</div>
          </div>
          <!-- 00后 -->
          <div class="stats-grid-item text-gray">
            <div class="item-value">👥 00后</div>
            <div class="item-label">共 {{ circle.memberStats?.post00sCount }} 人</div>
          </div>
        </div>

        <!-- 底部对比条 -->
        <div class="stats-summary-footer">
          💡 {{ circle.memberStats?.cityCount }} 人与我同城 · {{ circle.memberStats?.post00sCount }} 人与我同为00后
        </div>
      </div>

      <!-- 圈子管理提示 -->
      <div class="circle-tips-box">
        <h3 class="section-title">圈子须知</h3>
        <ul class="tips-list">
          <li>1. 本圈子倡导健康理性的校园学习、生活同好交流，请勿散播虚假违规内容。</li>
          <li>2. 圈子内发帖需遵守校园论坛规范，违者将被管理员移出圈子或封禁发言。</li>
          <li>3. 如有关于本圈子建设、合作的意向，请私信本圈官方联络号。</li>
        </ul>
      </div>
    </div>

    <!-- 底部悬浮按钮栏 -->
    <div class="bottom-action-bar">
      <button
        v-if="!circle.joined"
        class="bottom-join-btn"
        @click="onJoinSubmit"
      >
        申请加圈
      </button>
      <button
        v-else
        class="bottom-chat-btn"
        @click="onEnterChat"
      >
        进入聊天
      </button>
    </div>
  </div>
  
  <!-- 加载状态 -->
  <div v-else class="circle-loading-page">
    <van-loading size="24px">加载圈子信息...</van-loading>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const store = useAppStore()

// 获取当前圈子数据
const circle = computed(() => {
  const cid = route.params.id
  return store.circles.find(c => c.id === cid) || null
})

// 复制圈号
function copyCircleNumber() {
  if (!circle.value) return
  navigator.clipboard.writeText(circle.value.number)
  showToast({
    message: '圈号已复制到剪贴板',
    position: 'bottom'
  })
}

// 申请加入
function onJoinSubmit() {
  if (!circle.value) return
  const success = store.joinCircle(circle.value.id)
  if (success) {
    showToast({
      message: '申请已发送，已自动同意加入本圈！',
      icon: 'success'
    })
  }
}

// 进入聊天
function onEnterChat() {
  showToast({
    message: '已进入圈子聊天室（原型演示）',
    icon: 'chat'
  })
}

// 分享
function onShare() {
  showToast('分享面板已呼出（模拟原型）')
}
</script>

<style scoped>
.circle-home-page {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: var(--echo-bg);
  overflow: hidden;
}

/* 头部大图 */
.circle-cover-wrap {
  width: 100%;
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
  flex-shrink: 0;
}
.cover-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.1) 100%);
}
.cover-nav-bar-fixed {
  position: absolute;
  top: 12px;
  left: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
  pointer-events: none;
}
.cover-nav-bar-fixed .cover-icon-btn {
  pointer-events: auto;
}
.cover-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--echo-text);
  cursor: pointer;
  transition: background var(--echo-transition-fast);
}
.cover-icon-btn:active {
  background: rgba(255, 255, 255, 0.9);
}

/* 滚动区 */
.circle-home-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 0 84px; /* 贴顶无内边距，大图贴边 */
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 基础卡片：大头像在卡片交界处 */
.circle-base-card {
  background: var(--echo-white);
  border-radius: var(--echo-radius-lg);
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.02);
  margin: 12px 16px 0; /* 左右 16px，上方 12px 避开大图贴靠 */
  position: relative;
  z-index: 20;
}
.circle-main-info-row {
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
}
.circle-info-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.big-avatar-box {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
  flex-shrink: 0;
}
.big-avatar-icon {
  font-size: 32px;
}
.qr-code-btn {
  align-self: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background 0.15s;
  flex-shrink: 0;
}
.qr-code-btn:active {
  background: var(--echo-bg);
}

.circle-name-line {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.circle-main-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--echo-text);
  line-height: 1.2;
}
.badges-wrap {
  display: flex;
  gap: 6px;
}
.home-badge {
  font-size: 9px;
  padding: 1.5px 6px;
  border-radius: 4px;
  font-weight: 600;
}
.badge-official {
  background: #e8f5ee;
  color: var(--echo-primary);
}
.badge-anon {
  background: #e3f2fd;
  color: #1e88e5;
}

.circle-meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--echo-text-secondary);
  flex-wrap: wrap;
}
.meta-item {
  font-weight: 500;
}
.meta-divider {
  color: var(--echo-border);
}


.circle-desc-text {
  font-size: 12px;
  color: var(--echo-text-secondary);
  line-height: 1.5;
  margin-top: 12px;
  border-top: 1px dashed var(--echo-border);
  padding-top: 12px;
}

.circle-tags-inline {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 2px;
}
.circle-tag-pill {
  font-size: 10px;
  color: var(--echo-primary);
  background: rgba(76, 175, 125, 0.08);
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.circle-create-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--echo-text-hint);
  margin-top: 12px;
}

/* 成员分布卡片 */
.member-stats-card {
  background: var(--echo-white);
  border-radius: var(--echo-radius-lg);
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 16px; /* 左右 16px 外边距对齐 */
}
.section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--echo-text);
  border-left: 3px solid var(--echo-primary);
  padding-left: 8px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.stats-grid-item {
  background: var(--echo-bg);
  border-radius: 10px;
  padding: 12px 6px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.item-value {
  font-size: 14px;
  font-weight: 700;
}
.item-label {
  font-size: 9px;
  color: var(--echo-text-secondary);
}

.text-pink .item-value { color: #e91e63; }
.text-blue .item-value { color: #2196f3; }
.text-gray .item-value { color: #607d8b; }

.stats-summary-footer {
  font-size: 10px;
  color: var(--echo-text-hint);
  text-align: center;
  background: var(--echo-bg);
  padding: 6px;
  border-radius: 8px;
  margin-top: 4px;
}

/* 圈子须知 */
.circle-tips-box {
  background: var(--echo-white);
  border-radius: var(--echo-radius-lg);
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0 16px; /* 左右 16px 外边距对齐 */
}
.tips-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.tips-list li {
  font-size: 11px;
  color: var(--echo-text-secondary);
  line-height: 1.4;
}

/* 底部悬浮栏 */
.bottom-action-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 68px;
  background: var(--echo-white);
  border-top: 1px solid var(--echo-border);
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  z-index: 50;
}
.bottom-join-btn {
  width: 100%;
  background: var(--echo-primary);
  border: none;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 12px;
  border-radius: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(76, 175, 125, 0.2);
  transition: opacity 0.2s;
}
.bottom-join-btn:active {
  opacity: 0.9;
}

.bottom-chat-btn {
  width: 100%;
  background: #fff;
  border: 1px solid var(--echo-primary);
  color: var(--echo-primary);
  font-size: 14px;
  font-weight: 600;
  padding: 12px;
  border-radius: 24px;
  cursor: pointer;
  transition: background 0.15s;
}
.bottom-chat-btn:active {
  background: rgba(76, 175, 125, 0.05);
}

/* 加载页面 */
.circle-loading-page {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--echo-bg);
}
</style>
