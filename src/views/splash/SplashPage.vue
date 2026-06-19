<template>
  <div class="splash-page">

    <!-- 背景光晕 -->
    <div class="bg-glow glow-1"></div>
    <div class="bg-glow glow-2"></div>

    <!-- 主体 -->
    <div class="splash-content">

      <!-- Logo -->
      <img
        src="/logo.png"
        alt="校声 Logo"
        class="splash-logo"
      />

      <!-- 英文名 -->
      <div class="splash-subtitle">
        Echo Campus
      </div>

      <!-- 标语 -->
      <div class="splash-desc">
        发现同频的人，记录校园生活
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="splash-actions">
      <van-button
        round
        block
        type="primary"
        @click="$router.push('/register')"
      >
        注册账号
      </van-button>

      <van-button
        round
        block
        plain
        type="primary"
        @click="$router.push('/login')"
        style="margin-top:12px"
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
/* 页面 */
.splash-page {
  position: relative;
  overflow: hidden;

  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  background:
    linear-gradient(
      160deg,
      #eefaf3 0%,
      #f7f9fc 45%,
      #eefaf3 100%
    );

  padding: 60px 32px;
  box-sizing: border-box;

  animation: pageFade 1s ease;
}

/* 主内容 */
.splash-content {
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: relative;
  z-index: 2;
}

/* Logo */
.splash-logo {
  width: 170px;
  height: 170px;
  object-fit: contain;

  animation:
    logoEnter 1.1s ease,
    logoFloat 4s ease-in-out infinite;

  filter:
    drop-shadow(0 8px 24px rgba(76, 175, 125, 0.18))
    drop-shadow(0 2px 6px rgba(76, 175, 125, 0.12));
}

/* 英文名 */
.splash-subtitle {
  margin-top: 18px;

  font-size: 18px;
  font-weight: 500;
  letter-spacing: 6px;

  color: var(--echo-primary);

  opacity: 0;

  animation:
    textFade 0.8s ease forwards;

  animation-delay: 0.35s;
}

/* 标语 */
.splash-desc {
  margin-top: 22px;

  font-size: 14px;
  line-height: 1.7;
  letter-spacing: 1px;

  color: var(--echo-text-secondary);

  opacity: 0;

  animation:
    textFade 0.8s ease forwards;

  animation-delay: 0.55s;
}

/* 底部按钮 */
.splash-actions {
  width: 100%;
  padding-bottom: 20px;

  z-index: 2;

  opacity: 0;

  animation:
    textFade 0.8s ease forwards;

  animation-delay: 0.75s;
}

.splash-skip {
  text-align: center;
  margin-top: 24px;

  font-size: 13px;
  color: var(--echo-text-hint);

  cursor: pointer;
}

/* 背景光晕 */
.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.35;
}

/* 左上 */
.glow-1 {
  width: 240px;
  height: 240px;

  background: rgba(76, 175, 125, 0.22);

  top: -80px;
  left: -60px;

  animation: glowMove1 8s ease-in-out infinite;
}

/* 右下 */
.glow-2 {
  width: 220px;
  height: 220px;

  background: rgba(33, 150, 243, 0.14);

  bottom: -80px;
  right: -50px;

  animation: glowMove2 9s ease-in-out infinite;
}

/* 页面渐入 */
@keyframes pageFade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Logo 入场 */
@keyframes logoEnter {
  0% {
    opacity: 0;
    transform:
      translateY(24px)
      scale(0.82);
  }

  100% {
    opacity: 1;
    transform:
      translateY(0)
      scale(1);
  }
}

/* Logo 漂浮 */
@keyframes logoFloat {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }

  100% {
    transform: translateY(0px);
  }
}

/* 文字渐入 */
@keyframes textFade {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 光晕动画 */
@keyframes glowMove1 {
  0% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(20px, 10px);
  }

  100% {
    transform: translate(0, 0);
  }
}

@keyframes glowMove2 {
  0% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(-20px, -10px);
  }

  100% {
    transform: translate(0, 0);
  }
}
</style>