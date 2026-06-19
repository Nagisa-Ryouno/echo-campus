<template>
  <div class="login-page">
    <!-- 返回按钮 -->
    <div class="nav-back" @click="$router.back()">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </div>

    <div class="login-body">
      <!-- Brand 标识 -->
      <div class="brand-area">
        <div class="brand-icon">校</div>
        <h2 class="brand-title">校声 Echo Campus</h2>
        <p class="brand-desc">属于大学生的社交空间</p>
      </div>

      <!-- 表单 -->
      <div class="login-form">
        <!-- 账号 -->
        <div class="form-group">
          <label class="form-label">账号</label>
          <div class="input-wrap">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input
              v-model="form.account"
              type="text"
              class="input-field"
              placeholder="校声号 / 校园邮箱"
              @keyup.enter="handleLogin"
            />
          </div>
        </div>

        <!-- 密码 -->
        <div class="form-group">
          <label class="form-label">密码</label>
          <div class="input-wrap">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input
              v-model="form.password"
              :type="showPwd ? 'text' : 'password'"
              class="input-field"
              placeholder="输入密码"
              @keyup.enter="handleLogin"
            />
            <span class="pwd-toggle" @click="showPwd = !showPwd">
              <svg v-if="showPwd" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </span>
          </div>
        </div>

        <!-- 登录按钮 -->
        <button
          class="login-btn"
          :class="{ 'login-btn--loading': loading }"
          :disabled="loading || !canLogin"
          @click="handleLogin"
        >
          <span v-if="loading" class="btn-spinner"></span>
          <span v-else>登录</span>
        </button>

        <!-- 底部链接 -->
        <div class="login-links">
          <span @click="$router.push('/register')">没有账号？去注册</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useAppStore } from '@/stores/app.js'

const router = useRouter()
const store = useAppStore()

const form = reactive({ account: '', password: '' })
const showPwd = ref(false)
const loading = ref(false)

const canLogin = computed(() =>
  form.account.trim().length > 0 && form.password.trim().length > 0
)

function handleLogin() {
  if (!canLogin.value) return
  loading.value = true

  // 模拟登录：直接以当前用户 u1 登录
  setTimeout(() => {
    store.login('u1')
    loading.value = false
    showToast('登录成功')
    router.replace('/home')
  }, 800)
}
</script>

<style scoped>
.login-page {
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

.login-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px 60px;
}

/* ===== Brand ===== */
.brand-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.brand-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--echo-primary), #2e8b57);
  color: #fff;
  font-size: 36px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(76, 175, 125, 0.3);
  margin-bottom: 16px;
}

.brand-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--echo-text);
  margin-bottom: 4px;
}

.brand-desc {
  font-size: 13px;
  color: var(--echo-text-hint);
}

/* ===== 表单 ===== */
.login-form {
  width: 100%;
  max-width: 320px;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--echo-text);
  margin-bottom: 6px;
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--echo-white);
  border: 1.5px solid var(--echo-border);
  border-radius: var(--echo-radius-sm);
  padding: 0 12px;
  transition: all 0.2s;
}

.input-wrap:focus-within {
  border-color: var(--echo-primary);
  box-shadow: 0 0 0 3px rgba(76, 175, 125, 0.1);
}

.input-icon {
  color: var(--echo-text-hint);
  flex-shrink: 0;
}

.input-field {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: var(--echo-text);
  padding: 13px 0;
  background: transparent;
  font-family: inherit;
}

.input-field::placeholder {
  color: var(--echo-text-hint);
}

.pwd-toggle {
  color: var(--echo-text-hint);
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
}

.pwd-toggle:active {
  color: var(--echo-primary);
}

/* ===== 登录按钮 ===== */
.login-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: var(--echo-radius-sm);
  background: var(--echo-primary);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}

.login-btn:active:not(:disabled) {
  transform: scale(0.98);
  background: var(--echo-primary-dark);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-btn--loading {
  opacity: 0.8;
}

.btn-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== 底部链接 ===== */
.login-links {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: var(--echo-primary);
  cursor: pointer;
  font-weight: 500;
}

.login-links span:active {
  opacity: 0.7;
}
</style>
