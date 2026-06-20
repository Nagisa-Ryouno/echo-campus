<template>
  <div class="email-reg-page">
    <!-- 返回按钮 -->
    <div class="nav-back" @click="$router.back()">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </div>

    <!-- 进度条 -->
    <div class="step-bar">
      <div class="step active">
        <span class="step-num">1</span>
        <span class="step-text">邮箱验证</span>
      </div>
      <div class="step-line" :class="{ active: currentStep >= 2 }"></div>
      <div class="step" :class="{ active: currentStep >= 2 }">
        <span class="step-num">2</span>
        <span class="step-text">设置信息</span>
      </div>
      <div class="step-line" :class="{ active: currentStep >= 3 }"></div>
      <div class="step" :class="{ active: currentStep >= 3 }">
        <span class="step-num">3</span>
        <span class="step-text">完成</span>
      </div>
    </div>

    <div class="email-reg-body">
      <!-- Step 1: 校园邮箱验证 -->
      <div v-if="currentStep === 1" class="step-content">
        <div class="step-icon">📧</div>
        <h3 class="step-title">验证校园邮箱</h3>
        <p class="step-desc">请使用以 .edu.cn 结尾的校园邮箱，我们将发送验证码</p>

        <!-- 选择学校 -->
        <div class="form-group">
          <label class="field-label">学校</label>
          <div class="select-wrap" @click="openSchoolPicker">
            <span :class="{ placeholder: !form.school }">{{ form.school || '请选择学校' }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        <!-- 邮箱 -->
        <div class="form-group">
          <label class="field-label">校园邮箱</label>
          <input
            v-model="form.email"
            type="email"
            class="field-input"
            placeholder="例如：20240001@muc.edu.cn"
          />
        </div>

        <!-- 发送验证码 -->
        <button
          v-if="!codeSent"
          class="step-btn"
          :disabled="!canSendCode"
          @click="sendCode"
        >发送验证码</button>

        <!-- 输入验证码 -->
        <div v-else class="form-group">
          <label class="field-label">验证码（模拟：输入 123456）</label>
          <input
            v-model="form.code"
            type="text"
            class="field-input"
            placeholder="输入 6 位验证码"
            maxlength="6"
            @keyup.enter="verifyCode"
          />
          <button
            class="step-btn"
            style="margin-top: 12px;"
            :disabled="form.code.length < 6"
            @click="verifyCode"
          >验证并继续</button>
          <p class="resend-hint" @click="sendCode">重新发送验证码</p>
        </div>
      </div>

      <!-- Step 2: 设置个人信息 -->
      <div v-if="currentStep === 2" class="step-content">
        <div class="step-icon">👤</div>
        <h3 class="step-title">设置个人信息</h3>
        <p class="step-desc">完善你的个人资料</p>

        <div class="form-group">
          <label class="field-label">昵称</label>
          <input v-model="form.nickname" class="field-input" placeholder="起个好听的名字吧" />
        </div>

        <div class="form-group">
          <label class="field-label">学号</label>
          <input v-model="form.studentId" class="field-input" placeholder="请输入学号" />
        </div>

        <div class="form-group">
          <label class="field-label">密码</label>
          <input v-model="form.password" type="password" class="field-input" placeholder="8 位以上密码" />
        </div>

        <div class="form-group">
          <label class="field-label">确认密码</label>
          <input v-model="form.confirmPassword" type="password" class="field-input" placeholder="再次输入密码" />
        </div>

        <button
          class="step-btn"
          :disabled="!canComplete"
          @click="completeRegister"
        >完成注册</button>
      </div>

      <!-- Step 3: 注册成功 -->
      <div v-if="currentStep === 3" class="step-content">
        <div class="success-icon">🎉</div>
        <h3 class="success-title">注册成功！</h3>
        <p class="success-desc">欢迎加入校声，开始探索吧</p>
        <button class="step-btn" @click="goHome">进入首页</button>
      </div>
    </div>

    <!-- 学校选择弹窗 -->
    <Teleport to="#phone-screen">
      <transition name="dialog-fade">
        <div v-if="showSchoolPicker" class="picker-overlay" @click.self="showSchoolPicker = false">
          <div class="picker-sheet">
            <div class="picker-header">
              <h3>选择学校</h3>
              <span class="picker-close" @click="showSchoolPicker = false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </span>
            </div>

            <!-- 搜索栏 -->
            <div class="picker-search-bar">
              <svg class="picker-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                v-model="schoolSearchQuery"
                type="text"
                class="picker-search-input"
                placeholder="搜索学校名称"
              />
              <span v-if="schoolSearchQuery" class="picker-search-clear" @click="schoolSearchQuery = ''">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </span>
            </div>

            <!-- 学校列表 -->
            <div class="picker-list">
              <div v-if="filteredSchools.length === 0" class="picker-empty">
                未找到相关学校
              </div>
              <div
                v-else
                v-for="s in filteredSchools"
                :key="s"
                class="picker-item"
                :class="{ active: form.school === s }"
                @click="selectSchool(s)"
              >{{ s }}</div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useAppStore } from '@/stores/app.js'

