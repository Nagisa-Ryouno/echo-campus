<template>
  <div class="edit-profile-page">
    <!-- 顶部导航 -->
    <div class="edit-header">
      <span class="edit-back" @click="onBack">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </span>
      <span class="edit-title">编辑资料</span>
      <span class="edit-preview" @click="onPreview">预览</span>
    </div>

    <!-- 滚动内容区 -->
    <div class="edit-scroll">
      <!-- 分组1：头像 -->
      <div class="edit-group">
        <div class="edit-row edit-row--avatar" @click="onChangeAvatar">
          <span class="edit-label">头像</span>
          <div class="edit-avatar-wrap">
            <div
              class="edit-avatar"
              :style="{ backgroundColor: form.avatarColor || '#4caf7d' }"
            >
              <span class="edit-avatar-text">{{ form.nickname?.charAt(0) || '我' }}</span>
            </div>
            <div class="edit-avatar-camera">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
          </div>
          <svg class="edit-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-hint)" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      <!-- 分组2：基础信息 -->
      <div class="edit-group">
        <div class="edit-row" @click="openEditor('nickname')">
          <span class="edit-label">名字</span>
          <span class="edit-value">{{ form.nickname }}</span>
          <svg class="edit-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-hint)" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div class="edit-row-divider"></div>
        <div class="edit-row" :class="{ 'is-disabled': echoIdLimitReached }" @click="openEchoIdEditor">
          <span class="edit-label">校声号</span>
          <div class="edit-value-wrap">
            <span class="edit-value">{{ form.echoId }}</span>
          </div>
          <svg class="edit-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-hint)" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div class="edit-row-divider"></div>
        <div class="edit-row" @click="onChangeBg">
          <span class="edit-label">背景图</span>
          <div class="edit-bg-preview" v-if="form.backgroundImage">
            <img :src="form.backgroundImage" alt="" />
          </div>
          <span class="edit-value" v-else>未设置</span>
          <svg class="edit-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-hint)" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      <!-- 分组3：个人简介 -->
      <div class="edit-group">
        <div class="edit-row" @click="openEditor('bio')">
          <span class="edit-label">个人简介</span>
          <span class="edit-value edit-value--truncate">{{ form.bio || '介绍一下自己吧' }}</span>
          <svg class="edit-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-hint)" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      <!-- 分组4：个人信息 -->
      <div class="edit-group">
        <div class="edit-row" @click="openGenderPicker">
          <span class="edit-label">性别</span>
          <span class="edit-value" :class="{ 'edit-value--hint': !form.gender }">
            {{ form.gender === 'male' ? '男' : form.gender === 'female' ? '女' : '未设置' }}
          </span>
          <svg class="edit-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-hint)" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div class="edit-row-divider"></div>
        <div class="edit-row" @click="openBirthdayPicker">
          <span class="edit-label">生日</span>
          <span class="edit-value" :class="{ 'edit-value--hint': !form.birthday }">
            {{ form.birthday || '未设置' }}
          </span>
          <svg class="edit-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-hint)" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div class="edit-row-divider"></div>
        <div class="edit-row" @click="openRegionPicker">
          <span class="edit-label">地区</span>
          <span class="edit-value" :class="{ 'edit-value--hint': !form.region }">
            {{ form.region || '未设置' }}
          </span>
          <svg class="edit-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-hint)" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      <!-- 分组5：标签 -->
      <div class="edit-group">
        <div class="edit-row" @click="openTagEditor">
          <span class="edit-label">标签</span>
          <div class="edit-value-wrap">
            <div class="edit-tags-inline" v-if="form.tags?.length">
              <span v-for="t in form.tags.slice(0, 3)" :key="t" class="edit-tag-chip">{{ t }}</span>
              <span v-if="form.tags.length > 3" class="edit-tag-more">+{{ form.tags.length - 3 }}</span>
            </div>
            <span class="edit-value edit-value--hint" v-else>添加兴趣标签</span>
          </div>
          <svg class="edit-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--echo-text-hint)" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
    </div>

    <!-- 文本编辑弹窗（通用：名字/简介）-->
    <van-dialog
      v-model:show="showTextEditor"
      :title="editorTitle"
      :show-cancel-button="true"
      :confirm-button-text="'保存'"
      confirm-button-color="#4caf7d"
      @confirm="saveTextEdit"
    >
      <div class="text-editor-body">
        <input
          v-if="editorField === 'nickname'"
          v-model="editTemp"
          class="text-editor-input"
          :placeholder="editorField === 'nickname' ? '请输入昵称' : '请输入简介'"
          maxlength="20"
          @keyup.enter="saveTextEdit"
        />
        <textarea
          v-else
          v-model="editTemp"
          class="text-editor-textarea"
          :placeholder="'请输入简介'"
          maxlength="200"
          rows="4"
        ></textarea>
        <div class="text-editor-count">
          {{ editTemp.length }} / {{ editorField === 'nickname' ? 20 : 200 }}
        </div>
      </div>
    </van-dialog>

    <!-- 校声号编辑弹窗 -->
    <van-dialog
      v-model:show="showEchoIdEditor"
      title="修改校声号"
      :show-cancel-button="true"
      :confirm-button-text="'保存'"
      confirm-button-color="#4caf7d"
      @confirm="saveEchoId"
    >
      <div class="text-editor-body">
        <div class="echo-id-hint">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--echo-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px;">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span>校声号一年仅可修改一次，请谨慎设置</span>
        </div>
        <input
          v-model="editTemp"
          class="text-editor-input"
          placeholder="请输入新校声号"
          maxlength="20"
        />
      </div>
    </van-dialog>

    <!-- 性别选择面板 -->
    <van-action-sheet
      v-model:show="showGenderPicker"
      :actions="genderOptions"
      cancel-text="取消"
      @select="onGenderSelect"
      teleport="#phone-screen"
    />

    <!-- 生日选择弹窗 -->
    <van-popup
      v-model:show="showBirthdayPicker"
      position="bottom"
      round
      teleport="#phone-screen"
    >
      <van-date-picker
        v-model="birthdayValue"
        type="date"
        title="选择生日"
        :min-date="new Date(1970, 0, 1)"
        :max-date="new Date()"
        @confirm="onBirthdayConfirm"
        @cancel="showBirthdayPicker = false"
      />
    </van-popup>

    <!-- 地区选择面板 -->
    <van-action-sheet
      v-model:show="showRegionPicker"
      :actions="regionOptions"
      cancel-text="取消"
      @select="onRegionSelect"
      teleport="#phone-screen"
    />

    <!-- 标签编辑面板 -->
    <van-action-sheet
      v-model:show="showTagEditor"
      :actions="tagActions"
      cancel-text="完成"
      @select="onTagSelect"
      teleport="#phone-screen"
    />

    <!-- 头像/背景图上传（隐藏input） -->
    <input
      ref="avatarInput"
      type="file"
      accept="image/*"
      style="display:none"
      @change="onAvatarFileChange"
    />
    <input
      ref="bgInput"
      type="file"
      accept="image/*"
      style="display:none"
      @change="onBgFileChange"
    />

    <!-- 离开确认弹窗 -->
    <van-dialog
      v-model:show="showLeaveConfirm"
      title="提示"
      message="你还有未保存的修改，确定要离开吗？"
      :show-cancel-button="true"
      confirm-button-text="离开"
      cancel-button-text="继续编辑"
      confirm-button-color="#e74c3c"
      @confirm="doLeave"
    />
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { showToast } from 'vant'

