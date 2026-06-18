<template>
  <div class="user-profile-page">
    <van-nav-bar title="用户主页" left-arrow @click-left="$router.back()" />
    <div class="user-profile-content">
      <p class="placeholder-text">他人主页</p>
      <p class="placeholder-hint">头像 · 昵称 · 回声号 · 关注数 · 粉丝数</p>
      <p class="placeholder-hint">仅展示对方允许查看的内容</p>
      <p class="placeholder-hint">（批次 3 搭建）</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.user-profile-page { min-height:100%; background:var(--echo-bg); }
.user-profile-content { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; }
.placeholder-text { font-size:18px; color:var(--echo-text); font-weight:600; }
.placeholder-hint { font-size:13px; color:var(--echo-text-hint); margin-top:8px; }
</style>
