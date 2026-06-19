<template>
  <div class="splash-page" :class="{ loaded }">
    <!-- 背景光晕 -->
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>

    <!-- 中间内容 -->
    <div class="splash-content">
      <!-- Logo 外层炫光壳 -->
      <div class="logo-wrap">
        <div class="logo-ring"></div>
        <div class="logo-core">
          <img
            class="splash-logo-img"
            :src="logoImg"
            alt="校声 Logo"
          />
        </div>
      </div>

      <!-- 英文名 -->
      <div class="splash-subtitle">Echo Campus</div>

      <!-- 标语 -->
      <div class="splash-desc">发现同频的人，记录真实校园生活</div>
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

      <div class="splash-skip" @click="$router.push('/home')">
        先随便看看 →
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import logoImg from '@/assets/logo.png'

const loaded = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    loaded.value = true
  })
})
</script>

<style scoped>
.splash-page {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background:
    radial-gradient(circle at top, rgba(78, 205, 196, 0.24), transparent 35%),
    linear-gradient(160deg, #e8f5ee 0%, #f5f7fa 52%, #e3f7ef 100%);
  padding: 48px 32px 36px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;

  opacity: 0;
  transform: translateY(18px) scale(0.985);
  transition:
    opacity 0.65s ease,
    transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.splash-page.loaded {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 背景飘浮光球 */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(18px);
  pointer-events: none;
  opacity: 0.75;
}

.orb-1 {
  width: 180px;
  height: 180px;
  left: -40px;
  top: 56px;
  background: rgba(77, 181, 121, 0.18);
  animation: floatOrb 7s ease-in-out infinite;
}

.orb-2 {
  width: 220px;
  height: 220px;
  right: -70px;
  bottom: 72px;
  background: rgba(80, 180, 255, 0.16);
  animation: floatOrb 8.5s ease-in-out infinite reverse;
}

@keyframes floatOrb {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-10px) translateX(6px);
  }
}

.splash-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Logo 外层 */
.logo-wrap {
  position: relative;
  width: 184px;
  height: 184px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;

  transform: translateY(8px) scale(0.96);
  opacity: 0;
  transition:
    transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1) 0.08s,
    opacity 0.75s ease 0.08s;
}

.splash-page.loaded .logo-wrap {
  transform: translateY(0) scale(1);
  opacity: 1;
}

/* 外圈光环 */
.logo-ring {
  position: absolute;
  inset: 0;
  border-radius: 34px;
  background:
    linear-gradient(135deg, rgba(79, 181, 121, 0.22), rgba(78, 205, 196, 0.12), rgba(95, 178, 255, 0.22));
  box-shadow:
    0 18px 40px rgba(76, 175, 125, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.55) inset;
  backdrop-filter: blur(10px);
}

.logo-core {
  position: relative;
  width: 158px;
  height: 158px;
  border-radius: 30px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.56), rgba(255, 255, 255, 0.26));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 12px 24px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.7) inset;
  overflow: hidden;
}

.logo-core::before {
  content: "";
  position: absolute;
  inset: -20%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.0) 35%,
    rgba(255, 255, 255, 0.42) 50%,
    rgba(255, 255, 255, 0.0) 65%
  );
  transform: translateX(-60%) rotate(18deg);
  animation: shine 4.8s ease-in-out infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-70%) rotate(18deg);
    opacity: 0;
  }
  35% {
    opacity: 1;
  }
  60% {
    opacity: 0;
  }
  100% {
    transform: translateX(70%) rotate(18deg);
    opacity: 0;
  }
}

.splash-logo-img {
  width: 128px;
  height: 128px;
  object-fit: contain;
  position: relative;
  z-index: 1;
  user-select: none;
  -webkit-user-drag: none;
  filter:
    drop-shadow(0 8px 16px rgba(35, 111, 82, 0.18))
    drop-shadow(0 0 10px rgba(105, 212, 178, 0.24));
  animation: logoFloat 4s ease-in-out infinite;
}

@keyframes logoFloat {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-5px) scale(1.02);
  }
}

.splash-subtitle {
  margin-top: 22px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 4px;
  color: var(--echo-primary-dark);

  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.55s ease 0.2s,
    transform 0.55s ease 0.2s;
}

.splash-page.loaded .splash-subtitle {
  opacity: 1;
  transform: translateY(0);
}

.splash-desc {
  margin-top: 14px;
  font-size: 14px;
  line-height: 1.7;
  text-align: center;
  letter-spacing: 1px;
  color: var(--echo-text-secondary);

  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.55s ease 0.3s,
    transform 0.55s ease 0.3s;
}

.splash-page.loaded .splash-desc {
  opacity: 1;
  transform: translateY(0);
}

/* 底部按钮 */
.splash-actions {
  width: 100%;
  flex-shrink: 0;

  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 0.6s ease 0.42s,
    transform 0.6s ease 0.42s;
}

.splash-page.loaded .splash-actions {
  opacity: 1;
  transform: translateY(0);
}

.main-btn {
  height: 46px;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 10px 22px rgba(76, 175, 125, 0.18);
}

.sub-btn {
  margin-top: 14px;
  height: 46px;
  font-size: 15px;
  font-weight: 600;
}

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