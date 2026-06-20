<template>
  <div class="phone-outer">
    <div class="phone-body">
      <div class="phone-notch-area">
        <div class="status-bar-left">
          <span class="status-time">09:41</span>
        </div>
        <div class="phone-notch"></div>
        <div class="status-bar-right">
          <span class="status-signal">
            <span class="bar bar-1"></span>
            <span class="bar bar-2"></span>
            <span class="bar bar-3"></span>
            <span class="bar bar-4"></span>
          </span>
          <span class="status-wifi">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style="display: block;">
              <path d="M12 21a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-4.9-5.1a1 1 0 0 1 0-1.4 7 7 0 0 1 9.8 0 1 1 0 1 1-1.4 1.4 5 5 0 0 0-7 0 1 1 0 0 1-1.4 0zm-2.8-2.9a1 1 0 0 1 0-1.4 11 11 0 0 1 15.4 0 1 1 0 0 1-1.4 1.4 9 9 0 0 0-12.6 0 1 1 0 0 1-1.4 0zm-2.8-2.9a1 1 0 0 1 0-1.4 15 15 0 0 1 21 0 1 1 0 0 1-1.4 1.4 13 13 0 0 0-18.2 0 1 1 0 0 1-1.4 0z"/>
            </svg>
          </span>
          <span class="status-battery">
            <span class="battery-body">
              <span class="battery-level"></span>
            </span>
            <span class="battery-cap"></span>
          </span>
        </div>
      </div>
      <!-- 内容区：可滚动 -->
      <div id="phone-screen" class="phone-screen">
        <slot name="content" />
      </div>
      <!-- TabBar 固定区：永不滚动，始终贴合底部 -->
      <div v-if="showTabBar" class="tabbar-area">
        <slot name="tabbar" />
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
  justify-content: space-between;
  padding: 0 16px 0 20px;
  box-sizing: border-box;
  z-index: 100;
}

.phone-notch {
  position: absolute;
  left: 50%;
  top: 14px;
  transform: translateX(-50%);
  width: 85px;
  height: 20px;
  background: #1a1a2e;
  border-radius: 10px;
}

.status-bar-left {
  display: flex;
  align-items: center;
  z-index: 10;
}
.status-time {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  letter-spacing: -0.2px;
}

.status-bar-right {
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 10;
}

.status-signal {
  display: inline-flex;
  align-items: flex-end;
  gap: 1.5px;
  height: 10px;
  width: 14px;
}
.status-signal .bar {
  width: 2.2px;
  background: #1a1a2e;
  border-radius: 0.5px;
}
.status-signal .bar-1 { height: 3px; }
.status-signal .bar-2 { height: 5px; }
.status-signal .bar-3 { height: 7.5px; }
.status-signal .bar-4 { height: 10px; }

.status-wifi {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1a1a2e;
}

.status-battery {
  display: inline-flex;
  align-items: center;
  position: relative;
  width: 20px;
  height: 10.5px;
}
.battery-body {
  width: 18px;
  height: 10.5px;
  border: 1px solid #1a1a2e;
  border-radius: 3px;
  padding: 1px;
  box-sizing: border-box;
  display: flex;
}
.battery-level {
  width: 75%;
  height: 100%;
  background: #1a1a2e;
  border-radius: 1px;
}
.battery-cap {
  width: 1.5px;
  height: 4px;
  background: #1a1a2e;
  border-radius: 0 1px 1px 0;
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
}

/* 内容滚动区域 */
.phone-screen {
  flex: 1;
  height: 0;

  display: flex;
  flex-direction: column;

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

/* 内容滚动区域 */
</style>
