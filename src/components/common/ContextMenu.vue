<template>
  <Teleport to="#phone-screen">
    <div v-if="show" class="context-menu-root">
      <!-- 全屏透明遮罩，点击空白区域立即关闭 -->
      <div class="context-menu-mask" @click="onClose" @touchmove.prevent></div>

      <!-- 悬浮菜单面板 -->
      <transition name="menu-pop" appear>
        <div
          class="context-menu-panel"
          :style="panelStyle"
          @touchmove.prevent
        >
          <div
            v-for="item in options"
            :key="item.value"
            class="context-menu-item"
            :class="{ 'is-danger': item.danger }"
            @click="onSelect(item.value)"
          >
            <!-- 渲染 SVG 图标 -->
            <div class="context-menu-icon" v-html="item.icon"></div>
            <span class="context-menu-text">{{ item.label }}</span>
          </div>
        </div>
      </transition>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  options: {
    type: Array,
    required: true,
    // 预期格式: [{ label: '标为未读', value: 'unread', icon: '<svg...', danger: false }]
    default: () => []
  }
})

const emit = defineEmits(['close', 'select'])

// 动态计算菜单位置以避免超出屏幕边界
const panelStyle = computed(() => {
  const menuWidth = 136
  const menuHeight = props.options.length * 36 + 8 // 36px 每项 + 4px 上下 padding

  // 1. 横向定位逻辑：如果在右半边，向左展开（使菜单右侧贴近点击点）；否则向左对齐
  let left = props.x > 187.5 ? (props.x - menuWidth) : props.x
  
  // 2. 纵向定位逻辑：如果在靠底部，向上展开；否则向下展开
  // 手机模拟器高度为 812px，底部有 TabBar（高 56px）和 home bar，预留安全间距 80px
  let top = props.y > 812 - menuHeight - 80 ? (props.y - menuHeight) : props.y

  // 3. 边界约束限制，确保完全在 375x812 的范围内，不被切掉
  left = Math.max(12, Math.min(375 - menuWidth - 12, left))
  top = Math.max(60, Math.min(812 - menuHeight - 64, top))

  return {
    left: `${left}px`,
    top: `${top}px`
  }
})

function onClose() {
  emit('close')
}

function onSelect(value) {
  emit('select', value)
  emit('close')
}
</script>

<style scoped>
.context-menu-root {
  position: fixed;
  inset: 0;
  z-index: 15000; /* 高于底栏 TabBar 和所有普通覆盖层 */
}

/* 全屏透明蒙层，捕获空白点击且不干扰视觉 */
.context-menu-mask {
  position: absolute;
  inset: 0;
  background: transparent;
  cursor: default;
}

/* 优雅的浅色毛玻璃悬浮菜单面板 */
.context-menu-panel {
  position: absolute;
  width: 136px;
  background: rgba(255, 255, 255, 0.93);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 18px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 4px 0;
  box-sizing: border-box;
  transform-origin: center center;
}

/* 垂直排列菜单项 */
.context-menu-item {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 14px;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.12s ease;
}

/* 轻微灰色高亮反馈 */
.context-menu-item:active {
  background-color: rgba(0, 0, 0, 0.04);
}

/* 圆角适配 */
.context-menu-item:first-child {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.context-menu-item:last-child {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

/* 图标样式 */
.context-menu-icon {
  width: 14px;
  height: 14px;
  color: var(--echo-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  flex-shrink: 0;
}

:deep(.context-menu-icon svg) {
  display: block;
  width: 14px;
  height: 14px;
}

/* 文字样式 */
.context-menu-text {
  color: var(--echo-text);
  font-size: 12px;
  font-weight: 550;
  white-space: nowrap;
}

/* 危险操作项（删除）红色高亮 */
.context-menu-item.is-danger .context-menu-icon {
  color: #ff3b30;
}
.context-menu-item.is-danger .context-menu-text {
  color: #ff3b30;
}

/* 出现与消失过渡动画：opacity + scale */
.menu-pop-enter-active {
  transition: opacity 160ms ease, transform 160ms ease;
}
.menu-pop-leave-active {
  transition: opacity 120ms ease, transform 120ms ease;
}
.menu-pop-enter-from {
  opacity: 0;
  transform: scale(0.96);
}
.menu-pop-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
