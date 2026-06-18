<template>
  <div class="anon-message-page">
    <van-nav-bar title="匿名消息" left-arrow @click-left="$router.back()" />
    <div class="anon-message-content">
      <p class="placeholder-text">匿名消息二级页</p>
      <p class="placeholder-hint">匿名用户聊天 · 匿名圈消息 · 匿名会话列表</p>
      <p class="placeholder-hint">（批次 3 搭建）</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.anon-message-page { min-height:100%; background:var(--echo-bg); }
.anon-message-content { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; }
.placeholder-text { font-size:18px; color:var(--echo-text); font-weight:600; }
.placeholder-hint { font-size:13px; color:var(--echo-text-hint); margin-top:8px; }
</style>
