// 帖子 Mock 数据
// 各频道专属小标签池（完全不同）
export const channelTagMap = {
  meet: [],       // 遇见频道：无标签，展示用户卡片
  follow: [],     // 关注频道：无标签，展示关注用户头像
  recommend: ['摄影', '音乐', '电影', '动漫', '游戏', '科技', '穿搭', '美食', '旅行', '读书'],
  city: ['探店', '活动', '搭子', '租房', '自习', '兼职', '运动', '演出', '展览'],
  school: ['二手闲置', '校园活动', '学习干货', '表白墙', '失物招领', '社团招新', '宿舍日常', '食堂测评', '选课攻略']
}

// 所有标签合集（用于管理面板兼容旧逻辑）
export const allCategoryTags = [
  ...channelTagMap.recommend,
  ...channelTagMap.city,
  ...channelTagMap.school
]

export const topicTags = [
  '考研', '期末复习', '四六级', '摄影', '运动',
  '美食', '兼职', '社团招新', '租房', '实习',
  '雅思', '托福', '考公', '留学', '面试'
]

export const channels = [
  { key: 'meet', label: '遇见' },
  { key: 'follow', label: '关注' },
  { key: 'recommend', label: '推荐' },
  { key: 'city', label: '同城' },
  { key: 'school', label: '我的学校' }
]

