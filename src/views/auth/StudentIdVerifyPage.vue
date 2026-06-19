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
            <div class="select-wrap" @click="showSchoolPicker = true">
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

const canSubmit = computed(() =>
  form.realName.trim() && form.school && form.studentId.trim() && form.imageName
)

function selectSchool(s) {
  form.school = s
  showSchoolPicker.value = false
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
