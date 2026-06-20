<template>
  <Teleport to="#phone-screen">
    <transition name="channel-manage-fade">
      <div v-if="visible" class="cm-overlay" @click.self="onClose">
        <div class="cm-container" @click.stop>
          <!-- 导航栏增加顶部安全内边距，远离状态栏 -->
          <div class="cm-nav">
            <!-- 扩大关闭按钮可点击区域，填满整格 -->
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
                <div v-if="editing" class="cm-tag-remove" @click.stop="removeChannel(tag, idx)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </div>
              </div>
            </div>
            <div v-else class="cm-empty-hint">
              还没有添加频道，从下方推荐中挑选吧
            </div>
          </div>

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
import { ref, computed, watch, nextTick } from 'vue'
import { useAppStore } from '@/stores/app.js'
import { showToast } from 'vant'
import { allCategoryTags } from '@/mock/posts.js'

const props = defineProps({
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'select-channel'])
const store = useAppStore()
const editing = ref(false)
const dragStartIdx = ref(-1)

const channelDisplayName = computed(() => {
  const ch = store.channelLabels.find(c => c.key === store.activeChannel)
  return ch ? ch.label : ''
})

const allPoolTags = computed(() => {
  return allCategoryTags
})

const myChannels = ref([])
const recommendedChannels = computed(() => {
  const mySet = new Set(myChannels.value)
  return allPoolTags.value.filter(t => !mySet.has(t))
})

// 打开面板强制初始化，nextTick 确保DOM渲染完成
watch(() => props.visible, async (val) => {
  if (val) {
    await nextTick()
    // 强制从仓库读取最新可见标签
    myChannels.value = JSON.parse(JSON.stringify(store.visibleTags || []))
    editing.value = false
    store.lockPhoneScroll()
  } else {
    store.unlockPhoneScroll()
  }
})

// 切换编辑状态
function toggleEdit() {
  editing.value = !editing.value
}

// 拖拽逻辑
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

// 浏览态点击跳转，编辑态禁止
function onMyChannelClick(tag) {
  if (editing.value) return
  store.setCategoryTag(tag)
  emit('select-channel', tag)
  onClose()
}

// 移除频道
function removeChannel(tag, idx) {
  myChannels.value.splice(idx, 1)
}

// 添加频道
function addChannel(tag) {
  if (!tag || myChannels.value.includes(tag)) return
  myChannels.value.push(tag)
}

// 关闭面板：同步数据+重置状态
function onClose() {
  console.log('触发关闭弹窗')
  syncToStore()
  editing.value = false
  emit('close')
}

// 同步本地频道数据到全局仓库
function syncToStore() {
  store.userTags = [...myChannels.value]
  store.hiddenTags = []
}
</script>

<style scoped>
.cm-overlay {
  position: fixed;
  top: 48px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(240, 242, 245, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.cm-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

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

/* 强制按钮可点击，消除浏览器点击穿透bug */
.cm-nav-left {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--echo-text-secondary);
  cursor: pointer !important;
  pointer-events: auto !important;
  border-radius: 50%;
  transition: background 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.cm-nav-left:active {
  background: rgba(0, 0, 0, 0.06);
}

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

.cm-section {
  padding: 12px 16px 16px;
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
  min-height: 24px;
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
.cm-tag--mine {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: var(--echo-text);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.cm-tag--mine:hover {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.7);
}
.cm-tag--editing {
  padding-right: 12px;
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
.cm-tag-remove {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 80, 80, 0.9);
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
.cm-tag--recommend {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px dashed rgba(0, 0, 0, 0.15);
  color: var(--echo-text-secondary);
  gap: 3px;
}
.cm-tag--recommend:active {
  background: rgba(76, 175, 125, 0.15);
  border-style: solid;
  border-color: var(--echo-primary);
  color: var(--echo-primary);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.cm-tag-plus {
  flex-shrink: 0;
  opacity: 0.6;
}
.cm-tag--recommend:active .cm-tag-plus {
  opacity: 1;
}
.cm-empty-hint {
  text-align: center;
  padding: 20px 0 8px;
  font-size: 13px;
  color: var(--echo-text-hint);
}

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
