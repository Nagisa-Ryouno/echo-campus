<template>
  <div class="splash-page">
    <!-- 中间内容 -->
    <div class="splash-content">

      <!-- Logo 图片 -->
      <img
        class="splash-logo-img"
        src="@/assets/logo.png"
        alt="校声 Logo"
      />

      <!-- 英文名 -->
      <div class="splash-subtitle">
        Echo Campus
      </div>

      <!-- 标语 -->
      <div class="splash-desc">
        发现同频的人，记录真实校园生活
      </div>

    </div>

    <!-- 底部按钮 -->
    <div class="splash-actions">

      <van-button
        round
        block
        type="primary"
        class="main-btn"
        @click="$router.push('/register')"
      >
        注册账号
      </van-button>

      <van-button
        round
        block
        plain
        type="primary"
        class="sub-btn"
        @click="$router.push('/login')"
      >
        已有账号，去登录
      </van-button>

      <div
        class="splash-skip"
        @click="$router.push('/home')"
      >
        先随便看看 →
      </div>

    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* 整页背景 */
.splash-page {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background:
    linear-gradient(
      160deg,
      #e8f5ee 0%,
      #f5f7fa 50%,
      #e8f5ee 100%
    );
  padding: 48px 32px 36px;
  box-sizing: border-box;
  overflow: hidden;
}

/* 中间主体 */
.splash-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Logo 图片 */
.splash-logo-img {
  width: 180px;
  height: 180px;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;

  filter:
    drop-shadow(0 8px 24px rgba(72, 181, 120, 0.18));

  animation: logoFloat 4s ease-in-out infinite;
}

/* Logo 微浮动动画 */
@keyframes logoFloat {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-6px);
  }

  100% {
    transform: translateY(0px);
  }
}

/* 英文标题 */
.splash-subtitle {
  margin-top: 22px;

  font-size: 20px;
  font-weight: 600;
  letter-spacing: 4px;

  color: var(--echo-primary-dark);
}

/* 描述文案 */
.splash-desc {
  margin-top: 14px;

  font-size: 14px;
  line-height: 1.7;
  text-align: center;
  letter-spacing: 1px;

  color: var(--echo-text-secondary);
}

/* 底部按钮区 */
.splash-actions {
  width: 100%;
  flex-shrink: 0;
}

/* 主按钮 */
.main-btn {
  height: 46px;
  font-size: 15px;
  font-weight: 600;
}

/* 次按钮 */
.sub-btn {
  margin-top: 14px;
  height: 46px;
  font-size: 15px;
  font-weight: 600;
}

/* 跳过按钮 */
.splash-skip {
  margin-top: 28px;

  text-align: center;

  font-size: 13px;
  letter-spacing: 0.5px;

  color: var(--echo-text-hint);

  cursor: pointer;

  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.splash-skip:hover {
  color: var(--echo-primary);
}

.splash-skip:active {
  transform: scale(0.96);
}
</style>