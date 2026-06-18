<template>
  <div class="register-page">
    <div class="floating-back" @click="$router.back()">
    ←
    </div>
    <div class="register-body">
      <div class="register-form">
        <div class="register-icon">
          <div class="register-avatar">+</div>
        </div>
        <h2 class="register-title">创建账号</h2>
        <van-field v-model="form.school" label="学校" placeholder="请选择学校" is-link readonly />
        <van-field v-model="form.email" label="邮箱" placeholder="请输入校园邮箱" />
        <van-field v-model="form.studentId" label="学号" placeholder="请输入学号" />
        <van-field v-model="form.nickname" label="昵称" placeholder="设置你的昵称" />
        <van-field v-model="form.password" label="密码" type="password" placeholder="设置密码" />
        <van-button round block type="primary" style="margin-top:32px" @click="handleRegister">注册</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { showToast } from 'vant'

const form = reactive({ school: '', email: '', studentId: '', nickname: '', password: '' })

function handleRegister() {
  showToast('注册功能后续实现')
}
</script>

<style scoped>
.register-page {
  flex: 1;
  height: 100%;

  display: flex;
  flex-direction: column;

  background: var(--echo-bg);
}

.register-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px 40px;
}

.register-form {
  width: 100%;
  max-width: 320px;
}

.register-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.register-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--echo-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
}

.register-title {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  color: var(--echo-text);
  margin-bottom: 24px;
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
