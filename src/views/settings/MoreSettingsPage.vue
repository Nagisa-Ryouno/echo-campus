<template>
  <div class="sub-page">
    <!-- 顶部 -->
    <div class="page-header">
      <div class="nav-back" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </div>
      <h2 class="page-title">更多设置</h2>
    </div>

    <!-- 主体 -->
    <div class="page-body">
      <div class="section-label">匿名消息</div>
      <div class="section-hint">控制是否接收来自匿名用户的私信消息</div>

      <div class="option-card">
        <div class="option-item">
          <div class="option-body">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-secondary)" stroke-width="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            <span class="option-label">允许匿名用户给我发消息</span>
          </div>
          <van-switch v-model="store.allowAnonMessage" size="22" active-color="var(--echo-primary)" />
        </div>
      </div>

      <!-- 底部说明 -->
      <p class="page-footer">
        关闭后，匿名用户将无法向你发送私信消息。已存在的匿名会话不受影响。
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app.js'
const store = useAppStore()
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
  transition: background var(--echo-transition-fast);
}
.option-body { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
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
