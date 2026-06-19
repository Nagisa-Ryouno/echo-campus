<template>
  <Teleport to="#phone-screen">
    <transition name="channel-manage-fade">
      <div v-if="visible" class="cm-overlay" @click.self="onClose">
        <!-- ═══ 全屏容器 ═══ -->
        <div class="cm-container">

          <!-- ===== 顶部导航栏 ===== -->
          <div class="cm-nav">
            <div class="cm-nav-left" @click="onClose">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
            <div class="cm-nav-title">{{ channelDisplayName }}</div>
            <button class="cm-nav-right-btn" :class="{ 'cm-nav-right-btn--active': editing }" @click="toggleEdit">
              {{ editing ? '完成' : '编辑' }}
            </button>
          </div>

          <!-- ===== 我的频道板块 ===== -->
          <div class="cm-section">
            <div class="cm-section-header">
              <div class="cm-section-title-row">
                <span class="cm-section-title">我的频道</span>
                <span class="cm-section-subtitle">长按拖动排序</span>
              </div>
            </div>

            <div v-if="myChannels.length > 0" class="cm-grid">
              <div
                v-for="(tag, idx) in myChannels"
                :key="'my-' + tag"
                class="cm-tag cm-tag--mine"
                :class="{ 'cm-tag--editing': editing }"
                draggable="true"
                @dragstart="onDragStart(idx, $event)"
                @dragover.prevent="onDragOver(idx, $event)"
                @drop="onDrop(idx, $event)"
                @dragend="onDragEnd"
                @click="onMyChannelClick(tag)"
              >
                <span class="cm-tag-text">{{ tag }}</span>
                <!-- 编辑态：右上角删除叉号 -->
                <div v-if="editing" class="cm-tag-remove" @click.stop="removeChannel(tag, idx)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </div>
                <!-- 拖拽指示器（编辑态显示） -->
                <div v-if="editing" class="cm-tag-drag-hint">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
                    <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                    <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
                  </svg>
                </div>
              </div>
            </div>
            <div v-else class="cm-empty-hint">
              还没有添加频道，从下方推荐中挑选吧
            </div>
          </div>

          <!-- ===== 推荐频道板块 ===== -->
          <div class="cm-section cm-section--recommend">
            <div class="cm-section-header">
              <div class="cm-section-title-row">
                <span class="cm-section-title">推荐频道</span>
                <span class="cm-section-subtitle">点击添加频道</span>
              </div>
            </div>

            <div v-if="recommendedChannels.length > 0" class="cm-grid">
              <div
                v-for="tag in recommendedChannels"
                :key="'rec-' + tag"
                class="cm-tag cm-tag--recommend"
                @click="addChannel(tag)"
              >
                <svg class="cm-tag-plus" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span class="cm-tag-text">{{ tag }}</span>
              </div>
            </div>
            <div v-else class="cm-empty-hint">
              已添加所有推荐频道
            </div>
          </div>

        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '@/stores/app.js'
import { showToast } from 'vant'

const props = defineProps({
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'select-channel'])

const store = useAppStore()
const editing = ref(false)
const dragStartIdx = ref(-1)  // 拖拽起始索引
// 当前大频道名称
const channelDisplayName = computed(() => {
  const ch = store.channelLabels.find(c => c.key === store.activeChannel)
  return ch ? ch.label : ''
})

// ── 我的频道列表（来自当前频道的 visibleTags / userTags）──
// 初始化时从 store 的 userTags 中取"已激活"的标签作为我的频道
// 推荐列表 = 当前频道完整标签池 - 我的频道
const allPoolTags = computed(() => {
  return store.currentChannelTags.length > 0
    ? [...store.currentChannelTags]
    : [...(store.userTags.value || [])]
})

// 我的频道（用户已选择的标签）
const myChannels = ref([])

// 推荐频道（未选择的标签）
const recommendedChannels = computed(() => {
  const mySet = new Set(myChannels.value)
  return allPoolTags.value.filter(t => !mySet.has(t))
})

// 当面板打开时，初始化我的频道列表
watch(() => props.visible, (val) => {
  if (val) {
    // 从 store 的可见标签初始化"我的频道"
    myChannels.value = [...(store.visibleTags || [])]
    editing.value = false
    store.lockPhoneScroll()
  } else {
    store.unlockPhoneScroll()
  }
})

// ── 编辑状态切换 ──
function toggleEdit() {
  editing.value = !editing.value
}

// ── 拖拽排序 ──
function onDragStart(idx, event) {
  if (!editing.value) { event.preventDefault(); return }
  dragStartIdx.value = idx
  event.dataTransfer.effectAllowed = 'move'
}

