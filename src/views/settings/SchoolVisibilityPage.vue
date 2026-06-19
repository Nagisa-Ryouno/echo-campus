<template>
  <div class="sub-page">
    <!-- 顶部 -->
    <div class="page-header">
      <div class="nav-back" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </div>
      <h2 class="page-title">学校信息可见性</h2>
    </div>

    <!-- 主体 -->
    <div class="page-body">
      <!-- 当前状态提示 -->
      <div class="current-status">
        <span class="status-dot" :class="currentClass"></span>
        <span>当前：{{ store.visibilityLabels[store.schoolVisibility] }}</span>
      </div>

      <!-- 选项列表 -->
      <div class="option-card">
        <div
          v-for="opt in options"
          :key="opt.value"
          class="option-item"
          :class="{ selected: store.schoolVisibility === opt.value }"
          @click="store.schoolVisibility = opt.value"
        >
          <div class="option-body">
            <div class="option-icon" :style="{ background: opt.bg }">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="opt.color" stroke-width="2" v-html="getIconPath(opt.value)"></svg>
            </div>
            <div class="option-text">
              <div class="option-label">{{ opt.label }}</div>
              <div class="option-hint">{{ opt.hint }}</div>
            </div>
          </div>
          <div v-if="store.schoolVisibility === opt.value" class="option-check">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--echo-primary)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
      </div>

      <!-- 底部说明 -->
      <p class="page-footer">
        该设置会影响你的主页、帖子、评论和遇见频道中的学校展示效果。
        修改后立即生效。
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app.js'
const store = useAppStore()

const iconPaths = {
  public: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  school_only: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  hidden: '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'
}

function getIconPath(value) {
  return iconPaths[value] || iconPaths.public
}

const options = [
  { value: 'public', label: '所有人可见', hint: '所有用户都能看到你的学校信息', bg: '#e8f5e9', color: '#4caf7d' },
  { value: 'school_only', label: '仅本校可见', hint: '只有同校用户能看到你的学校信息', bg: '#e3f2fd', color: '#2196f3' },
  { value: 'hidden', label: '完全隐藏', hint: '所有人都无法看到你的学校信息', bg: '#fce4ec', color: '#e91e63' }
]

const currentClass = computed(() => {
  return { public: 'dot-green', school_only: 'dot-blue', hidden: 'dot-red' }[store.schoolVisibility] || 'dot-green'
})
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

/* 当前状态 */
.current-status {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px;
  background: var(--echo-white);
  border-radius: var(--echo-radius);
  font-size: var(--echo-text-sm);
  color: var(--echo-text-secondary);
  margin-bottom: 14px;
}
.status-dot { width: 8px; height: 8px; border-radius: 50%; }
.dot-green { background: #4caf7d; }
.dot-blue { background: #2196f3; }
.dot-red { background: #e91e63; }

/* 选项卡片 */
.option-card {
  background: var(--echo-white);
  border-radius: var(--echo-radius);
  overflow: hidden;
}
.option-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--echo-divider);
  transition: background var(--echo-transition-fast);
}
.option-item:last-child { border-bottom: none; }
.option-item:active { background: var(--echo-bg); }
.option-item.selected { background: #f0fdf4; }

.option-body { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
.option-icon {
  width: 40px; height: 40px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.option-label {
  font-size: var(--echo-text-md);
  font-weight: var(--echo-weight-medium);
  color: var(--echo-text);
  margin-bottom: 2px;
}
.option-hint {
  font-size: var(--echo-text-xs);
  color: var(--echo-text-hint);
}
.option-check { flex-shrink: 0; margin-left: 8px; }

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
