<template>
  <div class="settings-page">
    <van-nav-bar title="设置" left-arrow @click-left="$router.back()" />
    <div class="settings-content">
      <p class="placeholder-text">设置页</p>
      <p class="placeholder-hint">隐私设置 · 账号安全 · 通知管理 · 通用设置</p>
      <p class="placeholder-hint">（批次 4 搭建）</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.settings-page { min-height:100%; background:var(--echo-bg); }
.settings-content { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; }
.placeholder-text { font-size:18px; color:var(--echo-text); font-weight:600; }
.placeholder-hint { font-size:13px; color:var(--echo-text-hint); margin-top:8px; }
</style>
