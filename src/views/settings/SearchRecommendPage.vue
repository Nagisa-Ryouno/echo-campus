<template>
  <div class="sub-page">
    <!-- 顶部 -->
    <div class="page-header">
      <div class="nav-back" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </div>
      <h2 class="page-title">搜索与推荐</h2>
    </div>

    <!-- 主体 -->
    <div class="page-body">

      <!-- ======= 第一组：搜索方式 ======= -->
      <div class="section-label">搜索方式</div>
      <div class="section-hint">决定"别人能不能用什么方式找到我"</div>
      <div class="option-card">
        <div class="option-item" :class="{ disabled: isSearchDisabled }">
          <div class="option-body">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-secondary)" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span class="option-label">允许通过昵称搜索到我</span>
          </div>
          <van-switch
            v-model="store.searchByName"
            :disabled="isSearchDisabled"
            size="22"
            active-color="var(--echo-primary)"
          />
        </div>
        <div class="option-item" :class="{ disabled: isSearchDisabled }">
          <div class="option-body">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-secondary)" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            <span class="option-label">允许通过回声号搜索到我</span>
          </div>
          <van-switch
            v-model="store.searchByEchoId"
            :disabled="isSearchDisabled"
            size="22"
            active-color="var(--echo-primary)"
          />
        </div>
      </div>

      <!-- ======= 第二组：搜索范围 ======= -->
      <div class="section-label" style="margin-top: 20px;">搜索范围</div>
      <div class="section-hint">决定"谁可以搜索到我"</div>
      <div class="option-card">
        <div
          v-for="opt in scopeOptions"
          :key="opt.value"
          class="option-item"
          :class="{ selected: store.searchScope === opt.value }"
          @click="store.searchScope = opt.value"
        >
          <div class="option-body">
            <div class="option-radio" :class="{ active: store.searchScope === opt.value }">
              <div v-if="store.searchScope === opt.value" class="radio-dot"></div>
            </div>
            <div>
              <div class="option-label">{{ opt.label }}</div>
              <div class="option-hint">{{ opt.hint }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索方式禁用提示 -->
      <p v-if="isSearchDisabled" class="inline-hint">
        ⓘ 当"不允许被任何人搜索"时，搜索方式将不可用
      </p>

      <!-- ======= 第三组：推荐控制 ======= -->
      <div class="section-label" style="margin-top: 20px;">推荐控制</div>
      <div class="section-hint">决定"我是否会出现在遇见频道中"</div>
      <div class="option-card">
        <div class="option-item">
          <div class="option-body">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-secondary)" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span class="option-label">允许在遇见频道被推荐</span>
          </div>
          <van-switch
            v-model="store.allowRecommend"
            size="22"
            active-color="var(--echo-primary)"
          />
        </div>
      </div>

      <!-- 底部说明 -->
      <p class="page-footer">
        搜索方式决定别人用什么方式找到你；搜索范围决定谁可以搜索到你；推荐控制独立于搜索规则，仅影响遇见频道。
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app.js'
const store = useAppStore()

const scopeOptions = [
  { value: 'everyone', label: '允许被所有人搜索', hint: '所有校声用户都能搜索到你' },
  { value: 'school_only', label: '仅允许本校用户搜索', hint: '只有同校用户能搜索到你' },
  { value: 'nobody', label: '不允许被任何人搜索', hint: '你的账号将不会出现在任何搜索结果中' }
]

const isSearchDisabled = computed(() => store.searchScope === 'nobody')
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

/* 分组标签 */
.section-label {
  font-size: var(--echo-text-sm);
  color: var(--echo-text-hint);
  font-weight: var(--echo-weight-semibold);
  margin-bottom: 4px;
  padding-left: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  border-bottom: 1px solid var(--echo-divider);
  transition: background var(--echo-transition-fast);
}
.option-item:last-child { border-bottom: none; }
.option-item.selected { background: #f0fdf4; }
.option-item.disabled { opacity: 0.45; pointer-events: none; }

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

/* 内联提示 */
.inline-hint {
  font-size: var(--echo-text-xs);
  color: var(--echo-warning, #f59e0b);
  padding: 8px 12px;
  margin: 8px 0 0;
  background: #fff8e1;
  border-radius: 8px;
  line-height: 1.5;
}

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
