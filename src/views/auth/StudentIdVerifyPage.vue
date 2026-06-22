<template>
  <div class="id-verify-page">
    <!-- 返回按钮 -->
    <div class="nav-back" @click="$router.back()">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </div>

    <div class="id-verify-body">
      <!-- 未提交状态 -->
      <template v-if="!submitted">
        <div class="section-header">
          <div class="section-icon">🪪</div>
          <h3 class="section-title">学生证身份审核</h3>
          <p class="section-desc">请上传清晰的学生证照片，审核通过后即可完成注册</p>
        </div>

        <!-- 表单区 -->
        <div class="form-area">
          <div class="form-group">
            <label class="field-label">真实姓名</label>
            <input v-model="form.realName" class="field-input" placeholder="与身份证一致" />
          </div>

          <div class="form-group">
            <label class="field-label">学校</label>
            <div class="select-wrap" @click="openSchoolPicker">
              <span :class="{ placeholder: !form.school }">{{ form.school || '请选择学校' }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>

          <div class="form-group">
            <label class="field-label">学号</label>
            <input v-model="form.studentId" class="field-input" placeholder="请输入学号" />
          </div>

          <!-- 学生证上传区 -->
          <div class="form-group">
            <label class="field-label">学生证照片</label>
            <div class="upload-area" :class="{ 'upload-area--has': form.imageName }" @click="simulateUpload">
              <template v-if="!form.imageName">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <p class="upload-text">点击上传学生证封面</p>
                <p class="upload-hint">支持 jpg / png，大小不超过 5MB</p>
              </template>
              <template v-else>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--echo-primary)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                <p class="upload-text" style="color:var(--echo-primary);">{{ form.imageName }}</p>
                <p class="upload-hint">点击重新上传</p>
              </template>
            </div>
          </div>

          <!-- 审核说明 -->
          <div class="audit-notice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>审核通常在 1-2 个工作日内完成，请耐心等待</span>
          </div>

          <!-- 提交按钮 -->
          <button
            class="submit-btn"
            :disabled="!canSubmit"
            @click="handleSubmit"
          >提交审核</button>
        </div>
      </template>

      <!-- 已提交状态 -->
      <template v-else>
        <div class="submitted-area">
          <div class="submitted-icon">📬</div>
          <h3 class="submitted-title">审核已提交</h3>
          <p class="submitted-desc">我们正在审核你的学生证信息，审核结果将通过短信和站内通知发送给你</p>
          <div class="submitted-info">
            <div class="submitted-row">
              <span class="submitted-label">姓名</span>
              <span>{{ form.realName }}</span>
            </div>
            <div class="submitted-row">
              <span class="submitted-label">学校</span>
              <span>{{ form.school }}</span>
            </div>
            <div class="submitted-row">
              <span class="submitted-label">学号</span>
              <span>{{ form.studentId }}</span>
            </div>
            <div class="submitted-row">
              <span class="submitted-label">状态</span>
              <span class="status-pending">审核中</span>
            </div>
          </div>
          <button class="submit-btn submit-btn--outline" @click="$router.replace('/login')">返回登录</button>
        </div>
      </template>
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

const router = useRouter()

const submitted = ref(false)
const showSchoolPicker = ref(false)

const form = reactive({
  realName: '',
  school: '',
  studentId: '',
  imageName: ''
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

const canSubmit = computed(() =>
  form.realName.trim() && form.school && form.studentId.trim() && form.imageName
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

function simulateUpload() {
  // 模拟上传
  form.imageName = 'student_card_2024.jpg'
  showToast('上传成功（模拟）')
}

function handleSubmit() {
  if (!canSubmit.value) return
  submitted.value = true
  showToast('审核已提交')
}
</script>

<style scoped>
.id-verify-page {
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

.id-verify-body {
  flex: 1;
  padding: 80px 24px 40px;
}

/* ===== 标题 ===== */
.section-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 28px;
}

.section-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--echo-text);
  margin-bottom: 6px;
}

.section-desc {
  font-size: 13px;
  color: var(--echo-text-hint);
  text-align: center;
  line-height: 1.5;
}

/* ===== 表单 ===== */
.form-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

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

/* ===== 上传区 ===== */
.upload-area {
  width: 100%;
  max-width: 320px;
  border: 2px dashed var(--echo-border);
  border-radius: var(--echo-radius);
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--echo-text-hint);
  background: #fafbfc;
}

.upload-area:active {
  border-color: var(--echo-primary);
  background: var(--echo-primary-light);
}

.upload-area--has {
  border-style: solid;
  border-color: var(--echo-primary);
  background: var(--echo-primary-light);
}

.upload-text {
  font-size: 14px;
  font-weight: 500;
}

.upload-hint {
  font-size: 12px;
}

/* ===== 审核说明 ===== */
.audit-notice {
  width: 100%;
  max-width: 320px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 14px;
  background: #fff8e1;
  border-radius: var(--echo-radius-sm);
  font-size: 12px;
  color: #8d6e00;
  line-height: 1.5;
  margin: 8px 0 20px;
  box-sizing: border-box;
}

.audit-notice svg {
  flex-shrink: 0;
  margin-top: 1px;
}

/* ===== 提交按钮 ===== */
.submit-btn {
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
  transition: all 0.2s;
  font-family: inherit;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
  background: var(--echo-primary-dark);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn--outline {
  background: transparent;
  border: 1.5px solid var(--echo-primary);
  color: var(--echo-primary);
}

.submit-btn--outline:active {
  background: var(--echo-primary-light);
}

/* ===== 已提交 ===== */
.submitted-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.submitted-icon {
  font-size: 56px;
  margin-bottom: 12px;
}

.submitted-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--echo-text);
  margin-bottom: 8px;
}

.submitted-desc {
  font-size: 13px;
  color: var(--echo-text-secondary);
  text-align: center;
  line-height: 1.6;
  margin-bottom: 24px;
  max-width: 280px;
}

.submitted-info {
  width: 100%;
  max-width: 320px;
  background: var(--echo-white);
  border-radius: var(--echo-radius);
  padding: 16px;
  margin-bottom: 28px;
}

.submitted-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 14px;
  border-bottom: 1px solid var(--echo-border);
}

.submitted-row:last-child {
  border-bottom: none;
}

.submitted-label {
  color: var(--echo-text-hint);
}

.status-pending {
  color: var(--echo-warning);
  font-weight: 600;
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
