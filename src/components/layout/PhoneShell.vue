<template>
  <div class="phone-outer">
    <div class="phone-body">
      <div class="phone-notch-area">
        <div class="phone-notch"></div>
      </div>
      <!-- 内容区：可滚动 -->
      <div id="phone-screen" class="phone-screen">
        <slot name="content" />
      </div>
      <!-- TabBar 固定区：永不滚动，始终贴合底部 -->
      <div v-if="showTabBar" class="tabbar-area">
        <slot name="tabbar" />
      </div>
      <div class="phone-home-bar">
        <div class="home-indicator"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showTabBar: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.phone-outer {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
}

.phone-body {
  position: relative;
  width: 375px;
  height: 812px;
  background: var(--echo-white);
  border-radius: 44px;
  overflow: hidden;
  /* 关键：transform 创建新的 fixed 定位包含块 */
  /* 所有内部弹窗的 position:fixed 都相对于 phone-body 而非 viewport */
  transform: translateZ(0);
  box-shadow:
    0 0 0 8px #1a1a2e,
    0 0 0 10px #2d2d44,
    0 0 0 12px #1a1a2e,
    0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.phone-notch-area {
  position: relative;
  width: 100%;
  height: 48px;
  background: var(--echo-white);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.phone-notch {
  width: 120px;
  height: 28px;
  background: #1a1a2e;
  border-radius: 20px;
}

/* 内容滚动区域 */
.phone-screen {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  position: relative;
  max-width: 375px;
  box-sizing: border-box;
  min-height: 0;
}

/* TabBar 固定区：在 phone-screen 和 home-bar 之间，不参与滚动 */
.tabbar-area {
  flex-shrink: 0;
  width: 100%;
  height: 56px;
  position: relative;
  z-index: 100;
}

.phone-home-bar {
  width: 100%;
  height: 32px;
  background: var(--echo-white);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.home-indicator {
  width: 120px;
  height: 4px;
  background: #1a1a2e;
  border-radius: 2px;
  opacity: 0.3;
}
</style>
