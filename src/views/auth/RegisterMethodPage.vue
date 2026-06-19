<template>
  <div class="method-page">
    <!-- 返回按钮 -->
    <div class="nav-back" @click="$router.back()">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </div>

    <div class="method-body">
      <!-- 标题 -->
      <div class="method-header">
        <h2 class="method-title">选择注册方式</h2>
        <p class="method-desc">校声仅对在校大学生开放，请选择验证方式</p>
      </div>

      <!-- 两种注册方式 -->
      <div class="method-cards">
        <!-- 校园邮箱注册 -->
        <div class="method-card" @click="$router.push('/register/email')">
          <div class="method-card-icon method-card-icon--email">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>
          </div>
          <div class="method-card-content">
            <h3>校园邮箱注册</h3>
            <p>使用 .edu.cn 结尾的校园邮箱快速认证</p>
          </div>
          <svg class="method-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>

        <!-- 学生证审核 -->
        <div class="method-card" @click="$router.push('/register/student-id')">
          <div class="method-card-icon method-card-icon--id">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="8" x2="10" y2="8"/><line x1="6" y1="12" x2="14" y2="12"/><line x1="6" y1="16" x2="12" y2="16"/></svg>
          </div>
          <div class="method-card-content">
            <h3>学生证审核</h3>
            <p>上传学生证照片，人工审核通过后注册</p>
          </div>
          <svg class="method-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      <!-- 底部提示 -->
      <p class="method-footer">
        已有账号？<span class="method-link" @click="$router.push('/login')">去登录</span>
      </p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.method-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--echo-bg);
  position: relative;
}

.nav-back {
  position: absolute;
  top: 16px;
  left: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--echo-text);
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.2s;
}

.nav-back:active {
  transform: scale(0.95);
  background: var(--echo-bg);
}

.method-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 80px 24px 40px;
}

/* ===== 标题 ===== */
.method-header {
  margin-bottom: 32px;
}

.method-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--echo-text);
  margin-bottom: 8px;
}

.method-desc {
  font-size: 14px;
  color: var(--echo-text-secondary);
  line-height: 1.5;
}

/* ===== 方式卡片 ===== */
.method-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.method-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--echo-white);
  border-radius: var(--echo-radius);
  padding: 18px 16px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1.5px solid transparent;
}

.method-card:active {
  transform: scale(0.98);
  border-color: var(--echo-primary);
  box-shadow: 0 4px 16px rgba(76, 175, 125, 0.15);
}

.method-card-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.method-card-icon--email {
  background: #e8f5ee;
  color: var(--echo-primary);
}

.method-card-icon--id {
  background: #fff3e8;
  color: var(--echo-accent);
}

.method-card-content {
  flex: 1;
  min-width: 0;
}

.method-card-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--echo-text);
  margin-bottom: 4px;
}

.method-card-content p {
  font-size: 13px;
  color: var(--echo-text-hint);
  line-height: 1.4;
}

.method-arrow {
  color: var(--echo-text-hint);
  flex-shrink: 0;
}

/* ===== 底部 ===== */
.method-footer {
  text-align: center;
  margin-top: auto;
  padding-top: 32px;
  font-size: 14px;
  color: var(--echo-text-secondary);
}

.method-link {
  color: var(--echo-primary);
  font-weight: 600;
  cursor: pointer;
}

.method-link:active {
  opacity: 0.7;
}
</style>