const router = useRouter()
const store = useAppStore()

// ===== 表单状态：深拷贝当前用户数据 =====
const user = store.currentUser
const form = reactive({
  nickname: user?.nickname || '',
  echoId: user?.echoId || '',
  avatarColor: user?.avatarColor || '#4caf7d',
  bio: user?.bio || '',
  gender: user?.gender || '',
  birthday: user?.birthday || '',
  region: user?.region || '',
  tags: [...(user?.tags || [])],
  backgroundImage: user?.backgroundImage || '',
  school: user?.school || ''
})

// 原始快照（用于脏检测）
const original = { ...form, tags: [...(form.tags || [])] }

// 脏状态检测
const isDirty = computed(() => {
  if (form.nickname !== original.nickname) return true
  if (form.echoId !== original.echoId) return true
  if (form.bio !== original.bio) return true
  if (form.gender !== original.gender) return true
  if (form.birthday !== original.birthday) return true
  if (form.region !== original.region) return true
  if (form.backgroundImage !== original.backgroundImage) return true
  if (JSON.stringify(form.tags) !== JSON.stringify(original.tags)) return true
  return false
})

// 校声号修改次数（今年已用过则禁）
const echoIdModifiedThisYear = ref(false)
const echoIdLimitReached = computed(() => echoIdModifiedThisYear.value)

// ===== 弹窗状态 =====
const showTextEditor = ref(false)
const showEchoIdEditor = ref(false)
const showGenderPicker = ref(false)
const showBirthdayPicker = ref(false)
const showRegionPicker = ref(false)
const showTagEditor = ref(false)
const showLeaveConfirm = ref(false)
const editorField = ref('')
const editTemp = ref('')
const birthdayValue = ref([2000, 0, 1])
const pendingLeave = ref(false)
const avatarInput = ref(null)
const bgInput = ref(null)

