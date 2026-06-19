<template>
  <div class="sub-page">
    <!-- 顶部 -->
    <div class="page-header">
      <div class="nav-back" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </div>
      <h2 class="page-title">默认发帖偏好</h2>
    </div>

    <!-- 主体 -->
    <div class="page-body">
      <!-- 区块1：默认匿名 -->
      <div class="section-label">默认匿名</div>
      <div class="section-hint">开启后，每次发帖将默认勾选匿名发布</div>
      <div class="option-card">
        <div class="option-item">
          <div class="option-body">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-secondary)" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            <span class="option-label">默认匿名发布</span>
          </div>
          <van-switch v-model="store.defaultAnonPost" size="22" active-color="var(--echo-accent)" />
        </div>
      </div>

      <!-- 联动提示 -->
      <div v-if="store.defaultAnonPost" class="rule-tip">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>开启默认匿名后，可见范围将固定为「所有人可见」，本校限制将关闭。发帖时仍可手动修改。</span>
      </div>

      <!-- 区块2：默认可见范围 -->
      <div class="section-label" style="margin-top:24px">默认可见范围</div>
      <div class="section-hint">设置每次发帖时默认选择的可见范围</div>
      <div class="option-card">
        <div
          v-for="opt in visibilityOptions"
          :key="opt.value"
          class="option-item option-item--radio"
          :class="{ 'option-item--selected': selectedVisibility === opt.value }"
          @click="selectedVisibility = opt.value"
        >
          <div class="option-body">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="opt.iconColor" stroke-width="2" v-html="opt.iconPath"></svg>
            <span class="option-label">{{ opt.label }}</span>
          </div>
          <div class="option-radio" :class="{ 'option-radio--active': selectedVisibility === opt.value }">
            <svg v-if="selectedVisibility === opt.value" width="16" height="16" viewBox="0 0 24 24" fill="var(--echo-primary)" stroke="var(--echo-primary)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
      </div>

      <!-- 区块3：默认本校限制 -->
      <div class="section-label" style="margin-top:24px">默认本校限制</div>
      <div class="section-hint">开启后，每次发帖将默认勾选「仅本校可见」</div>
      <div class="option-card">
        <div class="option-item">
          <div class="option-body">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-secondary)" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span class="option-label">默认开启仅本校可见</span>
          </div>
          <van-switch
            v-model="store.defaultSchoolOnly"
            :disabled="defaultSchoolOnlyDisabled"
            size="22"
            active-color="var(--echo-primary)"
          />
        </div>
      </div>

      <div v-if="defaultSchoolOnlyDisabled" class="rule-tip">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>{{ defaultSchoolOnlyHint }}</span>
      </div>

      <!-- 底部说明 -->
      <p class="page-footer">
        以上设置仅作为发帖时的默认值。每次发帖时，你仍可根据需要手动修改匿名状态、可见范围和本校限制。修改默认偏好不会影响已发布的历史帖子。
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '@/stores/app.js'
const store = useAppStore()

const visibilityOptions = [
  {
    value: 'private',
    label: '完全私密',
    iconColor: '#e74c3c',
    iconPath: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
  },
  {
    value: 'followers',
    label: '仅关注者可见',
    iconColor: '#f39c12',
    iconPath: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'
  },
  {
    value: 'mutual',
    label: '仅互关者可见',
    iconColor: '#7c3aed',
    iconPath: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M15 10l4 4"/><path d="M9 14l-4 4"/>'
  },
  {
    value: 'everyone',
    label: '所有人可见',
    iconColor: '#4caf7d',
    iconPath: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'
  }
]

// 与 store 同步的本地选中状态
const selectedVisibility = ref(store.defaultVisibility)

watch(selectedVisibility, (val) => {
  store.defaultVisibility = val
})

// 联动规则：默认匿名开启时 → 强制所有人可见 + 禁用本校可见
watch(() => store.defaultAnonPost, (val) => {
  if (val) {
    selectedVisibility.value = 'everyone'
    store.defaultSchoolOnly = false
  }
})

// 默认可见范围切换联动
watch(() => store.defaultVisibility, (val) => {
  if (val === 'private') {
    store.defaultSchoolOnly = false
  }
})

// 本校限制禁用条件
const defaultSchoolOnlyDisabled = computed(() => {
  if (store.defaultAnonPost) return true
  if (selectedVisibility.value === 'private') return true
  return false
})

const defaultSchoolOnlyHint = computed(() => {
  if (store.defaultAnonPost) return '匿名发布时不支持本校可见限制'
  if (selectedVisibility.value === 'private') return '完全私密时不支持本校可见限制'
  return ''
})
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

/* 分组标签 */
.section-label {
  font-size: var(--echo-text-sm);
  color: var(--echo-text-hint);
  font-weight: var(--echo-weight-semibold);
  margin-bottom: 4px;
  padding-left: 4px;
}
.section-hint {
  font-size: var(--echo-text-xs);
  color: var(--echo-text-placeholder);
  margin-bottom: 10px;
  padding-left: 4px;
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
  transition: background var(--echo-transition-fast);
}
.option-item--radio {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.option-item--radio:active { background: var(--echo-bg); }
.option-item--selected { background: #f0faf4; }
.option-body { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.option-label { font-size: var(--echo-text-md); color: var(--echo-text); font-weight: var(--echo-weight-medium); }

.option-radio {
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 2px solid var(--echo-border);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all var(--echo-transition-fast);
}
.option-radio--active {
  border-color: var(--echo-primary);
  background: var(--echo-primary);
}

/* 联动规则提示 */
.rule-tip {
  margin-top: 10px;
  padding: 10px 14px;
  background: #fff8e1;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: var(--echo-text-xs);
  color: #8d6e00;
  line-height: 1.5;
}
.rule-tip svg { flex-shrink: 0; margin-top: 1px; }

/* 底部 */
.page-footer {
  font-size: var(--echo-text-xs);
  color: var(--echo-text-placeholder);
  text-align: center;
  padding: 28px 12px;
  margin: 0;
  line-height: 1.7;
}
</style>
