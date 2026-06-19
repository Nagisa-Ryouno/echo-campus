<template>
  <div class="sub-page">
    <!-- 顶部 -->
    <div class="page-header">
      <div class="nav-back" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </div>
      <h2 class="page-title">互动权限</h2>
    </div>

    <!-- 主体 -->
    <div class="page-body">
      <!-- 权限摘要 -->
      <div class="perm-summary">
        <div class="summary-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--echo-primary)" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>评论：<strong>{{ store.commentLabels[store.commentPermission] }}</strong></span>
        </div>
        <div class="summary-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--echo-primary)" stroke-width="2"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="14" y2="13"/></svg>
          <span>私信：<strong>{{ store.messageLabels[store.messagePermission] }}</strong></span>
        </div>
        <div class="summary-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--echo-primary)" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          <span>关注：<strong>{{ store.followLabels[store.followPermission] }}</strong></span>
        </div>
      </div>

      <!-- ======= 第一块：评论权限 ======= -->
      <div class="section-label">评论权限</div>
      <div class="option-card">
        <div
          v-for="opt in commentOptions"
          :key="opt.value"
          class="option-item"
          :class="{ selected: store.commentPermission === opt.value }"
          @click="store.commentPermission = opt.value"
        >
          <div class="option-body">
            <div class="option-radio" :class="{ active: store.commentPermission === opt.value }">
              <div v-if="store.commentPermission === opt.value" class="radio-dot"></div>
            </div>
            <span class="option-label">{{ opt.label }}</span>
          </div>
        </div>
      </div>

      <!-- ======= 第二块：私信权限 ======= -->
      <div class="section-label" style="margin-top: 20px;">私信权限</div>
      <div class="option-card">
        <div
          v-for="opt in messageOptions"
          :key="opt.value"
          class="option-item"
          :class="{ selected: store.messagePermission === opt.value }"
          @click="store.messagePermission = opt.value"
        >
          <div class="option-body">
            <div class="option-radio" :class="{ active: store.messagePermission === opt.value }">
              <div v-if="store.messagePermission === opt.value" class="radio-dot"></div>
            </div>
            <span class="option-label">{{ opt.label }}</span>
          </div>
        </div>
      </div>

      <!-- ======= 第三块：关注权限 ======= -->
      <div class="section-label" style="margin-top: 20px;">关注权限</div>
      <div class="option-card">
        <div
          v-for="opt in followOptions"
          :key="opt.value"
          class="option-item"
          :class="{ selected: store.followPermission === opt.value }"
          @click="store.followPermission = opt.value"
        >
          <div class="option-body">
            <div class="option-radio" :class="{ active: store.followPermission === opt.value }">
              <div v-if="store.followPermission === opt.value" class="radio-dot"></div>
            </div>
            <span class="option-label">{{ opt.label }}</span>
          </div>
        </div>
      </div>

      <!-- ======= 补充项 ======= -->
      <div class="section-label" style="margin-top: 20px;">更多设置</div>
      <div class="option-card">
        <div class="option-item">
          <div class="option-body">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-secondary)" stroke-width="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            <span class="option-label">允许匿名用户给我发消息</span>
          </div>
          <van-switch v-model="allowAnonMsg" size="22" active-color="var(--echo-primary)" />
        </div>
        <div class="option-item">
          <div class="option-body">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-secondary)" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="option-label">允许陌生人查看我的主页</span>
          </div>
          <van-switch v-model="allowStrangerViewProfile" size="22" active-color="var(--echo-primary)" />
        </div>
        <div class="option-item">
          <div class="option-body">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-secondary)" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            <span class="option-label">允许陌生人查看我的动态</span>
          </div>
          <van-switch v-model="allowStrangerViewPosts" size="22" active-color="var(--echo-primary)" />
        </div>
      </div>

      <!-- 底部说明 -->
      <p class="page-footer">
        互动权限会影响别人对你的评论、私信、关注行为。被限制的用户将无法发起对应互动。
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/stores/app.js'
const store = useAppStore()

const allowAnonMsg = ref(true)
const allowStrangerViewProfile = ref(true)
const allowStrangerViewPosts = ref(true)

const commentOptions = [
  { value: 'everyone', label: '所有人可评论' },
  { value: 'followers', label: '仅关注者可评论' },
  { value: 'mutual', label: '仅互关者可评论' },
  { value: 'nobody', label: '不允许评论' }
]

const messageOptions = [
  { value: 'everyone', label: '所有人可私信' },
  { value: 'followers', label: '仅关注者可私信' },
  { value: 'mutual', label: '仅互关者可私信' },
  { value: 'nobody', label: '不接受私信' }
]

const followOptions = [
  { value: 'everyone', label: '所有人可关注' },
  { value: 'require_approval', label: '关注需验证' },
  { value: 'nobody', label: '不允许陌生人关注' }
]
</script>

<style scoped>
.sub-page { min-height: 100%; background: var(--echo-bg); }

/* 头部 */
.page-header {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px;
  background: var(--echo-white);
  position: sticky; top: 0; z-index: 100;
}
.nav-back {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--echo-text);
  transition: background var(--echo-transition-fast);
}
.nav-back:active { background: var(--echo-bg); }
.page-title { font-size: var(--echo-text-xl); font-weight: var(--echo-weight-bold); color: var(--echo-text); }

/* 主体 */
.page-body { padding: 16px; }

/* 权限摘要 */
.perm-summary {
  background: var(--echo-white);
  border-radius: var(--echo-radius);
  padding: 14px 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.summary-row {
  display: flex; align-items: center; gap: 8px;
  font-size: var(--echo-text-sm); color: var(--echo-text-secondary);
}
.summary-row strong { color: var(--echo-text); font-weight: var(--echo-weight-semibold); }

/* 分组标签 */
.section-label {
  font-size: var(--echo-text-sm);
  color: var(--echo-text-hint);
  font-weight: var(--echo-weight-semibold);
  margin-bottom: 8px;
  padding-left: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 选项卡片 */
.option-card {
  background: var(--echo-white);
  border-radius: var(--echo-radius);
  overflow: hidden;
}
.option-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--echo-divider);
  transition: background var(--echo-transition-fast);
  cursor: pointer;
}
.option-item:last-child { border-bottom: none; }
.option-item:active { background: var(--echo-bg); }
.option-item.selected { background: #f0fdf4; }

.option-body { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }

/* 单选圆点 */
.option-radio {
  width: 20px; height: 20px; border-radius: 50%;
  border: 2px solid #d0d0d0;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: border-color var(--echo-transition-fast);
}
.option-radio.active { border-color: var(--echo-primary); }
.radio-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--echo-primary);
}

.option-label { font-size: var(--echo-text-md); color: var(--echo-text); font-weight: var(--echo-weight-medium); }

/* 底部 */
.page-footer {
  font-size: var(--echo-text-xs);
  color: var(--echo-text-placeholder);
  text-align: center;
  padding: 24px 12px;
  margin: 0;
  line-height: 1.6;
}
</style>
