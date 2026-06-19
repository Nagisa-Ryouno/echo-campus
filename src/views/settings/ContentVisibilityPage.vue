<template>
  <div class="sub-page">
    <!-- 顶部 -->
    <div class="page-header">
      <div class="nav-back" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </div>
      <h2 class="page-title">内容可见性</h2>
    </div>

    <!-- 主体 -->
    <div class="page-body">
      <!-- 引导说明 -->
      <div class="guide-card">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--echo-primary)" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <span>以下设置控制你的帖子、评论、收藏在个人主页中分别对哪些人可见。每类内容独立设置，互不影响。</span>
      </div>

      <!-- ======= 我的帖子 ======= -->
      <div class="section-label">我的帖子</div>
      <div class="option-card">
        <div
          v-for="opt in visibilityOptions"
          :key="opt.value"
          class="option-item"
          :class="{ selected: store.postVisibility === opt.value }"
          @click="store.postVisibility = opt.value"
        >
          <div class="option-body">
            <div class="option-radio" :class="{ active: store.postVisibility === opt.value }">
              <div v-if="store.postVisibility === opt.value" class="radio-dot"></div>
            </div>
            <div>
              <div class="option-label">{{ opt.label }}</div>
              <div class="option-hint">{{ opt.hint }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ======= 我的评论 ======= -->
      <div class="section-label" style="margin-top: 20px;">我的评论</div>
      <div class="option-card">
        <div
          v-for="opt in visibilityOptions"
          :key="opt.value"
          class="option-item"
          :class="{ selected: store.commentVisibility === opt.value }"
          @click="store.commentVisibility = opt.value"
        >
          <div class="option-body">
            <div class="option-radio" :class="{ active: store.commentVisibility === opt.value }">
              <div v-if="store.commentVisibility === opt.value" class="radio-dot"></div>
            </div>
            <div>
              <div class="option-label">{{ opt.label }}</div>
              <div class="option-hint">{{ opt.hint }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ======= 我的收藏 ======= -->
      <div class="section-label" style="margin-top: 20px;">我的收藏</div>
      <div class="option-card">
        <div
          v-for="opt in visibilityOptions"
          :key="opt.value"
          class="option-item"
          :class="{ selected: store.collectionVisibility === opt.value }"
          @click="store.collectionVisibility = opt.value"
        >
          <div class="option-body">
            <div class="option-radio" :class="{ active: store.collectionVisibility === opt.value }">
              <div v-if="store.collectionVisibility === opt.value" class="radio-dot"></div>
            </div>
            <div>
              <div class="option-label">{{ opt.label }}</div>
              <div class="option-hint">{{ opt.hint }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部说明 -->
      <p class="page-footer">
        帖子、评论、收藏的可见性分别设置，互不绑定。修改后仅影响个人主页中的展示，不影响帖子详情页和频道中的分发规则。
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app.js'
const store = useAppStore()

const visibilityOptions = [
  { value: 'everyone', label: '所有人可见', hint: '所有校声用户都能看到' },
  { value: 'followers', label: '仅关注者可见', hint: '仅关注你的人可以看到' },
  { value: 'mutual', label: '仅互关者可见', hint: '仅与你互相关注的用户可以看到' },
  { value: 'private', label: '仅自己可见', hint: '只有你自己能看到' }
]
</script>

<style scoped>
.sub-page { min-height: 100%; background: var(--echo-bg); }

/* 头部 */
.page-header {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px;
  background: var(--echo-white);
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

/* 引导卡 */
.guide-card {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 12px 14px;
  background: #f0f7f4;
  border-radius: var(--echo-radius);
  font-size: var(--echo-text-xs);
  color: #4a7c5a;
  line-height: 1.5;
  margin-bottom: 16px;
}
.guide-card svg { flex-shrink: 0; margin-top: 1px; }

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
.option-hint { font-size: var(--echo-text-xs); color: var(--echo-text-hint); margin-top: 2px; }

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