const router = useRouter()
const store = useAppStore()

const currentStep = ref(1)
const codeSent = ref(false)
const showSchoolPicker = ref(false)

const form = reactive({
  school: '',
  email: '',
  code: '',
  nickname: '',
  studentId: '',
  password: '',
  confirmPassword: ''
})

const schoolList = [
  '中央民族大学', '北京大学', '清华大学', '中国人民大学',
  '北京理工大学', '北京外国语大学', '北京师范大学',
  '中国传媒大学', '北京邮电大学', '北京航空航天大学'
]

const schoolSearchQuery = ref('')
const filteredSchools = computed(() => {
  const q = schoolSearchQuery.value.trim().toLowerCase()
  if (!q) return schoolList
  return schoolList.filter(s => s.toLowerCase().includes(q))
})

const canSendCode = computed(() =>
  form.school && form.email.trim().includes('.edu.cn')
)

const canComplete = computed(() =>
  form.nickname.trim() && form.studentId.trim() &&
  form.password.length >= 8 && form.password === form.confirmPassword
)

function openSchoolPicker() {
  schoolSearchQuery.value = ''
  showSchoolPicker.value = true
}

function selectSchool(s) {
  form.school = s
  showSchoolPicker.value = false
  schoolSearchQuery.value = ''
}

function sendCode() {
  if (!canSendCode.value) return
  codeSent.value = true
  showToast('验证码已发送（模拟：123456）')
}

function verifyCode() {
  if (form.code.trim() === '123456') {
    showToast('验证成功')
    currentStep.value = 2
  } else {
    showToast('验证码错误（提示：123456）')
  }
}

function completeRegister() {
  if (!canComplete.value) return
  // 模拟注册
  setTimeout(() => {
    store.login('u1')
    currentStep.value = 3
    showToast('注册成功')
  }, 600)
}

function goHome() {
  router.replace('/home')
}
</script>

<style scoped>
.email-reg-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--echo-bg);
  position: relative;
  min-height: 100%;
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
}

/* ===== 步骤条 ===== */
.step-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 32px 0;
  gap: 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--echo-border);
  color: var(--echo-text-hint);
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.step.active .step-num {
  background: var(--echo-primary);
  color: #fff;
  box-shadow: 0 4px 12px rgba(76, 175, 125, 0.3);
}

.step-text {
  font-size: 11px;
  color: var(--echo-text-hint);
  transition: color 0.3s;
}

.step.active .step-text {
  color: var(--echo-primary);
  font-weight: 600;
}

.step-line {
  width: 48px;
  height: 2px;
  background: var(--echo-border);
  margin: 0 4px;
  margin-bottom: 18px;
  transition: background 0.3s;
}

.step-line.active {
  background: var(--echo-primary);
}

/* ===== 内容区 ===== */
.email-reg-body {
  flex: 1;
  padding: 24px 24px 40px;
}

.step-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.step-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--echo-text);
  margin-bottom: 6px;
}

.step-desc {
  font-size: 13px;
  color: var(--echo-text-hint);
  margin-bottom: 24px;
  text-align: center;
}

/* ===== 成功 ===== */
.success-icon {
  font-size: 64px;
  margin-bottom: 12px;
}

.success-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--echo-text);
  margin-bottom: 6px;
}

.success-desc {
  font-size: 14px;
  color: var(--echo-text-secondary);
  margin-bottom: 32px;
}

