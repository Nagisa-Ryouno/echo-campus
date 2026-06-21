<template>
  <Teleport to="#phone-screen">
    <div class="post-action-sheet-root" :class="{ 'is-active': show }">
      <!-- Backdrop with blur -->
      <transition name="sheet-backdrop">
        <div v-if="show" class="post-sheet-backdrop" @click="onCancel"></div>
      </transition>
      
      <!-- Action Sheet Content -->
      <transition name="sheet-content">
        <div v-if="show" class="post-sheet-container" @touchmove.prevent>
          <!-- Main Action Cards -->
          <div class="post-sheet-menu">
            <!-- Option 1: 不感兴趣 -->
            <div class="post-sheet-item" @click="onSelect('dislike')">
              <div class="item-icon-wrap gray-icon">
                <!-- Eye-off icon / 👁️🗨️ -->
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </div>
              <div class="item-text-info">
                <span class="item-title text-gray-dark">不感兴趣</span>
                <span class="item-desc">仅隐藏这条帖子</span>
              </div>
            </div>
            
            <div class="divider-line"></div>
            
            <!-- Option 2: 减少此类内容 -->
            <div class="post-sheet-item" @click="onSelect('reduce')">
              <div class="item-icon-wrap amber-icon">
                <!-- Trend down 📉 icon -->
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                  <polyline points="17 18 23 18 23 12"/>
                </svg>
              </div>
              <div class="item-text-info">
                <span class="item-title text-amber">减少此类内容</span>
                <span class="item-desc">减少类似推荐</span>
              </div>
            </div>
          </div>
          
          <!-- Cancel Button -->
          <div class="post-sheet-cancel" @click="onCancel">
            取消
          </div>
        </div>
      </transition>
    </div>
  </Teleport>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show', 'select'])

function onCancel() {
  emit('update:show', false)
}

function onSelect(actionType) {
  emit('select', actionType)
  emit('update:show', false)
}
</script>

<style scoped>
.post-action-sheet-root {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 3000;
}

.post-action-sheet-root.is-active {
  pointer-events: auto;
}

.post-sheet-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 3001;
}

.post-sheet-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3002;
  padding: 16px 16px calc(16px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
}

.post-sheet-menu {
  background: var(--echo-white);
  backdrop-filter: blur(20px) saturate(120%);
  -webkit-backdrop-filter: blur(20px) saturate(120%);
  border: 1px solid var(--echo-border);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}

.post-sheet-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  cursor: pointer;
  user-select: none;
  transition: background-color var(--echo-transition-fast);
}

.post-sheet-item:active {
  background-color: var(--echo-bg);
}

.item-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.gray-icon {
  background: #f1f2f5;
  color: var(--echo-text-secondary);
}

.amber-icon {
  background: #fdf6ec;
  color: #e6a23c;
}

.item-text-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-title {
  font-size: 15px;
  font-weight: 600;
}

.text-gray-dark {
  color: var(--echo-text);
}

.text-amber {
  color: #d88b1d;
}

.item-desc {
  font-size: 11px;
  color: var(--echo-text-hint);
}

.divider-line {
  height: 1px;
  background-color: var(--echo-border);
  margin: 0 20px;
}

.post-sheet-cancel {
  background: var(--echo-white);
  backdrop-filter: blur(20px) saturate(120%);
  -webkit-backdrop-filter: blur(20px) saturate(120%);
  border: 1px solid var(--echo-border);
  border-radius: 24px;
  padding: 16px;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: var(--echo-text-secondary);
  cursor: pointer;
  margin-top: 8px;
  user-select: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  transition: background-color var(--echo-transition-fast);
}

.post-sheet-cancel:active {
  background-color: var(--echo-bg);
}

/* Animations */
.sheet-backdrop-enter-active,
.sheet-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.sheet-backdrop-enter-from,
.sheet-backdrop-leave-to {
  opacity: 0;
}

.sheet-content-enter-active,
.sheet-content-leave-active {
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.sheet-content-enter-from,
.sheet-content-leave-to {
  transform: translateY(100%);
}
</style>
