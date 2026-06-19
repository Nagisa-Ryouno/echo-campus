<template>
  <div class="circle-page">
    <!-- 顶部栏 -->
    <div class="circle-header">
      <div class="nav-back" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </div>
      <h2 class="circle-title">我的圈子</h2>
    </div>

    <!-- Tab 切换 -->
    <div class="circle-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        class="circle-tab"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 圈子列表 -->
    <div class="circle-body">
      <!-- 我加入的 -->
      <div v-if="activeTab === 'joined'" class="circle-list">
        <div v-if="joinedCircles.length === 0" class="echo-empty">
          <div class="echo-empty-icon">🌐</div>
          <p class="echo-empty-text">还没有加入任何圈子</p>
          <p class="echo-empty-hint">去发现更多圈子吧</p>
        </div>
        <div
          v-for="circle in joinedCircles"
          :key="circle.id"
          class="circle-card"
        >
          <div class="circle-card-header">
            <div class="circle-icon" :style="{ background: circle.color }">
              {{ circle.icon }}
            </div>
            <div class="circle-info">
              <div class="circle-name">
                {{ circle.name }}
                <span v-if="circle.official" class="circle-badge-official">官方</span>
                <span v-if="circle.isAnon" class="circle-badge-anon">匿名</span>
              </div>
              <div class="circle-meta">{{ circle.memberCount }} 成员 · {{ circle.postCount }} 帖子</div>
            </div>
            <div class="circle-new-badge" v-if="circle.unread > 0">{{ circle.unread }}</div>
          </div>
          <p class="circle-desc">{{ circle.description }}</p>
          <div class="circle-latest" v-if="circle.latestPost">
            <span class="latest-label">最新：</span>
            <span class="latest-text">{{ circle.latestPost }}</span>
          </div>
        </div>
      </div>

      <!-- 推荐圈子 -->
      <div v-if="activeTab === 'recommend'" class="circle-list">
        <div
          v-for="circle in recommendCircles"
          :key="circle.id"
          class="circle-card"
        >
          <div class="circle-card-header">
            <div class="circle-icon" :style="{ background: circle.color }">
              {{ circle.icon }}
            </div>
            <div class="circle-info">
              <div class="circle-name">
                {{ circle.name }}
                <span v-if="circle.official" class="circle-badge-official">官方</span>
                <span v-if="circle.isAnon" class="circle-badge-anon">匿名</span>
              </div>
              <div class="circle-meta">{{ circle.memberCount }} 成员 · {{ circle.postCount }} 帖子</div>
            </div>
            <button class="join-btn" @click="onJoin(circle.id)">
              {{ circle.joined ? '已加入' : '+ 加入' }}
            </button>
          </div>
          <p class="circle-desc">{{ circle.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const activeTab = ref('joined')

const tabs = [
  { key: 'joined', label: '已加入' },
  { key: 'recommend', label: '推荐' }
]

const joinedCircles = reactive([
  {
    id: 'c1',
    name: '摄影爱好者协会',
    icon: '📷',
    color: 'linear-gradient(135deg, #667eea, #764ba2)',
    description: '用镜头记录校园生活的美好瞬间，欢迎分享你的摄影作品与心得',
    memberCount: 1286,
    postCount: 3456,
    unread: 3,
    official: true,
    isAnon: false,
    latestPost: '本周六组织校园外拍活动，有意向的同学请接龙~'
  },
  {
    id: 'c2',
    name: '考研交流群',
    icon: '📖',
    color: 'linear-gradient(135deg, #f093fb, #f5576c)',
    description: '考研资料分享、每日打卡、互相鼓励监督的学习社区',
    memberCount: 2340,
    postCount: 8900,
    unread: 12,
    official: false,
    isAnon: false,
    latestPost: '分享一套肖秀荣政治冲刺笔记，有需要的自取'
  },
  {
    id: 'c3',
    name: '校园匿名树洞',
    icon: '🌳',
    color: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    description: '说出你不敢说的话，匿名吐槽、倾诉、分享心事',
    memberCount: 5600,
    postCount: 23400,
    unread: 0,
    official: false,
    isAnon: true,
    latestPost: '有时候真的很羡慕那些勇敢表达自己的人...'
  },
  {
    id: 'c4',
    name: '日系摇滚同好会',
    icon: '🎸',
    color: 'linear-gradient(135deg, #fa709a, #fee140)',
    description: 'ONE OK ROCK、RADWIMPS、凛として時雨... 日系摇滚爱好者聚集地',
    memberCount: 456,
    postCount: 1230,
    unread: 0,
    official: false,
    isAnon: false,
    latestPost: '有人去看下个月的RADWIMPS演唱会吗？组队！'
  }
])

const recommendCircles = reactive([
  {
    id: 'c5',
    name: 'Coser聚集地',
    icon: '🎭',
    color: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    description: '动漫Cosplay、JK/DK制服、Lolita，二次元同好交流',
    memberCount: 890,
    postCount: 4500,
    official: false,
    isAnon: false,
    joined: false
  },
  {
    id: 'c6',
    name: '校园音乐节组委会',
    icon: '🎵',
    color: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
    description: '一年一度校园音乐节的策划、组织、演出安排',
    memberCount: 320,
    postCount: 567,
    official: true,
    isAnon: false,
    joined: false
  },
  {
    id: 'c7',
    name: '二手闲置交易',
    icon: '🔄',
    color: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
    description: '课本、电子产品、生活用品，低价转卖闲置好物',
    memberCount: 3200,
    postCount: 12000,
    official: false,
    isAnon: false,
    joined: true
  },
  {
    id: 'c8',
    name: '日语学习小组',
    icon: '🗾',
    color: 'linear-gradient(135deg, #fddb92, #d1fdff)',
    description: '一起学日语！N5到N1，每周单词打卡 + 口语练习',
    memberCount: 567,
    postCount: 2300,
    official: false,
    isAnon: false,
    joined: false
  }
])

function onJoin(circleId) {
  const circle = recommendCircles.find(c => c.id === circleId)
  if (circle) {
    circle.joined = !circle.joined
  }
}
</script>

<style scoped>
.circle-page {
  min-height: 100%;
  background: var(--echo-bg);
}

/* ===== 头部 ===== */
.circle-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--echo-white);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-back {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--echo-transition-fast);
  color: var(--echo-text);
}

