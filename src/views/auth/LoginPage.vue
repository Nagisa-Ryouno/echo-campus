<template>
  <div class="login-page">
    <div class="floating-back" @click="$router.back()">
      ←
    </div>

    <div class="login-body">
      <div class="login-form">
        <div class="login-icon">
          <div class="login-avatar">校</div>
        </div>

        <h2 class="login-welcome">欢迎回来</h2>

        <van-field
          v-model="form.email"
          label="账号"
          placeholder="请输入校声号/校园邮箱"
        />

        <van-field
          v-model="form.password"
          label="密码"
          type="password"
          placeholder="请输入密码"
        />

        <van-button
          round
          block
          type="primary"
          style="margin-top:32px"
          @click="handleLogin"
        >
          登录
        </van-button>

        <div class="login-links">
          <span @click="$router.push('/register')">
            没有账号？去注册
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { showToast } from 'vant'

const form = reactive({ email: '', password: '' })

function handleLogin() {
  showToast('登录功能后续实现')
}
</script>

<style scoped>
.login-page {
  flex: 1;
  height: 100%;

  display: flex;
  flex-direction: column;

  background: var(--echo-bg);
}

.login-body {
  flex: 1;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 20px;
}

.login-form {
  width: 100%;
  max-width: 320px;
}

.login-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.login-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--echo-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
}

.login-welcome {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  color: var(--echo-text);
  margin-bottom: 24px;
}

.login-links {
  text-align: center;
  margin-top: 24px;
  font-size: 13px;
  color: var(--echo-primary);
  cursor: pointer;
}

.floating-back {
  position: absolute;
  top: 18px;
  left: 16px;

  width: 36px;
  height: 36px;

  border-radius: 50%;
  background: rgba(255,255,255,0.9);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
  color: var(--echo-text);

  z-index: 10;

  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
</style>