/* ===== 表单 ===== */
.form-group {
  width: 100%;
  max-width: 320px;
  margin-bottom: 14px;
}

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--echo-text);
  margin-bottom: 6px;
}

.field-input {
  width: 100%;
  padding: 13px 14px;
  border: 1.5px solid var(--echo-border);
  border-radius: var(--echo-radius-sm);
  font-size: 15px;
  color: var(--echo-text);
  background: var(--echo-white);
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
  box-sizing: border-box;
}

.field-input:focus {
  border-color: var(--echo-primary);
  box-shadow: 0 0 0 3px rgba(76, 175, 125, 0.1);
}

.field-input::placeholder {
  color: var(--echo-text-hint);
}

.select-wrap {
  width: 100%;
  padding: 13px 14px;
  border: 1.5px solid var(--echo-border);
  border-radius: var(--echo-radius-sm);
  font-size: 15px;
  background: var(--echo-white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--echo-text);
  box-sizing: border-box;
}

.select-wrap .placeholder {
  color: var(--echo-text-hint);
}

.step-btn {
  width: 100%;
  max-width: 320px;
  padding: 14px;
  border: none;
  border-radius: var(--echo-radius-sm);
  background: var(--echo-primary);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
  transition: all 0.2s;
  font-family: inherit;
}

.step-btn:active:not(:disabled) {
  transform: scale(0.98);
  background: var(--echo-primary-dark);
}

.step-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.resend-hint {
  text-align: center;
  margin-top: 10px;
  font-size: 13px;
  color: var(--echo-primary);
  cursor: pointer;
}

/* ===== 学校选择弹窗 ===== */
.picker-overlay {
  position: absolute;
  inset: 0;
  background: rgba(18, 18, 24, 0.65); /* 暗灰色蒙层 */
  z-index: 500;
  display: flex;
  align-items: center; /* 居中 */
  justify-content: center; /* 居中 */
  max-width: 375px;
  box-sizing: border-box;
}

.picker-sheet {
  width: 300px; /* 居中长条菜单宽度 */
  max-height: 480px; /* 限高 */
  background: rgba(240, 242, 245, 0.85); /* 灰色背景 */
  backdrop-filter: blur(16px); /* 毛玻璃 */
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.25);
  padding: 18px 16px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.picker-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--echo-text);
  margin: 0;
}

.picker-close {
  display: flex;
  align-items: center;
  color: var(--echo-text-secondary);
  cursor: pointer;
  padding: 2px;
  transition: color 0.2s;
}
.picker-close:active {
  color: var(--echo-danger);
}

/* 搜索栏样式 */
.picker-search-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 0 10px;
  height: 36px;
  margin-bottom: 14px;
  flex-shrink: 0;
  box-sizing: border-box;
}

.picker-search-icon {
  color: var(--echo-text-hint);
  flex-shrink: 0;
}

.picker-search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: var(--echo-text);
  padding: 0;
}

.picker-search-input::placeholder {
  color: var(--echo-text-hint);
}

.picker-search-clear {
  color: var(--echo-text-hint);
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* 学校列表滚动区 */
.picker-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: 2px;
}

.picker-list::-webkit-scrollbar {
  width: 4px;
}
.picker-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.picker-item {
  padding: 12px 10px;
  font-size: 14px;
  color: var(--echo-text);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.15s;
  border-radius: 8px;
  margin-bottom: 2px;
}

.picker-item:last-child {
  border-bottom: none;
}

.picker-item.active {
  color: var(--echo-primary);
  background: rgba(76, 175, 125, 0.08);
  font-weight: 600;
}

.picker-item:active:not(.active) {
  background: rgba(0, 0, 0, 0.04);
}

.picker-empty {
  text-align: center;
  padding: 32px 0;
  color: var(--echo-text-hint);
  font-size: 13px;
}

/* ===== 动画 ===== */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.25s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-active .picker-sheet {
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dialog-fade-leave-active .picker-sheet {
  transition: transform 0.18s ease;
}

.dialog-fade-enter-from .picker-sheet {
  transform: scale(0.9) translateY(10px);
}

.dialog-fade-leave-to .picker-sheet {
  transform: scale(0.95) translateY(5px);
}
</style>
