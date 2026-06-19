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
          <div class="select-wrap" @click="showSchoolPicker = true">
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

    <!-- 学校选择弹窗（简易版） -->
    <Teleport to="#phone-screen">
      <transition name="panel-slide">
        <div v-if="showSchoolPicker" class="picker-overlay" @click.self="showSchoolPicker = false">
          <div class="picker-sheet">
            <div class="picker-header">
              <h3>选择学校</h3>
              <span class="picker-close" @click="showSchoolPicker = false">取消</span>
            </div>
            <div class="picker-list">
              <div
                v-for="s in schoolList"
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

const canSendCode = computed(() =>
  form.school && form.email.trim().includes('.edu.cn')
)

const canComplete = computed(() =>
  form.nickname.trim() && form.studentId.trim() &&
  form.password.length >= 8 && form.password === form.confirmPassword
)

function selectSchool(s) {
  form.school = s
  showSchoolPicker.value = false
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
  background: rgba(0,0,0,0.45);
  z-index: 500;
  display: flex;
  align-items: flex-end;
  max-width: 375px;
  box-sizing: border-box;
}

.picker-sheet {
  width: 100%;
  max-width: 375px;
  background: var(--echo-white);
  border-radius: 16px 16px 0 0;
  padding: 20px 16px 36px;
  box-sizing: border-box;
  max-height: 55vh;
  overflow-y: auto;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.picker-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.picker-close {
  font-size: 15px;
  color: var(--echo-primary);
  cursor: pointer;
}

.picker-list {
  display: flex;
  flex-direction: column;
}

.picker-item {
  padding: 14px 0;
  font-size: 15px;
  color: var(--echo-text);
  border-bottom: 1px solid var(--echo-border);
  cursor: pointer;
  transition: all 0.15s;
}

.picker-item.active {
  color: var(--echo-primary);
  font-weight: 600;
}

.picker-item:active {
  background: var(--echo-bg);
}

/* ===== 动画 ===== */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.3s ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
}

.panel-slide-enter-from .picker-sheet,
.panel-slide-leave-to .picker-sheet {
  transform: translateY(100%);
}
</style>
