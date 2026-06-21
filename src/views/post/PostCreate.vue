<template>
  <div class="post-create-page">
    <!-- 顶部导航 -->
    <!-- 顶部固定导航栏 -->
    <div class="create-header">
      <span class="create-back" @click="onBack">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </span>
      <span class="create-title">发布</span>
      <span class="create-draft" @click="onClickDraftIcon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
          <rect width="20" height="5" x="2" y="3" rx="1"/>
          <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
          <line x1="10" x2="14" y1="12" y2="12"/>
        </svg>
      </span>
    </div>

    <!-- 表单区域 -->
    <div class="create-body">
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
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            multiple
            style="display: none;"
            @change="onFileChange"
          />
          <div
            v-for="(img, idx) in form.images"
            :key="idx"
            class="upload-img-preview"
          >
            <img :src="img" class="upload-img-preview-pic" />
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

      <!-- 分类标签（可选）移动到添加图片下方 -->
      <div class="form-section">
        <div class="tag-select-row" @click="onTagSelect">
          <span class="tag-select-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            添加标签（可选）
          </span>
          <div v-if="form.categoryTag || form.topicTags.length" class="selected-tags-inline">
            <span v-if="form.categoryTag" class="selected-tag-pill">{{ form.categoryTag }}</span>
            <span v-for="t in form.topicTags" :key="t" class="selected-tag-pill">{{ t }}</span>
          </div>
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

      <!-- 发布按钮（跟随内容滚动，在页面最底部） -->
      <div class="publish-section">
        <button
          class="publish-btn"
          :class="{ 'publish-btn--disabled': !canPublish }"
          :disabled="!canPublish"
          @click="onPublish"
        >
          发布
        </button>
      </div>
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

    <!-- 返回确认面板（绑定到手机壳内）-->
    <van-action-sheet
      v-model:show="showBackSheet"
      :actions="backActions"
      @select="onBackAction"
      cancel-text="继续编辑"
      close-on-click-action
      teleport="#phone-screen"
    />
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { showToast, showDialog } from 'vant'
import { allCategoryTags, topicTags } from '@/mock/posts.js'

const router = useRouter()
const route = useRoute()
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

// 新建帖子时读取默认发帖偏好预填表单
onMounted(() => {
  form.isAnon = store.defaultAnonPost
  form.visibility = store.defaultVisibility
  form.schoolOnly = store.defaultSchoolOnly
  // 如果默认匿名开启，确保联动规则生效
  if (store.defaultAnonPost) {
    form.visibility = 'public'
    form.schoolOnly = false
  }
  if (store.defaultVisibility === 'private') {
    form.schoolOnly = false
  }
  // 从标签选择页返回时，读取已选标签
  loadTagsFromRoute()
})

// 从路由参数读取已选标签（从标签选择页返回时）
function loadTagsFromRoute() {
  const cat = route.query.categoryTag
  const topics = route.query.topicTags
  const content = route.query.content
  if (cat) form.categoryTag = cat
  if (topics) {
    form.topicTags = decodeURIComponent(topics).split(',').filter(Boolean)
  }
  if (content) {
    form.content = decodeURIComponent(content)
  }
}

// 监听路由参数变化（从标签选择页返回时触发）
watch(() => route.query, () => {
  loadTagsFromRoute()
}, { immediate: false })

// 跳转至标签选择页
function onTagSelect() {
  // 将当前已选标签通过 query 传给选择页
  const params = new URLSearchParams()
  if (form.categoryTag) params.set('categoryTag', form.categoryTag)
  if (form.topicTags.length) params.set('topicTags', form.topicTags.join(','))
  router.push(`/tag-select?${params.toString()}`)
}

const topicTagOptions = topicTags
const showDrafts = ref(false)
const showBackSheet = ref(false)

// 返回确认面板选项
const backActions = ref([
  { name: '存为草稿并退出', color: 'var(--echo-primary)' },
  { name: '不保存并退出', color: 'var(--echo-danger)' }
])

const visibilityOptions = [
  { value: 'public', label: '所有人可见' },
  { value: 'followers', label: '仅关注者可见' },
  { value: 'mutual', label: '仅互关者可见' },
  { value: 'private', label: '仅自己可见' }
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
  if (form.visibility === 'private') return '仅自己可见时不支持本校可见'
  return '开启后仅本校用户可查看此帖'
})

const anonHint = computed(() => {
  if (form.isAnon) return '已开启匿名，帖子将不显示你的身份'
  return '开启后帖子将匿名显示'
})

const ruleMessage = computed(() => {
  if (form.isAnon) return '匿名发布时，帖子将强制设为「所有人可见」，且无法限制本校可见。'
  if (form.visibility === 'private') return '仅自己可见的帖子不会在公开频道展示，不支持本校可见限制。'
  return ''
})

// 是否可以发布（分类标签已改为可选）
const canPublish = computed(() => {
  return form.content.trim().length > 0
})

// ===== 无感自动标签识别 =====
// 关键词 → 分类标签映射（与 allCategoryTags 及频道对应关系一致）
const autoTagKeywordMap = {
  '二手闲置': ['二手','闲置','出','转卖','收购','求购','闲鱼'],
  '校园活动': ['活动','晚会','迎新','毕业','校庆','运动会','社团'],
  '学习干货': ['学习','考研','复习','期末','考试','笔记','资料','论文','四六级','雅思','托福','考公'],
  '情感树洞': ['情感','树洞','失恋','暗恋','表白','心情','烦'],
  '美食探店': ['美食','探店','餐厅','食堂','外卖','做饭'],
  '运动健身': ['运动','健身','篮球','足球','跑步','羽毛球','网球'],
  '校园求助': ['求助','帮忙','问一下','请问','不懂'],
  '兼职实习': ['兼职','实习','工作','招聘','家教'],
  '校园传话': ['传话','告诉','帮我','转告'],
  '表白墙': ['表白','喜欢','暗恋'],
  '吐槽': ['吐槽','无语','醉了','服了','破防'],
  '租房': ['租房','找房','合租','室友'],
  '失物招领': ['失物','丢失','捡到','寻找','遗失'],
  '校园资讯': ['通知','资讯','公告','新闻','政策'],
  '兴趣爱好': ['兴趣','爱好','摄影','音乐','绘画','舞蹈'],
  '校园风景': ['风景','校园','打卡','拍照','秋景','春景'],
  '匿名树洞': ['匿名','树洞','秘密']
}

