<template>
  <div class="sub-page">
    <!-- 顶部 -->
    <div class="page-header">
      <div class="nav-back" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </div>
      <h2 class="page-title">内容发布权限</h2>
    </div>

    <!-- 主体 -->
    <div class="page-body">

      <!-- ======= 第一块：默认可见范围 ======= -->
      <div class="section-label">默认可见范围</div>
      <div class="section-hint">决定你发帖时的基础权限</div>
      <div class="option-card">
        <div
          v-for="opt in visibilityOptions"
          :key="opt.value"
          class="option-item"
          :class="{ selected: store.defaultVisibility === opt.value }"
          @click="store.defaultVisibility = opt.value"
        >
          <div class="option-body">
            <div class="option-radio" :class="{ active: store.defaultVisibility === opt.value }">
              <div v-if="store.defaultVisibility === opt.value" class="radio-dot"></div>
            </div>
            <div>
              <div class="option-label">{{ opt.label }}</div>
              <div class="option-hint">{{ opt.hint }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ======= 第二块：本校限制 ======= -->
      <div class="section-label" style="margin-top: 20px;">本校可见限制</div>
      <div class="section-hint">决定你的内容是否仅在本校展示</div>
      <div class="option-card">
        <div class="option-item" :class="{ disabled: isSchoolOnlyDisabled }">
          <div class="option-body">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-secondary)" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span class="option-label">仅本校可见</span>
          </div>
          <van-switch
            v-model="store.schoolOnlyContent"
            :disabled="isSchoolOnlyDisabled"
            size="22"
            active-color="var(--echo-primary)"
          />
        </div>
      </div>

      <!-- 联动提示 -->
      <p v-if="isSchoolOnlyDisabled" class="inline-hint">
        ⓘ 当默认可见范围为"完全私密"或已开启"允许匿名发帖"时，"仅本校可见"不可用
      </p>

      <!-- ======= 第三块：匿名规则 ======= -->
      <div class="section-label" style="margin-top: 20px;">匿名规则</div>
      <div class="section-hint">决定你是否可以匿名表达</div>
      <div class="option-card">
        <div class="option-item">
          <div class="option-body">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-secondary)" stroke-width="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            <span class="option-label">允许匿名发帖</span>
          </div>
          <van-switch
            v-model="store.allowAnonPost"
            size="22"
            active-color="var(--echo-primary)"
            @change="onAnonPostChange"
          />
        </div>
        <div class="option-item">
          <div class="option-body">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-secondary)" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span class="option-label">允许匿名评论</span>
          </div>
          <van-switch v-model="store.allowAnonComment" size="22" active-color="var(--echo-primary)" />
        </div>
      </div>

      <!-- 联动提示 -->
      <p v-if="store.allowAnonPost && store.defaultVisibility !== 'everyone'" class="inline-hint warn">
        ⚠ 开启匿名发帖后，建议将默认可见范围设为"所有人可见"，以确保匿名身份不被推测。
      </p>

      <!-- ======= 第四块：内容分发规则说明 ======= -->
      <div class="rule-card" style="margin-top: 20px;">
        <div class="rule-title">内容分发规则说明</div>
        <ul class="rule-list">
          <li>所有公开内容将经过平台内容审核</li>
          <li>匿名内容不会显示你的真实身份信息</li>
          <li>完全私密的内容仅自己可见，不会出现在任何频道</li>
          <li>仅关注者可见的内容仅在你和关注者的信息流中出现</li>
          <li>本校可见限制将叠加在默认可见范围之上</li>
        </ul>
      </div>

      <!-- 底部说明 -->
      <p class="page-footer">
        默认可见范围决定发帖时的基础权限，本校限制决定内容是否仅在本校展示，匿名规则决定你是否可匿名表达。
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useAppStore } from '@/stores/app.js'

const store = useAppStore()

const visibilityOptions = [
  { value: 'private', label: '完全私密', hint: '仅自己可见，不会出现在任何公开频道' },
  { value: 'followers', label: '仅关注者可见', hint: '仅你和你关注的用户可以看到' },
  { value: 'everyone', label: '所有人可见', hint: '所有校声用户都能看到你的内容' }
]

// 联动规则1：完全私密 → 禁止本校可见
// 联动规则2：匿名发帖 → 禁止本校可见
const isSchoolOnlyDisabled = computed(() => {
  return store.defaultVisibility === 'private' || store.allowAnonPost
})

// 联动规则3：当开启匿名发帖且默认不是公开时，自动切换到公开
function onAnonPostChange(val) {
  if (val && store.defaultVisibility !== 'everyone') {
    store.defaultVisibility = 'everyone'
  }
}

// 联动规则4：当完全私密时关闭本校可见
watch(() => store.defaultVisibility, (val) => {
  if (val === 'private') {
    store.schoolOnlyContent = false
  }
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
  cursor: pointer;
}
.option-item:last-child { border-bottom: none; }
.option-item:active { background: var(--echo-bg); }
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
  color: var(--echo-text-secondary);
  padding: 8px 12px;
  margin: 8px 0 0;
  background: #eef6f0;
  border-radius: 8px;
  line-height: 1.5;
}
.inline-hint.warn {
  background: #fff8e1;
  color: var(--echo-warning, #f59e0b);
}

/* 规则卡片 */
.rule-card {
  background: var(--echo-white);
  border-radius: var(--echo-radius);
  padding: 16px;
  border: 1px solid var(--echo-divider);
}
.rule-title {
  font-size: var(--echo-text-sm);
  font-weight: var(--echo-weight-semibold);
  color: var(--echo-text);
  margin-bottom: 10px;
}
.rule-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.rule-list li {
  font-size: var(--echo-text-xs);
  color: var(--echo-text-secondary);
  padding-left: 16px;
  position: relative;
  line-height: 1.5;
}
.rule-list li::before {
  content: '·';
  position: absolute;
  left: 4px;
  color: var(--echo-primary);
  font-weight: bold;
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
