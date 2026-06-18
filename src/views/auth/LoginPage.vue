<template>
  <div class="login-page">
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()" />
    <div class="login-body">
      <div class="login-form">
        <div class="login-icon">
          <div class="login-avatar">校</div>
        </div>
        <h2 class="login-welcome">欢迎回来</h2>
        <van-field v-model="form.email" label="邮箱" placeholder="请输入校园邮箱" />
        <van-field v-model="form.password" label="密码" type="password" placeholder="请输入密码" />
        <van-button round block type="primary" style="margin-top:32px" @click="handleLogin">登录</van-button>
        <div class="login-links">
          <span @click="$router.push('/register')">没有账号？去注册</span>
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
  min-height: 100%;
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
  padding: 0 20px 40px;
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
</style>
