<template>
  <div class="splash-page">
    <div class="splash-content">
      <div class="splash-logo">校声</div>
      <div class="splash-subtitle">Echo Campus</div>
      <div class="splash-desc">发现同频的人，记录校园生活</div>
    </div>
    <div class="splash-actions">
      <van-button round block type="primary" @click="$router.push('/register')">注册账号</van-button>
      <van-button round block plain type="primary" @click="$router.push('/login')" style="margin-top:12px">已有账号，去登录</van-button>
      <div class="splash-skip" @click="$router.push('/home')">先随便看看 →</div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.splash-page {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #e8f5ee 0%, #f5f7fa 50%, #e8f5ee 100%);
  padding: 60px 32px;
  box-sizing: border-box;
}

.splash-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.splash-logo {
  font-size: 52px;
  font-weight: 700;
  color: var(--echo-primary-dark);
  letter-spacing: 12px;
}

.splash-subtitle {
  font-size: 18px;
  color: var(--echo-primary);
  margin-top: 12px;
  letter-spacing: 6px;
  font-weight: 300;
}

.splash-desc {
  font-size: 14px;
  color: var(--echo-text-secondary);
  margin-top: 24px;
  letter-spacing: 2px;
}

.splash-actions {
  width: 100%;
  padding-bottom: 20px;
  flex-shrink: 0;
}

.splash-skip {
  text-align: center;
  margin-top: 24px;
  font-size: 13px;
  color: var(--echo-text-hint);
  cursor: pointer;
}
</style>