const editorTitle = computed(() => editorField.value === 'nickname' ? '修改名字' : '修改个人简介')

// ===== 返回拦截 =====
function onBack() {
  if (isDirty.value) {
    showLeaveConfirm.value = true
  } else {
    router.back()
  }
}

function doLeave() {
  showLeaveConfirm.value = false
  router.back()
}

// ===== 预览 =====
function onPreview() {
  showToast('预览修改后的个人主页效果')
}

// ===== 头像 =====
function onChangeAvatar() {
  avatarInput.value?.click()
}

function onAvatarFileChange(e) {
  const file = e.target.files?.[0]
  if (file) {
    showToast('头像已更新（原型演示）')
    // 重置 input 以便重复选择同一文件
    e.target.value = ''
  }
}

// ===== 背景图 =====
function onChangeBg() {
  bgInput.value?.click()
}

function onBgFileChange(e) {
  const file = e.target.files?.[0]
  if (file) {
    showToast('背景图已更新（原型演示）')
    e.target.value = ''
  }
}

// ===== 文本编辑器（名字 / 简介） =====
function openEditor(field) {
  editorField.value = field
  if (field === 'nickname') {
    editTemp.value = form.nickname || ''
  } else {
    editTemp.value = form.bio || ''
  }
  showTextEditor.value = true
}

function saveTextEdit() {
  if (!editTemp.value.trim()) {
    showToast('内容不能为空')
    return
  }
  if (editorField.value === 'nickname') {
    form.nickname = editTemp.value.trim()
  } else {
    form.bio = editTemp.value.trim()
  }
  // 同步更新 store
  if (store.currentUser) {
    if (editorField.value === 'nickname') {
      store.currentUser.nickname = form.nickname
    } else {
      store.currentUser.bio = form.bio
    }
  }
  showTextEditor.value = false
  showToast('已保存')
}

// ===== 校声号编辑 =====
function openEchoIdEditor() {
  if (echoIdLimitReached.value) {
    showToast('本年已修改过校声号，请明年再试')
    return
  }
  editTemp.value = form.echoId || ''
  showEchoIdEditor.value = true
}

function saveEchoId() {
  if (!editTemp.value.trim()) {
    showToast('校声号不能为空')
    return
  }
  form.echoId = editTemp.value.trim()
  echoIdModifiedThisYear.value = true
  if (store.currentUser) {
    store.currentUser.echoId = form.echoId
  }
  showEchoIdEditor.value = false
  showToast('校声号已修改（本年次数已用尽）')
}

// ===== 性别 =====
const genderOptions = [
  { name: '男', value: 'male' },
  { name: '女', value: 'female' }
]

function openGenderPicker() {
  showGenderPicker.value = true
}

function onGenderSelect(item) {
  form.gender = item.value
  if (store.currentUser) {
    store.currentUser.gender = item.value
  }
  showGenderPicker.value = false
  showToast(`已设置为${item.name}`)
}

// ===== 生日 =====
function openBirthdayPicker() {
  if (form.birthday) {
    const parts = form.birthday.split('-')
    birthdayValue.value = [
      parseInt(parts[0]) || 2000,
      (parseInt(parts[1]) || 1) - 1,
      parseInt(parts[2]) || 1
    ]
  }
  showBirthdayPicker.value = true
}

function onBirthdayConfirm({ selectedValues }) {
  const [year, month, day] = selectedValues
  form.birthday = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  if (store.currentUser) {
    store.currentUser.birthday = form.birthday
  }
  showBirthdayPicker.value = false
  showToast('生日已更新')
}

// ===== 地区 =====
const regionOptions = [
  { name: '北京', value: '北京' },
  { name: '上海', value: '上海' },
  { name: '广州', value: '广州' },
  { name: '深圳', value: '深圳' },
  { name: '杭州', value: '杭州' },
  { name: '成都', value: '成都' },
  { name: '武汉', value: '武汉' },
  { name: '南京', value: '南京' },
  { name: '西安', value: '西安' },
  { name: '重庆', value: '重庆' }
]

function openRegionPicker() {
  showRegionPicker.value = true
}

function onRegionSelect(item) {
  form.region = item.value
  if (store.currentUser) {
    store.currentUser.region = item.value
  }
  showRegionPicker.value = false
  showToast(`地区已设置为${item.name}`)
}

// ===== 标签编辑 =====
const availableTags = [
  '摄影', '日语', '摇滚', '美食', '穿搭', '旅行',
  '考研', '学习', '咖啡', '编程', '篮球', '足球',
  '音乐', '电影', '读书', '健身', '游戏', '画画',
  '舞蹈', '写作', '摄影', '宠物', '手工', '动漫'
]