function detectAutoTags(content) {
  const text = content.toLowerCase()
  const matched = []
  for (const [tag, keywords] of Object.entries(autoTagKeywordMap)) {
    if (keywords.some(k => text.includes(k.toLowerCase()))) {
      matched.push(tag)
    }
  }
  return matched
}

// 发布时：若无手动标签，执行自动识别
function applyAutoTagsIfNeeded() {
  // 用户已手动选择分类标签，以手动为准，不覆盖
  if (form.categoryTag) return
  const auto = detectAutoTags(form.content)
  if (auto.length > 0) {
    form.categoryTag = auto[0]  // 取第一个匹配作为分类标签
    // 其余匹配项补充到话题标签
    auto.slice(1).forEach(t => {
      if (!form.topicTags.includes(t) && form.topicTags.length < 5) {
        form.topicTags.push(t)
      }
    })
  }
}

// ===== 图片操作 =====
const fileInput = ref(null)

function onAddImage() {
  fileInput.value?.click()
}

function onFileChange(event) {
  const files = event.target.files
  if (!files || files.length === 0) return

  const remainCount = 9 - form.images.length
  if (remainCount <= 0) {
    showToast('最多只能添加9张图片')
    return
  }
  
  const uploadFiles = Array.from(files).slice(0, remainCount)
  uploadFiles.forEach(file => {
    const url = URL.createObjectURL(file)
    form.images.push(url)
  })

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function removeImage(idx) {
  const url = form.images[idx]
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
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

  // 发布前自动识别标签（用户未手动选择时）
  applyAutoTagsIfNeeded()

  showDialog({
    title: '确认发布',
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    teleport: '#phone-screen',
  }).then(() => {
    store.createPost({ ...form })
    showToast('发布成功')
    resetForm()
    // 成功发布帖子并回到首页
    router.replace('/home')
  }).catch(() => {})
}

// ===== 草稿 =====
function onClickDraftIcon() {
  showDialog({
    title: '提示',
    message: '要加入草稿箱吗？',
    showCancelButton: true,
    confirmButtonText: '是',
    cancelButtonText: '否',
    teleport: '#phone-screen'
  }).then(() => {
    onSaveDraft()
  }).catch(() => {})
}

function onSaveDraft() {
  if (isFormEmpty()) {
    showToast('暂无内容可保存')
    return
  }
  store.saveDraft({ ...form })
  showToast('已存入草稿')
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
function isFormEmpty() {
  return !form.content.trim() && form.images.length === 0
}

function onBack() {
  if (isFormEmpty()) {
    router.back()
    return
  }
  showBackSheet.value = true
}

function onBackAction(action) {
  if (action.name === '存为草稿并退出') {
    onSaveDraft()
    router.back()
  } else if (action.name === '不保存并退出') {
    // 重置表单后退出
    resetForm()
    router.back()
  }
  // "继续编辑" = cancel，自动关闭面板，无需处理
}

function resetForm() {
  form.content = ''
  form.images = []
  form.categoryTag = ''
  form.topicTags = []
  form.visibility = store.defaultVisibility
  form.schoolOnly = store.defaultSchoolOnly
  form.isAnon = store.defaultAnonPost
}
</script>

<style scoped>
.post-create-page {
  min-height: 100%;
  background: var(--echo-bg);
  display: flex;
  flex-direction: column;
}

/* 顶部固定导航栏：最高层级，纯色背景 */
.create-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--echo-white);
  position: fixed;
  top: 48px;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 375px;
  z-index: 200;
  box-sizing: border-box;
  box-shadow: 0 1px 0 var(--echo-border);
}

.create-back {
  color: var(--echo-text);
  cursor: pointer;
  display: flex;
  align-items: center;
}

.create-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 17px;
  font-weight: 600;
  color: var(--echo-text);
}

.create-draft {
  color: var(--echo-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}
.create-draft:active {
  color: var(--echo-primary);
}

/* 表单（顶部留出固定导航栏高度，跟随 phone-screen 滚动） */
.create-body {
  padding-top: 48px;
  padding-bottom: 24px;
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

/* 标签选择行 */
.tag-select-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  cursor: pointer;
  padding: 4px 0;
}

.tag-select-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 13px;
  background: var(--echo-bg);
  color: var(--echo-text-secondary);
  transition: all 0.2s;
  border: 1px dashed var(--echo-border);
}

.tag-select-btn:active {
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  border-color: var(--echo-primary);
}

.selected-tags-inline {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.selected-tag-pill {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  font-weight: 500;
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

.upload-img-preview-pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
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
  gap: 4px;
  flex-wrap: nowrap;
}

.option-row--between {
  justify-content: space-between;
  align-items: center;
}

.option-chip {
  padding: 6px 0;
  border-radius: 14px;
  font-size: 11px;
  background: var(--echo-bg);
  color: var(--echo-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;
  flex: 1;
  text-align: center;
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

/* 发布按钮区域（跟随内容滚动，在页面最底部） */
.publish-section {
  padding: 20px 16px 32px;
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
