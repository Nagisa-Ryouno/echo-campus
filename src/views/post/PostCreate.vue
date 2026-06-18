<template>
  <div class="post-create-page">
    <!-- 顶部导航 -->
    <div class="create-header">
      <span class="create-back" @click="onBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </span>
      <span class="create-title">发布帖子</span>
      <span class="create-draft" @click="onSaveDraft">草稿</span>
    </div>

    <!-- 表单区域 -->
    <div class="create-body">
      <!-- 一级分类标签 -->
      <div class="form-section">
        <div class="form-label">分类标签 <span class="required">*</span></div>
        <div class="tag-grid">
          <span
            v-for="tag in allCategoryTags"
            :key="tag"
            class="form-tag"
            :class="{ 'form-tag--active': form.categoryTag === tag }"
            @click="form.categoryTag = tag"
          >{{ tag }}</span>
        </div>
      </div>

      <!-- 正文 -->
      <div class="form-section">
        <van-field
          v-model="form.content"
          type="textarea"
          placeholder="分享你的校园生活..."
          rows="5"
          autosize
          maxlength="2000"
          show-word-limit
        />
      </div>

      <!-- 图片上传 -->
      <div class="form-section">
        <div class="form-label">添加图片</div>
        <div class="image-upload-area">
          <div
            v-for="(img, idx) in form.images"
            :key="idx"
            class="upload-img-preview"
          >
            <div class="upload-img-dummy">{{ idx + 1 }}</div>
            <span class="upload-img-remove" @click="removeImage(idx)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </span>
          </div>
          <div
            v-if="form.images.length < 9"
            class="upload-btn"
            @click="onAddImage"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span>{{ form.images.length }}/9</span>
          </div>
        </div>
      </div>

      <!-- 二级话题标签 -->
      <div class="form-section">
        <div class="form-label">话题标签</div>
        <div class="topic-tags-inline">
          <span
            v-for="tag in topicTagOptions"
            :key="tag"
            class="form-tag form-tag--small"
            :class="{ 'form-tag--active': form.topicTags.includes(tag) }"
            @click="toggleTopicTag(tag)"
          >#{{ tag }}</span>
        </div>
      </div>

      <!-- 可见权限 -->
      <div class="form-section">
        <div class="form-label">可见范围</div>
        <div class="option-row">
          <span
            v-for="opt in visibilityOptions"
            :key="opt.value"
            class="option-chip"
            :class="{
              'option-chip--active': form.visibility === opt.value,
              'option-chip--disabled': isVisibilityDisabled(opt.value)
            }"
            @click="setVisibility(opt.value)"
          >{{ opt.label }}</span>
        </div>
      </div>

      <!-- 仅本校可见 -->
      <div class="form-section">
        <div class="option-row option-row--between">
          <div>
            <div class="form-label" style="margin-bottom:2px">仅本校可见</div>
            <div class="form-hint">{{ schoolOnlyHint }}</div>
          </div>
          <van-switch
            v-model="form.schoolOnly"
            :disabled="schoolOnlyDisabled"
            active-color="var(--echo-primary)"
          />
        </div>
      </div>

      <!-- 匿名发布 -->
      <div class="form-section">
        <div class="option-row option-row--between">
          <div>
            <div class="form-label" style="margin-bottom:2px">匿名发布</div>
            <div class="form-hint">{{ anonHint }}</div>
          </div>
          <van-switch
            v-model="form.isAnon"
            active-color="var(--echo-accent)"
            @change="onAnonChange"
          />
        </div>
      </div>

      <!-- 规则提示 -->
      <div v-if="ruleMessage" class="rule-tip">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span>{{ ruleMessage }}</span>
      </div>
    </div>

    <!-- 底部发布按钮 -->
    <div class="create-footer">
      <button
        class="publish-btn"
        :class="{ 'publish-btn--disabled': !canPublish }"
        :disabled="!canPublish"
        @click="onPublish"
      >
        发布
      </button>
    </div>

    <!-- 草稿列表弹窗（绑定到手机壳内）-->
    <van-popup
      v-model:show="showDrafts"
      position="bottom"
      teleport="#phone-screen"
      :style="{ height: '50%', borderRadius: '16px 16px 0 0' }"
    >
      <div class="draft-panel">
        <div class="draft-panel-header">
          <h3>草稿箱</h3>
          <span class="draft-panel-close" @click="showDrafts = false">关闭</span>
        </div>
        <div v-if="store.drafts.length === 0" class="draft-empty">暂无草稿</div>
        <div
          v-for="draft in store.drafts"
          :key="draft.id"
          class="draft-item"
          @click="loadDraft(draft)"
        >
          <div class="draft-item-content">
            <div class="draft-item-text">{{ draft.content || '(空内容)' }}</div>
            <div class="draft-item-meta">{{ draft.categoryTag || '未选择标签' }} · {{ new Date(draft.createdAt).toLocaleString('zh-CN') }}</div>
          </div>
          <span class="draft-item-delete" @click.stop="onDeleteDraft(draft.id)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { showToast, showDialog } from 'vant'
