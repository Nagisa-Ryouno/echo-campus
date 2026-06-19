// 消息 Mock 数据

// ===== 通知分类数据 =====
export const notifications = {
  // 收到喜欢（仅点赞通知，不含收藏）
  receivedLikes: [
    { id: 'n1', type: 'like', userId: 'u2', postId: 'p001', content: '赞了你的帖子', postPreview: '有没有人认识这只猫？', time: '10分钟前', read: false },
    { id: 'n3', type: 'like', userId: 'u4', postId: 'p003', content: '赞了你的帖子', postPreview: '宿舍阳台的多肉又开了', time: '1小时前', read: false },
    { id: 'n14', type: 'like', userId: 'u6', postId: 'p006', content: '赞了你的帖子', postPreview: '周末有没有打篮球的？组个局', time: '45分钟前', read: false },
    { id: 'n4', type: 'like', userId: 'u7', postId: 'p004', content: '赞了你的帖子', postPreview: '大活晚上有民乐演出', time: '3小时前', read: true },
    { id: 'n5', type: 'like', userId: 'u5', postId: 'p008', content: '赞了你的帖子', postPreview: '索尼 WH-1000XM5', time: '昨天 20:30', read: true },
    { id: 'n15', type: 'like', userId: 'u8', postId: 'p009', content: '赞了你的帖子', postPreview: '本周五校园音乐节节目单出炉！', time: '昨天 14:00', read: true }
  ],
  // 评论与@通知
  commentsAndAt: [
    { id: 'n6', type: 'comment', userId: 'u2', postId: 'p001', content: '评论了你的帖子', commentPreview: '好可爱！希望主人快点找到它~', time: '15分钟前', read: false },
    { id: 'n7', type: 'reply', userId: 'u4', postId: 'p002', commentId: 'c006', content: '回复了你的评论', commentPreview: '【Zotero 配置教程】1. 下载安装…', time: '40分钟前', read: false },
    { id: 'n8', type: 'comment', userId: 'u7', postId: 'p008', content: '评论了你的帖子', commentPreview: '200 出吗？就在隔壁宿舍', time: '昨天 20:30', read: true },
    { id: 'n9', type: 'mention', userId: 'u3', postId: 'p010', content: '@了你', commentPreview: '私你了！我一般早上8点到晚上10点', time: '昨天 00:30', read: true }
  ],
  // 新增粉丝通知
  newFollowers: [
    { id: 'n10', type: 'follow', userId: 'u6', content: '关注了你', time: '5分钟前', read: false },
    { id: 'n11', type: 'follow', userId: 'u4', content: '关注了你', time: '1小时前', read: false },
    { id: 'n12', type: 'follow', userId: 'u3', content: '关注了你', time: '昨天 22:00', read: true },
    { id: 'n13', type: 'follow', userId: 'u8', content: '关注了你', time: '昨天 15:00', read: true }
  ]
}

// ===== 普通聊天列表 =====
export const chatList = [
  {
    id: 'chat_1',
    userId: 'u2',
    lastMsg: '好的，明天中午食堂见！',
    lastTime: '21:32',
    unread: 3,
    isGroup: false
  },
  {
    id: 'chat_2',
    userId: 'u4',
    lastMsg: '那个 bug 我修好了，你拉一下最新代码',
    lastTime: '20:15',
    unread: 1,
    isGroup: false
  },
  {
    id: 'chat_3',
    name: '考研搭子群',
    avatar: '', avatarColor: '#e74c3c',
    lastMsg: '明天图书馆四楼老位置，7:30开门就占座',
    lastTime: '19:45',
    unread: 12,
    isGroup: true,
    memberCount: 8
  },
  {
    id: 'chat_4',
    name: '摄影爱好圈',
    avatar: '', avatarColor: '#3498db',
    lastMsg: '周末颐和园约拍，目前3个人了',
    lastTime: '18:20',
    unread: 0,
    isGroup: true,
    memberCount: 23
  },
  {
    id: 'chat_5',
    userId: 'u7',
    lastMsg: '明天还去打篮球吗？',
    lastTime: '17:50',
    unread: 0,
    isGroup: false
  },
  {
    id: 'chat_6',
    name: '中央民族大学二手交易圈',
    avatar: '', avatarColor: '#2ecc71',
    lastMsg: '有没有出考研英语资料的？',
    lastTime: '16:30',
    unread: 5,
    isGroup: true,
    memberCount: 156
  },
  {
    id: 'chat_7',
    userId: 'u5',
    lastMsg: '谢谢你的资料！很有用🙏',
    lastTime: '昨天 22:10',
    unread: 0,
    isGroup: false
  },
  {
    id: 'chat_8',
    userId: 'u3',
    lastMsg: '你的 Zotero 配置能再发一下吗？换了电脑找不到了',
    lastTime: '昨天 15:40',
    unread: 0,
    isGroup: false
  }
]

// ===== 匿名会话列表 =====
export const anonSessions = [
  {
    id: 'anon_1',
    sessionName: '匿名用户_A',
    lastMsg: '谢谢你愿意听我说话...',
    lastTime: '22:15',
    unread: 2,
    sourcePostId: 'p012',
    sourcePostPreview: '大一新生，离家三千公里，每天晚上都想哭...'
  },
  {
    id: 'anon_2',
    sessionName: '匿名用户_C',
    lastMsg: '其实我也觉得那门课的老师讲得不太好',
    lastTime: '昨天 23:40',
    unread: 1,
    sourcePostId: 'p013',
    sourcePostPreview: '吐槽一下某选修课老师...'
  },
  {
    id: 'anon_3',
    name: '匿名树洞圈',
    avatar: '', avatarColor: '#9b59b6',
    lastMsg: '有人匿名发了一条新动态',
    lastTime: '昨天 20:00',
    unread: 0,
    isAnonCircle: true,
    memberCount: 45
  },
  {
    id: 'anon_4',
    sessionName: '匿名用户_F',
    lastMsg: '你也是这个专业的吗？',
    lastTime: '3天前',
    unread: 0,
    sourcePostId: 'p014',
    sourcePostPreview: '匿名聊聊专业选择...'
  }
]

// ===== 系统通知 =====
export const systemNotices = [
  { id: 'sys_1', type: 'audit', content: '你的帖子"宿舍阳台的多肉又开了"已通过审核', time: '昨天 10:30' },
  { id: 'sys_3', type: 'security', content: '检测到新设备登录（北京 · 海淀），如非本人操作请修改密码', time: '5天前' }
]

// 获取未读匿名消息总数
export function getAnonUnreadCount() {
  return anonSessions.reduce((sum, s) => sum + s.unread, 0)
}
