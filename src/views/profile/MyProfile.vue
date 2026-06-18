<template>
  <div class="my-profile-page">
    <van-nav-bar title="我" fixed placeholder>
      <template #right>
        <van-icon name="setting-o" @click="$router.push('/settings')" />
      </template>
    </van-nav-bar>
    <div class="my-profile-content">
      <p class="placeholder-text">个人主页 - 自己视角</p>
      <p class="placeholder-hint">设置 · 编辑主页 · 头像 · 昵称 · 回声号 · 声望</p>
      <p class="placeholder-hint">帖子 · 评论 · 收藏 · 赞过 · 草稿箱</p>
      <p class="placeholder-hint">（批次 3 搭建）</p>

      <div class="nav-links">
        <van-cell title="设置" is-link to="/settings" />
        <van-cell title="搜索" is-link to="/search" />
        <van-cell title="圈子" is-link to="/circle" />
        <van-cell title="查看他人主页示例" is-link to="/profile/demo" />
        <van-cell title="消息页" is-link to="/message" />
        <van-cell title="匿名消息" is-link to="/message/anon" />
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.my-profile-page { min-height:100%; background:var(--echo-bg); }
.my-profile-content { padding-bottom:60px; }
.nav-links { margin-top:20px; }
</style>