import { allCategoryTags, topicTags } from '@/mock/posts.js'

const router = useRouter()
const store = useAppStore()

// 表单数据
const form = reactive({
  content: '',
  images: [],
  categoryTag: '',
  topicTags: [],
  visibility: 'public',
  schoolOnly: false,
  isAnon: false
})

const topicTagOptions = topicTags
const showDrafts = ref(false)

const visibilityOptions = [
  { value: 'public', label: '所有人可见' },
  { value: 'followers', label: '仅关注者' },
  { value: 'private', label: '完全私密' }
]

// ===== 业务规则 =====

// 学校可见开关是否禁用
const schoolOnlyDisabled = computed(() => {
  // 匿名发布时：禁用本校可见
  if (form.isAnon) return true
  // 完全私密时：禁用本校可见
  if (form.visibility === 'private') return true
  return false
})

// 可见范围选项是否禁用
function isVisibilityDisabled(value) {
  // 匿名发布时：只能选"所有人可见"
  if (form.isAnon && value !== 'public') return true
  return false
}

function setVisibility(value) {
  if (isVisibilityDisabled(value)) return
  form.visibility = value
  // 切换到完全私密时，自动关闭本校可见
  if (value === 'private') {
    form.schoolOnly = false
  }
}

// 匿名变化时的联动规则
function onAnonChange(val) {
  if (val) {
    // 开启匿名 → 强制公开 + 禁用本校
    form.visibility = 'public'
    form.schoolOnly = false
  }
}

// 提示信息
const schoolOnlyHint = computed(() => {
  if (form.isAnon) return '匿名发布时不支持本校可见'
  if (form.visibility === 'private') return '完全私密时不支持本校可见'
  return '开启后仅本校用户可查看此帖'
})

const anonHint = computed(() => {
  if (form.isAnon) return '已开启匿名，帖子将不显示你的身份'
  return '开启后帖子将匿名显示'
})

const ruleMessage = computed(() => {
  if (form.isAnon) return '匿名发布时，帖子将强制设为「所有人可见」，且无法限制本校可见。'
  if (form.visibility === 'private') return '完全私密的帖子仅自己可见，不支持本校可见限制。'
  return ''
})

// 是否可以发布
const canPublish = computed(() => {
  return form.content.trim().length > 0 && form.categoryTag !== ''
})

// ===== 图片操作 =====
function onAddImage() {
  // 原型中模拟添加图片
  form.images.push({ id: Date.now() })
  showToast('图片已添加（模拟）')
}

function removeImage(idx) {
  form.images.splice(idx, 1)
}

// ===== 话题标签 =====
function toggleTopicTag(tag) {
  const idx = form.topicTags.indexOf(tag)
  if (idx >= 0) {
    form.topicTags.splice(idx, 1)
  } else {
    if (form.topicTags.length < 5) {
      form.topicTags.push(tag)
    } else {
      showToast('最多选择 5 个话题标签')
    }
  }
}

// ===== 发布 =====
function onPublish() {
  if (!canPublish.value) return

  showDialog({
    title: '确认发布',
    message: `将发布一条「${form.categoryTag}」帖子${form.isAnon ? '（匿名）' : ''}`,
    teleport: '#phone-screen',
  }).then(() => {
    const post = store.createPost({ ...form })
    showToast('发布成功！')
    // 重置表单
    form.content = ''
    form.images = []
    form.categoryTag = ''
    form.topicTags = []
    form.visibility = 'public'
    form.schoolOnly = false
    form.isAnon = false
    // 跳转到帖子详情
    router.replace(`/post/${post.id}`)
  }).catch(() => {})
}

// ===== 草稿 =====
function onSaveDraft() {
  if (!form.content.trim() && !form.categoryTag) {
    showToast('内容为空，无需保存')
    return
  }
  store.saveDraft({ ...form })
  showToast('已保存草稿')
}

function onDeleteDraft(draftId) {
  store.removeDraft(draftId)
}