export const mockPosts = [
  // ===== 推荐频道 =====
  {
    id: 'p001',
    authorId: 'u2',
    content: '今天在图书馆门口的草坪上发现了一只超可爱的小橘猫！有人认识它吗？看起来像是走丢的。🐱',
    images: [],
    categoryTag: '失物招领',
    topicTags: ['校园'],
    visibility: 'public',
    schoolOnly: true,
    isAnon: false,
    likeCount: 128,
    commentCount: 45,
    collectCount: 23,
    forwardCount: 40,
    createdAt: '2026-06-18 15:32',
    channel: 'recommend'
  },
  {
    id: 'p002',
    authorId: 'u4',
    content: '分享一个超级好用的文献管理工具 Zotero，配合浏览器插件一键抓取论文信息。考研党和写论文的同学必备！📚\n\n教程已整理在评论区~',
    images: [],
    categoryTag: '学习干货',
    topicTags: ['考研', '论文'],
    visibility: 'public',
    schoolOnly: false,
    isAnon: false,
    likeCount: 356,
    commentCount: 89,
    collectCount: 178,
    forwardCount: 7,
    createdAt: '2026-06-17 21:15',
    channel: 'recommend'
  },
  {
    id: 'p003',
    authorId: 'u1',
    content: '用长焦镜头在学校操场拍的落日，21:9 裁切出来真的太有电影感了！有没有同样喜欢摄影的朋友约拍呀 📷',
    images: [],
    categoryTag: '摄影记录',
    topicTags: ['摄影', '校园'],
    visibility: 'public',
    schoolOnly: false,
    isAnon: false,
    likeCount: 89,
    commentCount: 27,
    collectCount: 34,
    forwardCount: 1,
    createdAt: '2026-06-17 18:45',
    channel: 'recommend'
  },
  {
    id: 'p004',
    authorId: 'u6',
    content: '六级终于过了！425 分飘过也是过了😭 分享一下备考经验，听力一定要多磨耳朵，推荐每日英语听力 App',
    images: [],
    categoryTag: '学业交流',
    topicTags: ['四六级', '英语'],
    visibility: 'public',
    schoolOnly: false,
    isAnon: false,
    likeCount: 567,
    commentCount: 134,
    collectCount: 245,
    forwardCount: 47,
    createdAt: '2026-06-16 10:20',
    channel: 'recommend'
  },

  // ===== 同城频道 =====
  {
    id: 'p005',
    authorId: 'u3',
    content: '海淀区有什么好吃的日料店推荐吗？最好是人均 100 以内的～ 🍣',
    images: [],
    categoryTag: '美食探店',
    topicTags: ['美食', '日料'],
    visibility: 'public',
    schoolOnly: false,
    isAnon: false,
    likeCount: 45,
    commentCount: 32,
    collectCount: 8,
    forwardCount: 17,
    createdAt: '2026-06-18 12:00',
    channel: 'city'
  },
  {
    id: 'p006',
    authorId: 'u7',
    content: '明天下午 3 点民大篮球场约球！3v3 半场，目前缺 2 人，有来的吗 🏀',
    images: [],
    categoryTag: '校园搭子',
    topicTags: ['篮球', '运动'],
    visibility: 'public',
    schoolOnly: true,
    isAnon: false,
    likeCount: 23,
    commentCount: 15,
    collectCount: 3,
    forwardCount: 15,
    createdAt: '2026-06-18 14:30',
    channel: 'school'
  },

  // ===== 我的学校频道 =====
  {
    id: 'p007',
    authorId: 'u5',
    content: '在三号教学楼 302 捡到一个黑色钱包，里面有身份证和校园卡。失主请联系我！',
    images: [],
    categoryTag: '失物招领',
    topicTags: ['校园'],
    visibility: 'public',
    schoolOnly: true,
    isAnon: false,
    likeCount: 56,
    commentCount: 12,
    collectCount: 2,
    forwardCount: 14,
    createdAt: '2026-06-18 16:00',
    channel: 'school'
  },
  {
    id: 'p008',
    authorId: 'u1',
    content: '出一个几乎全新的机械键盘，Cherry 青轴 RGB，买了不到一个月，299 出。宿舍太安静了不好意思用 😅',
    images: [],
    categoryTag: '二手闲置',
    topicTags: ['数码', '二手'],
    visibility: 'public',
    schoolOnly: true,
    isAnon: false,
    likeCount: 34,
    commentCount: 28,
    collectCount: 15,
    forwardCount: 8,
    createdAt: '2026-06-17 20:00',
    channel: 'school'
  },
  {
    id: 'p009',
    authorId: 'u2',
    content: '这周六学校大礼堂有民乐团专场演出！免费入场，19:00 开始，喜欢国风音乐的同学不要错过 🎵',
    images: [],
    categoryTag: '校园活动',
    topicTags: ['音乐', '社团'],
    visibility: 'public',
    schoolOnly: true,
    isAnon: false,
    likeCount: 234,
    commentCount: 56,
    collectCount: 89,
    forwardCount: 47,
    createdAt: '2026-06-16 09:00',
    channel: 'school'
  },
  {
    id: 'p010',
    authorId: 'u3',
    content: '考研真的好累...有没有一起在图书馆复习的搭子？最好能互相监督打卡那种 📖',
    images: [],
    categoryTag: '校园搭子',
    topicTags: ['考研', '学习'],
    visibility: 'public',
    schoolOnly: true,
    isAnon: false,
    likeCount: 167,
    commentCount: 78,
    collectCount: 45,
    forwardCount: 6,
    createdAt: '2026-06-15 23:45',
    channel: 'school'
  },

  // ===== 表白墙 / 树洞 =====
  {
    id: 'p011',
    authorId: 'u1',
    content: '昨天下午在图书馆二楼靠窗的位置看到一个穿白色卫衣的女生，笑起来超好看。不知道能不能捞到人 🌸',
    images: [],
    categoryTag: '表白墙',
    topicTags: ['校园'],
    visibility: 'public',
    schoolOnly: true,
    isAnon: true,
    likeCount: 445,
    commentCount: 167,
    collectCount: 56,
    forwardCount: 43,
    createdAt: '2026-06-17 22:00',
    channel: 'school'
  },
  {
    id: 'p012',
    authorId: 'u2',
    content: '说实话，有时候真的很想家。在外地上学，虽然朋友很多，但夜深人静的时候还是会觉得孤独。不知道有没有人和我一样...',
    images: [],
    categoryTag: '校园树洞',
    topicTags: ['情感', '生活'],
    visibility: 'public',
    schoolOnly: false,
    isAnon: true,
    likeCount: 678,
    commentCount: 234,
    collectCount: 89,
    forwardCount: 47,
    createdAt: '2026-06-18 01:30',
    channel: 'school'
  },

  // ===== 关注频道 =====
  {
    id: 'p013',
    authorId: 'u5',
    content: '给大家看看我最近画的插画 🎨 用 Procreate 画的，主题是《星空下的校园》',
    images: [],
    categoryTag: '摄影记录',
    topicTags: ['绘画', '艺术'],
    visibility: 'public',
    schoolOnly: false,
    isAnon: false,
    likeCount: 89,
    commentCount: 23,
    collectCount: 45,
    forwardCount: 34,
    createdAt: '2026-06-17 16:00',
    channel: 'follow'
  },
  {
    id: 'p014',
    authorId: 'u7',
    content: '校队训练日常，今天体能训练跑了个 5 公里，感觉腿已经不是自己的了 😂',
    images: [],
    categoryTag: '校园活动',
    topicTags: ['运动', '篮球'],
    visibility: 'public',
    schoolOnly: true,
    isAnon: false,
    likeCount: 76,
    commentCount: 21,
    collectCount: 8,
    forwardCount: 5,
    createdAt: '2026-06-18 07:30',
    channel: 'follow'
  },

  // ===== 遇见频道 =====
  {
    id: 'p015',
    authorId: 'u6',
    content: '有人一起打卡 30 天英语口语吗？每天发一段语音，互相纠正发音那种 🎙️',
    images: [],
    categoryTag: '校园搭子',
    topicTags: ['英语', '口语'],
    visibility: 'public',
    schoolOnly: false,
    isAnon: false,
    likeCount: 123,
    commentCount: 67,
    collectCount: 34,
    forwardCount: 37,
    createdAt: '2026-06-16 20:00',
    channel: 'meet'
  },
  {
    id: 'p016',
    authorId: 'u1',
    content: '民大附近有什么好的健身房推荐吗？最好带游泳池的，想减脂增肌 🏊',
    images: [],
    categoryTag: '校园搭子',
    topicTags: ['健身', '运动'],
    visibility: 'public',
    schoolOnly: false,
    isAnon: false,
    likeCount: 45,
    commentCount: 32,
    collectCount: 7,
    forwardCount: 27,
    createdAt: '2026-06-18 11:00',
    channel: 'city',
    city: '北京'
  },
  {
    id: 'p016_sh',
    authorId: 'u3',
    content: '在上海五角场附近求个周末自习搭子，一起去五角场创智天地自习室刷题～ 📖',
    images: [],
    categoryTag: '搭子',
    topicTags: ['自习', '搭子'],
    visibility: 'public',
    schoolOnly: false,
    isAnon: false,
    likeCount: 12,
    commentCount: 4,
    collectCount: 2,
    forwardCount: 1,
    createdAt: '2026-06-19 14:00',
    channel: 'city',
    city: '上海'
  },

  // ===== 更多推荐 =====
  {
    id: 'p017',
    authorId: 'u2',
    content: 'OOTD | 今天的学院风穿搭，白衬衫+格纹百褶裙+马丁靴，很适合上课穿 👗',
    images: [],
    categoryTag: '校园穿搭',
    topicTags: ['穿搭', '学院风'],
    visibility: 'public',
    schoolOnly: false,
    isAnon: false,
    likeCount: 234,
    commentCount: 89,
    collectCount: 123,
    forwardCount: 2,
    createdAt: '2026-06-17 10:00',
    channel: 'recommend'
  },
  {
    id: 'p018',
    authorId: 'u4',
    content: '开源了一个基于 Vue 3 的校园课程表组件，支持导入教务系统课表，GitHub 求 Star ⭐',
    images: [],
    categoryTag: '学习干货',
    topicTags: ['编程', '开源'],
    visibility: 'public',
    schoolOnly: false,
    isAnon: false,
    likeCount: 412,
    commentCount: 156,
    collectCount: 278,
    forwardCount: 1,
    createdAt: '2026-06-15 14:00',
    channel: 'recommend'
  }
]

// 辅助函数
export function getPostsByChannel(channel) {
  return mockPosts.filter(p => p.channel === channel)
}

export function getPostsByCategoryTag(channel, tag) {
  const channelPosts = getPostsByChannel(channel)
  if (!tag) return channelPosts
  return channelPosts.filter(p => p.categoryTag === tag)
}

export function getPostById(id) {
  return mockPosts.find(p => p.id === id)
}
