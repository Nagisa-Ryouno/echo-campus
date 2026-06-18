<template>
  <div class="search-page">
    <van-nav-bar left-arrow @click-left="$router.back()">
      <template #title>
        <van-search v-model="keyword" placeholder="搜索用户、帖子、话题" shape="round" />
      </template>
    </van-nav-bar>
    <div class="search-content">
      <p class="placeholder-text">搜索页</p>
      <p class="placeholder-hint">（批次 4 搭建）</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const keyword = ref('')
</script>

<style scoped>
.search-page { min-height:100%; background:var(--echo-bg); }
.search-content { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; }
.placeholder-text { font-size:18px; color:var(--echo-text); font-weight:600; }
.placeholder-hint { font-size:13px; color:var(--echo-text-hint); margin-top:8px; }
</style>