function loadDraft(draft) {
  Object.assign(form, {
    content: draft.content || '',
    images: draft.images || [],
    categoryTag: draft.categoryTag || '',
    topicTags: draft.topicTags || [],
    visibility: draft.visibility || 'public',
    schoolOnly: draft.schoolOnly || false,
    isAnon: draft.isAnon || false
  })
  showDrafts.value = false
  showToast('已加载草稿')
}

// ===== 返回 =====
function onBack() {
  if (form.content.trim() || form.categoryTag) {
    showDialog({
      title: '提示',
      message: '有未保存的内容，是否保存为草稿？',
      confirmButtonText: '保存',
      cancelButtonText: '不保存',
      teleport: '#phone-screen',
    }).then(() => {
      onSaveDraft()
      router.back()
    }).catch(() => {
      router.back()
    })
  } else {
    router.back()
  }
}
</script>

<style scoped>
.post-create-page {
  min-height: 100%;
  background: var(--echo-bg);
  display: flex;
  flex-direction: column;
}

/* 顶部 */
.create-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--echo-white);
  position: sticky;
  top: 0;
  z-index: 10;
}

.create-back {
  color: var(--echo-text);
  cursor: pointer;
  display: flex;
  align-items: center;
}

.create-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--echo-text);
}

.create-draft {
  font-size: 14px;
  color: var(--echo-primary);
  cursor: pointer;
  font-weight: 500;
}

/* 表单 */
.create-body {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
}

.form-section {
  background: var(--echo-white);
  margin-bottom: 8px;
  padding: 14px 16px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--echo-text);
  margin-bottom: 10px;
}

.required {
  color: var(--echo-danger);
}

.form-hint {
  font-size: 12px;
  color: var(--echo-text-hint);
}

/* 分类标签网格 */
.tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.form-tag {
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 13px;
  background: var(--echo-bg);
  color: var(--echo-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.form-tag--small {
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 14px;
}

.form-tag--active {
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  font-weight: 600;
}

/* 图片上传 */
.image-upload-area {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.upload-img-preview {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: var(--echo-bg);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--echo-text-hint);
}

.upload-img-dummy {
  color: var(--echo-text-hint);
  font-size: 14px;
}

.upload-img-remove {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.upload-btn {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 1.5px dashed var(--echo-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--echo-text-hint);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-btn:active {
  border-color: var(--echo-primary);
  color: var(--echo-primary);
}

/* 话题标签行 */
.topic-tags-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 选项行 */
.option-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.option-row--between {
  justify-content: space-between;
  align-items: center;
}

.option-chip {
  padding: 8px 16px;
  border-radius: 18px;
  font-size: 13px;
  background: var(--echo-bg);
  color: var(--echo-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.option-chip--active {
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  font-weight: 600;
}

.option-chip--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 规则提示 */
.rule-tip {
  margin: 8px 16px;
  padding: 10px 14px;
  background: #fff8e1;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: #8d6e00;
  line-height: 1.5;
}

.rule-tip svg {
  flex-shrink: 0;
  margin-top: 1px;
}

/* 发布按钮 */
.create-footer {
  position: sticky;
  bottom: 0;
  background: var(--echo-white);
  padding: 12px 16px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  border-top: 1px solid var(--echo-border);
  z-index: 10;
}

.publish-btn {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  border: none;
  background: var(--echo-primary);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.publish-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.publish-btn--disabled {
  background: var(--echo-border);
  color: var(--echo-text-hint);
  cursor: not-allowed;
}

/* 草稿面板 */
.draft-panel {
  padding: 20px 16px 32px;
}

.draft-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.draft-panel-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--echo-text);
}

.draft-panel-close {
  font-size: 15px;
  color: var(--echo-primary);
  cursor: pointer;
  font-weight: 500;
}

.draft-empty {
  text-align: center;
  padding: 40px;
  color: var(--echo-text-hint);
  font-size: 14px;
}

.draft-item {
  display: flex;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid var(--echo-border);
  cursor: pointer;
}

.draft-item-content {
  flex: 1;
  min-width: 0;
}

.draft-item-text {
  font-size: 14px;
  color: var(--echo-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.draft-item-meta {
  font-size: 12px;
  color: var(--echo-text-hint);
}

.draft-item-delete {
  color: var(--echo-text-hint);
  cursor: pointer;
  padding: 8px;
  flex-shrink: 0;
}

.draft-item-delete:active {
  color: var(--echo-danger);
}
</style>