function onDragOver(idx, event) {
  if (!editing.value) return
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

function onDrop(idx, event) {
  if (!editing.value) return
  event.preventDefault()
  const from = dragStartIdx.value
  if (from < 0 || from === idx) return
  const list = [...myChannels.value]
  const [moved] = list.splice(from, 1)
  list.splice(idx, 0, moved)
  myChannels.value = list
  dragStartIdx.value = -1
}

function onDragEnd() {
  dragStartIdx.value = -1
}

// ── 点击我的频道（浏览态 → 进入频道；编辑态不响应点击跳转）──
function onMyChannelClick(tag) {
  if (editing.value) return
  // 选择该频道并关闭管理界面
  store.setCategoryTag(tag)
  emit('select-channel', tag)
  onClose()
}

// ── 从我的频道移除 ──
function removeChannel(tag, idx) {
  myChannels.value.splice(idx, 1)
}

// ── 添加到我的频道 ──
function addChannel(tag) {
  if (!tag || myChannels.value.includes(tag)) return
  myChannels.value.push(tag)
}

// ── 关闭面板（同步结果回 store）──
function onClose() {
  // 将最终的 myChannels 同步回 store
  syncToStore()
  editing.value = false
  emit('close')
}

// 同步用户的频道选择到 store
function syncToStore() {
  // 计算被移除的标签（原来在 visibleTags 中但不在 myChannels 中的）
  const previousVisible = new Set(store.visibleTags || [])
  const currentMySet = new Set(myChannels.value)

  // 被隐藏的 = 之前可见但现在不在我的频道里
  for (const t of previousVisible) {
    if (!currentMySet.has(t)) {
      if (!store.hiddenTags.value.includes(t)) {
        store.hiddenTags.value = [...store.hiddenTags.value, t]
      }
    }
  }

  // 被恢复显示的 = 现在在我的频道里但之前在 hiddenTags 里的
  for (const t of myChannels.value) {
    if (store.hiddenTags.value.includes(t)) {
      store.hiddenTags.value = store.hiddenTags.value.filter(h => h !== t)
    }
  }
}
</script>

<style scoped>
/* ══════════════════════════════════════════════ */
/* 全屏覆盖层（浅灰半透明 + 毛玻璃）     */
/* 使用 position:fixed 而非 absolute：      */
/* phone-body 有 transform:translateZ(0)    */
/* 会创建新的 fixed 包含块，确保覆盖整屏   */
/* ══════════════════════════════════════════════ */
.cm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 375px;
  height: 100%;
  margin: auto;
  background: rgba(240, 242, 245, 0.95);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  z-index: 600;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  /* 状态栏安全区域：44px */
  padding-top: 44px;
}

.cm-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* ═══ 顶部导航栏 ═══ */
.cm-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.cm-nav-left {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--echo-text-secondary);
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.cm-nav-left:active {
  background: rgba(0, 0, 0, 0.06);
}

/* 导航栏右侧编辑按钮 */
.cm-nav-right-btn {
  font-size: 13px;
  color: var(--echo-primary);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 16px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.cm-nav-right-btn:active {
  opacity: 0.7;
}

.cm-nav-right-btn--active {
  background: rgba(76, 175, 125, 0.14);
  color: var(--echo-primary);
}

.cm-nav-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--echo-text);
  letter-spacing: 0.3px;
}

/* ═══ 板块通用 ═══ */
.cm-section {
  padding: 4px 16px 16px;
}

.cm-section--recommend {
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.cm-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.cm-section-title-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.cm-section-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--echo-text);
}

.cm-section-subtitle {
  font-size: 12px;
  color: var(--echo-text-hint);
  font-weight: 400;
}



.cm-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px 8px;
}

/* ═══ 标签 ═══ */
.cm-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  position: relative;
  transition: all 0.18s ease;
  -webkit-tap-highlight-color: transparent;
  overflow: hidden;
}

.cm-tag:active {
  transform: scale(0.95);
}

/* 我的频道标签 */
.cm-tag--mine {
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: var(--echo-text);
}

.cm-tag--mine:hover {
  background: rgba(0, 0, 0, 0.07);
  border-color: rgba(0, 0, 0, 0.14);
}

/* 拖拽提示图标（编辑态显示） */
.cm-tag-drag-hint {
  position: absolute;
  bottom: 3px;
  right: 5px;
  color: var(--echo-text-hint);
  opacity: 0.45;
  pointer-events: none;
}

/* 编辑态下标签微调 */
.cm-tag--editing {
  padding-right: 20px;
  cursor: grab;
}

.cm-tag--editing:active {
  cursor: grabbing;
}

.cm-tag-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-align: center;
}

/* 删除叉号 */
.cm-tag-remove {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 80, 80, 0.85);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s;
  flex-shrink: 0;
}

.cm-tag-remove:active {
  transform: scale(1.2);
}

/* 推荐频道标签 */
.cm-tag--recommend {
  background: transparent;
  border: 1px dashed rgba(0, 0, 0, 0.12);
  color: var(--echo-text-secondary);
  gap: 3px;
}

.cm-tag--recommend:active {
  background: rgba(76, 175, 125, 0.08);
  border-style: solid;
  border-color: var(--echo-primary);
  color: var(--echo-primary);
}

.cm-tag-plus {
  flex-shrink: 0;
  opacity: 0.6;
}

.cm-tag--recommend:active .cm-tag-plus {
  opacity: 1;
}

/* ═══ 空状态 ═══ */
.cm-empty-hint {
  text-align: center;
  padding: 32px 0 16px;
  font-size: 13px;
  color: var(--echo-text-hint);
}

/* ═══ 过渡动画 ═══ */
.channel-manage-fade-enter-active {
  transition: opacity 0.28s ease;
}
.channel-manage-fade-leave-active {
  transition: opacity 0.22s ease;
}
.channel-manage-fade-enter-from,
.channel-manage-fade-leave-to {
  opacity: 0;
}
</style>