const tagActions = computed(() => {
  return availableTags.map(t => ({
    name: t,
    value: t,
    color: form.tags.includes(t) ? '#4caf7d' : undefined,
    subname: form.tags.includes(t) ? '已选择' : ''
  }))
})

function openTagEditor() {
  showTagEditor.value = true
}

function onTagSelect(item) {
  const tag = item.value
  if (form.tags.includes(tag)) {
    form.tags = form.tags.filter(t => t !== tag)
  } else {
    if (form.tags.length >= 8) {
      showToast('最多选择 8 个标签')
      return
    }
    form.tags = [...form.tags, tag]
  }
  if (store.currentUser) {
    store.currentUser.tags = [...form.tags]
  }
}
</script>

<style scoped>
.edit-profile-page {
  min-height: 100%;
  background: var(--echo-bg);
  display: flex;
  flex-direction: column;
}

/* ===== 顶部导航 ===== */
.edit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--echo-white);
  border-bottom: 1px solid var(--echo-border);
  flex-shrink: 0;
}

.edit-back {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--echo-text);
  border-radius: 50%;
  transition: background 0.15s;
}
.edit-back:active { background: var(--echo-bg); }

.edit-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--echo-text);
}

.edit-preview {
  font-size: 14px;
  font-weight: 500;
  color: var(--echo-primary);
  padding: 4px 12px;
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.15s;
}
.edit-preview:active { background: var(--echo-primary-light); }

/* ===== 滚动区域 ===== */
.edit-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 12px 0 40px;
}

/* ===== 分组卡片 ===== */
.edit-group {
  background: var(--echo-white);
  margin: 0 12px 12px;
  border-radius: 14px;
  overflow: hidden;
}

/* ===== 行 ===== */
.edit-row {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.12s;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.edit-row:active { background: var(--echo-bg); }
.edit-row.is-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.edit-row-divider {
  height: 1px;
  background: var(--echo-border);
  margin-left: 16px;
  margin-right: 16px;
}

.edit-label {
  font-size: 15px;
  color: var(--echo-text);
  font-weight: 500;
  flex-shrink: 0;
  width: 72px;
}

.edit-value {
  flex: 1;
  text-align: right;
  font-size: 14px;
  color: var(--echo-text-secondary);
  margin-right: 6px;
  min-width: 0;
}

.edit-value--truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.edit-value--hint {
  color: var(--echo-text-hint);
}

.edit-value-wrap {
  flex: 1;
  text-align: right;
  margin-right: 6px;
  min-width: 0;
}

.edit-hint {
  display: block;
  font-size: 11px;
  color: var(--echo-text-hint);
  margin-top: 2px;
}

.edit-arrow {
  flex-shrink: 0;
}

/* ===== 头像行 ===== */
.edit-row--avatar {
  justify-content: flex-start;
}

.edit-avatar-wrap {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 6px;
  position: relative;
}

.edit-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0,0,0,0.12);
}
.edit-avatar-text {
  color: #fff;
  font-size: 24px;
  font-weight: 700;
}

.edit-avatar-camera {
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--echo-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(76,175,125,0.35);
}

/* ===== 背景图预览 ===== */
.edit-bg-preview {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  margin-right: 6px;
}
.edit-bg-preview img {
  width: 56px;
  height: 38px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid var(--echo-border);
}

/* ===== 标签芯片 ===== */
.edit-tags-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
}
.edit-tag-chip {
  font-size: 11px;
  color: var(--echo-primary);
  background: var(--echo-primary-light);
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}
.edit-tag-more {
  font-size: 11px;
  color: var(--echo-text-hint);
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
}

/* ===== 文本编辑弹窗 ===== */
.text-editor-body {
  padding: 16px 20px 12px;
}

.text-editor-input {
  width: 100%;
  height: 40px;
  border: 1px solid var(--echo-border);
  border-radius: 10px;
  padding: 0 12px;
  font-size: 15px;
  color: var(--echo-text);
  outline: none;
  box-sizing: border-box;
}
.text-editor-input:focus {
  border-color: var(--echo-primary);
}

.text-editor-textarea {
  width: 100%;
  border: 1px solid var(--echo-border);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  color: var(--echo-text);
  outline: none;
  resize: none;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1.6;
}
.text-editor-textarea:focus {
  border-color: var(--echo-primary);
}

.text-editor-count {
  text-align: right;
  font-size: 11px;
  color: var(--echo-text-hint);
  margin-top: 4px;
}

.echo-id-hint {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--echo-accent);
  background: var(--echo-accent-light);
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 14px;
  line-height: 1.5;
}
</style>
