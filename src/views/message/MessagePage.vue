<template>
  <div class="message-page">
    <van-nav-bar title="消息" fixed placeholder>
      <template #right>
        <van-icon name="search" @click="$router.push('/search')" />
      </template>
    </van-nav-bar>
    <div class="message-content">
      <p class="placeholder-text">消息页</p>
      <p class="placeholder-hint">通知分类 · 私聊列表 · 匿名消息入口</p>
      <p class="placeholder-hint">（批次 3 搭建）</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.message-page { min-height:100%; background:var(--echo-bg); }
.message-content { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; }
.placeholder-text { font-size:18px; color:var(--echo-text); font-weight:600; }
.placeholder-hint { font-size:13px; color:var(--echo-text-hint); margin-top:8px; }
</style>