.nav-back:active {
  background: var(--echo-bg);
}

.circle-title {
  font-size: var(--echo-text-xl);
  font-weight: var(--echo-weight-bold);
  color: var(--echo-text);
}

/* ===== Tab ===== */
.circle-tabs {
  display: flex;
  background: var(--echo-white);
  border-bottom: 1px solid var(--echo-border);
  position: sticky;
  top: 56px;
  z-index: 50;
}

.circle-tab {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: var(--echo-text-base);
  color: var(--echo-text-secondary);
  cursor: pointer;
  position: relative;
  transition: all var(--echo-transition-fast);
}

.circle-tab.active {
  color: var(--echo-primary);
  font-weight: var(--echo-weight-semibold);
}

.circle-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  border-radius: 2px;
  background: var(--echo-primary);
}

/* ===== 列表 ===== */
.circle-body {
  padding: 12px 16px;
}

.circle-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ===== 圈子卡片 ===== */
.circle-card {
  background: var(--echo-white);
  border-radius: var(--echo-radius);
  padding: 16px;
  transition: all var(--echo-transition-fast);
}

.circle-card:active {
  transform: scale(0.99);
}

.circle-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.circle-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.circle-info {
  flex: 1;
  min-width: 0;
}

.circle-name {
  font-size: var(--echo-text-lg);
  font-weight: var(--echo-weight-semibold);
  color: var(--echo-text);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.circle-badge-official {
  font-size: var(--echo-text-2xs);
  padding: 1px 6px;
  border-radius: var(--echo-radius-xs);
  background: var(--echo-primary-light);
  color: var(--echo-primary);
  font-weight: var(--echo-weight-semibold);
}

.circle-badge-anon {
  font-size: var(--echo-text-2xs);
  padding: 1px 6px;
  border-radius: var(--echo-radius-xs);
  background: #f0e6ff;
  color: #7c3aed;
  font-weight: var(--echo-weight-semibold);
}

.circle-meta {
  font-size: var(--echo-text-sm);
  color: var(--echo-text-hint);
  margin-top: 2px;
}

.circle-new-badge {
  min-width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  padding: 0 6px;
  background: var(--echo-danger);
  color: #fff;
  font-size: var(--echo-text-2xs);
  font-weight: var(--echo-weight-bold);
  border-radius: 10px;
  flex-shrink: 0;
}

.join-btn {
  padding: 6px 14px;
  border: 1.5px solid var(--echo-primary);
  border-radius: var(--echo-radius-full);
  background: transparent;
  color: var(--echo-primary);
  font-size: var(--echo-text-sm);
  font-weight: var(--echo-weight-medium);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--echo-transition-fast);
  white-space: nowrap;
  flex-shrink: 0;
}

.join-btn:active {
  background: var(--echo-primary-light);
  transform: scale(0.95);
}

.circle-desc {
  font-size: var(--echo-text-sm);
  color: var(--echo-text-secondary);
  line-height: 1.5;
  margin-bottom: 8px;
}

.circle-latest {
  font-size: var(--echo-text-sm);
  color: var(--echo-text-hint);
  padding-top: 8px;
  border-top: 1px solid var(--echo-divider);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.latest-label {
  color: var(--echo-primary);
  font-weight: var(--echo-weight-medium);
}

.latest-text {
  color: var(--echo-text-hint);
}
</style>
