<template>
  <div class="circle-page">
    <van-nav-bar title="圈子" left-arrow @click-left="$router.back()" />
    <div class="circle-content">
      <p class="placeholder-text">圈子页</p>
      <p class="placeholder-hint">普通圈 · 匿名圈 · 官方认证圈</p>
      <p class="placeholder-hint">（批次 4 搭建）</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.circle-page { min-height:100%; background:var(--echo-bg); }
.circle-content { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; }
.placeholder-text { font-size:18px; color:var(--echo-text); font-weight:600; }
.placeholder-hint { font-size:13px; color:var(--echo-text-hint); margin-top:8px; }
</style>
