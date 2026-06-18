// 评论 Mock 数据
export const mockComments = [
  // p001 的评论
  { id: 'c001', postId: 'p001', authorId: 'u1', content: '好可爱！希望主人快点找到它~', parentId: null, likeCount: 12, isAnon: false, createdAt: '2026-06-18 15:40' },
  { id: 'c002', postId: 'p001', authorId: 'u4', content: '这是学校常驻的橘猫，叫小橘，冬天经常在图书馆蹭暖气 😂', parentId: null, likeCount: 45, isAnon: false, createdAt: '2026-06-18 15:45' },
  { id: 'c003', postId: 'p001', authorId: 'u2', content: '原来是有名字的！那就放心了~', parentId: 'c002', likeCount: 8, isAnon: false, createdAt: '2026-06-18 15:50' },
  { id: 'c004', postId: 'p001', authorId: 'u5', content: '我昨天也看到它了，在文华楼门口晒太阳', parentId: null, likeCount: 15, isAnon: false, createdAt: '2026-06-18 16:00' },

  // p002 的评论
  { id: 'c005', postId: 'p002', authorId: 'u3', content: '教程呢教程呢？在线等！', parentId: null, likeCount: 67, isAnon: false, createdAt: '2026-06-17 21:30' },
  { id: 'c006', postId: 'p002', authorId: 'u4', content: '【Zotero 配置教程】1. 下载安装 Zotero + Zotero Connector 浏览器插件 2. 设置同步到 WebDAV 3. 安装 Better BibTeX 插件 4. 配置 Word/Latex 引用', parentId: 'c005', likeCount: 89, isAnon: false, createdAt: '2026-06-17 21:35' },
  { id: 'c007', postId: 'p002', authorId: 'u1', content: '收藏了！毕业论文救命稻草 🫡', parentId: null, likeCount: 23, isAnon: false, createdAt: '2026-06-17 22:00' },

  // p012 树洞评论（有匿名评论）
  { id: 'c008', postId: 'p012', authorId: 'u1', content: '我也是...每天晚上给家里打电话的时候就特别想哭 😢', parentId: null, likeCount: 234, isAnon: true, createdAt: '2026-06-18 02:00' },
  { id: 'c009', postId: 'p012', authorId: 'u3', content: '抱抱你。可以多参加社团活动，认识了新朋友会好很多', parentId: null, likeCount: 156, isAnon: false, createdAt: '2026-06-18 02:30' },
  { id: 'c010', postId: 'p012', authorId: 'u7', content: '大二就好了，大一确实比较容易想家。坚持住！', parentId: 'c008', likeCount: 89, isAnon: false, createdAt: '2026-06-18 03:00' },

  // p009 活动帖子评论
  { id: 'c011', postId: 'p009', authorId: 'u1', content: '已经和朋友约好了！超级期待 🎵', parentId: null, likeCount: 34, isAnon: false, createdAt: '2026-06-16 10:00' },
  { id: 'c012', postId: 'p009', authorId: 'u5', content: '可以拍照吗？想用相机记录一下', parentId: null, likeCount: 12, isAnon: false, createdAt: '2026-06-16 10:30' },

  // p010 考研搭子
  { id: 'c013', postId: 'p010', authorId: 'u5', content: '我也是考研党！每天在图书馆四楼，可以约！', parentId: null, likeCount: 45, isAnon: false, createdAt: '2026-06-16 00:00' },
  { id: 'c014', postId: 'p010', authorId: 'u3', content: '私你了！我一般早上 8 点到晚上 10 点', parentId: 'c013', likeCount: 12, isAnon: false, createdAt: '2026-06-16 00:30' },
  { id: 'c015', postId: 'p010', authorId: 'u1', content: '考研真的太卷了...大家加油 💪', parentId: null, likeCount: 78, isAnon: false, createdAt: '2026-06-16 08:00' },

  // p006 篮球约球
  { id: 'c016', postId: 'p006', authorId: 'u1', content: '我我我！算我一个！', parentId: null, likeCount: 8, isAnon: false, createdAt: '2026-06-18 15:00' },
  { id: 'c017', postId: 'p006', authorId: 'u4', content: '还缺人吗？好久没打球了', parentId: null, likeCount: 5, isAnon: false, createdAt: '2026-06-18 15:10' },

  // p008 二手闲置
  { id: 'c018', postId: 'p008', authorId: 'u7', content: '200 出吗？就在隔壁宿舍', parentId: null, likeCount: 0, isAnon: false, createdAt: '2026-06-17 20:30' },
  { id: 'c019', postId: 'p008', authorId: 'u1', content: '不好意思已经出了哈', parentId: 'c018', likeCount: 2, isAnon: false, createdAt: '2026-06-17 21:00' }
]

// 辅助函数
export function getCommentsByPostId(postId) {
  return mockComments.filter(c => c.postId === postId)
}

export function getRepliesByCommentId(postId, commentId) {
  return mockComments.filter(c => c.postId === postId && c.parentId === commentId)
}

export function getTopLevelComments(postId) {
  return mockComments.filter(c => c.postId === postId && c.parentId === null)
}
