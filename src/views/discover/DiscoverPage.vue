<template>
  <div class="discover-page">
    <van-nav-bar title="发现" fixed placeholder />
    <div class="discover-content">
      <p class="placeholder-text">发现页</p>
      <p class="placeholder-hint">全平台热门内容聚合</p>
      <p class="placeholder-hint">（批次 4 搭建）</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.discover-page { min-height:100%; background:var(--echo-bg); }
.discover-content { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; }
.placeholder-text { font-size:18px; color:var(--echo-text); font-weight:600; }
.placeholder-hint { font-size:13px; color:var(--echo-text-hint); margin-top:8px; }
</style>
