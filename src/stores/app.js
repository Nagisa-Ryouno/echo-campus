import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockPosts, channels, channelTagMap, allCategoryTags, getPostsByChannel, getPostsByCategoryTag, getPostById } from '@/mock/posts.js'
import { mockUsers, currentUser as defaultUser } from '@/mock/users.js'
import { mockComments, getCommentsByPostId, getRepliesByCommentId, getTopLevelComments } from '@/mock/comments.js'
import { notifications, chatList, anonSessions, systemNotices, getAnonUnreadCount } from '@/mock/messages.js'

export const useAppStore = defineStore('app', () => {
  // ===== 用户状态 =====
  const isLoggedIn = ref(false)
  const currentUser = ref(null)
  const users = ref([
    ...mockUsers,
    {
      id: 'u9',
      nickname: '深蓝小哥',
      echoId: 'echo_20240009',
      avatar: '',
      avatarColor: '#d35400',
      school: '中央民族大学',
      bio: '极简主义者 | 喜欢静静看书',
      gender: 'male',
      age: 21,
      tags: ['阅读', '静心'],
      followCount: 50,
      fanCount: 80,
      postCount: 10,
      showSchool: 'public',
      postVisibility: 'everyone',
      commentVisibility: 'everyone',
      collectionVisibility: 'private'
    }
  ])

  function getUserById(uid) {
    return users.value.find(u => u.id === uid) || null
  }

  function login(uid) {
    const user = getUserById(uid)
    if (user) {
      currentUser.value = user
      isLoggedIn.value = true
    }
  }

  function logout() {
    currentUser.value = null
    isLoggedIn.value = false
  }

  // ===== 已关注用户列表（Mock）=====
  const followedUserIds = ref(['u2', 'u3', 'u4', 'u5', 'u7'])
  const followedUsers = computed(() =>
    followedUserIds.value.map(id => getUserById(id)).filter(Boolean)
  )

  function isFollowing(uid) {
    return followedUserIds.value.includes(uid)
  }

  function toggleFollow(uid) {
    if (followedUserIds.value.includes(uid)) {
      followedUserIds.value = followedUserIds.value.filter(id => id !== uid)
    } else {
      followedUserIds.value = [...followedUserIds.value, uid]
    }
  }

  // ===== 帖子状态 =====
  const posts = ref([...mockPosts])
  const activeChannel = ref('recommend')
  const activeCategoryTag = ref('')

  const channelLabels = ref([...channels])

  // 当前频道下的帖子列表
  const filteredPosts = computed(() => {
    let list = getPostsByChannel(activeChannel.value)
    if (activeCategoryTag.value) {
      list = list.filter(p => p.categoryTag === activeCategoryTag.value)
    }
    return list
  })

  function setChannel(channelKey) {
    activeChannel.value = channelKey
    activeCategoryTag.value = ''
  }

  function setCategoryTag(tag) {
    if (activeCategoryTag.value === tag) {
      activeCategoryTag.value = ''
    } else {
      activeCategoryTag.value = tag
    }
  }

  // ===== 各频道标签 =====
  // 当前频道对应的标签池
  const currentChannelTags = computed(() => {
    return channelTagMap[activeChannel.value] || []
  })

  // 用户自定义标签（按频道的可见标签列表）
  const userTags = ref([...channelTagMap.recommend])
  const hiddenTags = ref([])

  // 当前频道可见标签
  const visibleTags = computed(() => {
    const tags = userTags.value.filter(t => !hiddenTags.value.includes(t))
    return tags
  })

  // 切换频道时自动更新标签池
  function syncTagsToChannel(channelKey) {
    const tags = channelTagMap[channelKey] || []
    userTags.value = [...tags]
    hiddenTags.value = []
  }

  function toggleTagVisibility(tag) {
    if (hiddenTags.value.includes(tag)) {
      hiddenTags.value = hiddenTags.value.filter(t => t !== tag)
    } else {
      hiddenTags.value = [...hiddenTags.value, tag]
    }
  }

  // ===== 所有分类标签（去重）=====
  const allPostTags = computed(() => [...new Set(posts.value.map(p => p.categoryTag))])

  // ===== 帖子搜索 =====
  function searchPosts(keyword) {
    const kw = keyword.toLowerCase()
    return posts.value.filter(p =>
      p.content.toLowerCase().includes(kw) ||
      p.categoryTag.includes(kw) ||
      p.topicTags.some(t => t.toLowerCase().includes(kw))
    )
  }

  // ===== 获取帖子（含作者信息）=====
  function getPostWithAuthor(postId) {
    const post = getPostById(postId)
    if (!post) return null
    const author = getUserById(post.authorId)
    return { ...post, author: author || null }
  }

  // ===== 喜欢 / 收藏 / 转发状态 =====
  const likedPosts = ref(new Set())
  const collectedPosts = ref(new Set())
  const forwardedPosts = ref(new Set())
  const likedComments = ref(new Set())
  const blockedUsers = ref(new Set())

  function toggleLike(postId) {
    const post = posts.value.find(p => p.id === postId)
    if (!post) return
    if (likedPosts.value.has(postId)) {
      likedPosts.value.delete(postId)
      post.likeCount = Math.max(0, post.likeCount - 1)
    } else {
      likedPosts.value.add(postId)
      post.likeCount++
    }
  }

  function toggleCollect(postId) {
    const post = posts.value.find(p => p.id === postId)
    if (!post) return
    if (collectedPosts.value.has(postId)) {
      collectedPosts.value.delete(postId)
      post.collectCount = Math.max(0, post.collectCount - 1)
    } else {
      collectedPosts.value.add(postId)
      post.collectCount++
    }
  }

  function toggleCommentLike(commentId) {
    const comment = mockComments.find(c => c.id === commentId)
    if (!comment) return
    if (likedComments.value.has(commentId)) {
      likedComments.value.delete(commentId)
      comment.likeCount = Math.max(0, comment.likeCount - 1)
    } else {
      likedComments.value.add(commentId)
      comment.likeCount++
    }
  }

  function isPostLiked(postId) { return likedPosts.value.has(postId) }
  function isPostCollected(postId) { return collectedPosts.value.has(postId) }
  function isPostForwarded(postId) { return forwardedPosts.value.has(postId) }
  function isCommentLiked(commentId) { return likedComments.value.has(commentId) }

  function blockUser(userId) {
    blockedUsers.value.add(userId)
    // 同时取消关注
    if (followedUserIds.value.has(userId)) {
      followedUserIds.value.delete(userId)
    }
  }
  function isUserBlocked(userId) { return blockedUsers.value.has(userId) }

  function toggleForward(postId) {
    const post = posts.value.find(p => p.id === postId)
    if (!post) return
    if (forwardedPosts.value.has(postId)) {
      forwardedPosts.value.delete(postId)
      post.forwardCount = Math.max(0, post.forwardCount - 1)
    } else {
      forwardedPosts.value.add(postId)
      post.forwardCount = (post.forwardCount || 0) + 1
    }
  }

  // ===== 评论 =====
  const allComments = ref([...mockComments])

  function getPostComments(postId) {
    return getTopLevelComments(postId)
  }

  function getCommentReplies(postId, commentId) {
    return getRepliesByCommentId(postId, commentId)
  }

  function addComment(postId, content, parentId = null, isAnon = false) {
    const newComment = {
      id: `c_${Date.now()}`,
      postId,
      authorId: currentUser.value?.id || 'u1',
      content,
      parentId,
      likeCount: 0,
      isAnon,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false })
    }
    allComments.value.push(newComment)
    const post = posts.value.find(p => p.id === postId)
    if (post) post.commentCount++
    return newComment
  }

  // ===== 草稿 =====
  const drafts = ref([])

  function saveDraft(draft) {
    const index = drafts.value.findIndex(d => d.id === draft.id)
    if (index >= 0) {
      drafts.value[index] = { ...draft, updatedAt: Date.now() }
    } else {
      drafts.value.unshift({ ...draft, id: `draft_${Date.now()}`, createdAt: Date.now() })
    }
  }

  function removeDraft(draftId) {
    drafts.value = drafts.value.filter(d => d.id !== draftId)
  }

  // ===== 发帖 =====
  function createPost(postData) {
    const newPost = {
      id: `p_${Date.now()}`,
      authorId: postData.isAnon ? 'u1' : (currentUser.value?.id || 'u1'),
      content: postData.content,
      images: postData.images || [],
      categoryTag: postData.categoryTag || '校园树洞',
      topicTags: postData.topicTags || [],
      visibility: postData.visibility || 'public',
      schoolOnly: postData.schoolOnly || false,
      isAnon: postData.isAnon || false,
      likeCount: 0,
      commentCount: 0,
      collectCount: 0,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
      channel: 'school'
    }
    posts.value.unshift(newPost)
    return newPost
  }

  // ===== 滚动锁定 =====
  function lockPhoneScroll() {
    const screen = document.getElementById('phone-screen')
    if (screen) screen.style.overflow = 'hidden'
  }

  function unlockPhoneScroll() {
    const screen = document.getElementById('phone-screen')
    if (screen) screen.style.removeProperty('overflow')
  }

  // ===== 消息 & 通知 =====
  const likedNotifs = ref([...notifications.receivedLikes])
  const commentAtNotifs = ref([...notifications.commentsAndAt])
  const followerNotifs = ref([...notifications.newFollowers])
  const chatListData = ref([
    ...chatList.map(c => {
      if (c.isGroup) return c
      return {
        ...c,
        sentByMeCount: 5,
        sentByThemCount: 5
      }
    }),
    {
      id: 'chat_stranger_1',
      userId: 'u6', // 阿白不白
      lastMsg: '你好，请问你是英语专业的吗？想向你请教一下六级备考。',
      lastTime: '昨天 10:00',
      unread: 1,
      isGroup: false,
      sentByMeCount: 0,
      sentByThemCount: 1
    },
    {
      id: 'chat_stranger_2',
      userId: 'u8', // 管理员小助手
      lastMsg: '欢迎使用校声！如果有任何问题，可以随时联系我哦。',
      lastTime: '3天前',
      unread: 0,
      isGroup: false,
      sentByMeCount: 0,
      sentByThemCount: 1
    },
    {
      id: 'chat_stranger_3',
      userId: 'u9', // 深蓝小哥
      lastMsg: '你好，请问这周末操场有活动吗？',
      lastTime: '4天前',
      unread: 0,
      isGroup: false,
      sentByMeCount: 1,
      sentByThemCount: 0
    }
  ])

  const anonSessionData = ref([...anonSessions])
  const sysNotices = ref([...systemNotices])
  const plusMenuVisible = ref(false)

  // 聊天详情相关状态
  const activeChatId = ref(null)
  const isChatOpen = ref(false)

  // 消息历史记录
  const messagesMap = ref({
    'chat_1': [
      { sender: 'them', text: '这周末学校有摄影讲座，你去吗？', time: '18:00' },
      { sender: 'me', text: '想去啊，在哪个报告厅？', time: '18:02' },
      { sender: 'them', text: '好的，明天中午食堂见！', time: '21:32' }
    ],
    'chat_2': [
      { sender: 'me', text: '学长，那个报错怎么解决？', time: '19:00' },
      { sender: 'them', text: '把 node_modules 删了重新 install 试试。', time: '19:10' },
      { sender: 'them', text: '那个 bug 我修好了，你拉一下最新代码', time: '20:15' }
    ],
    'chat_5': [
      { sender: 'them', text: '明天还去打篮球吗？', time: '17:50' }
    ],
    'chat_7': [
      { sender: 'them', text: '谢谢你的资料！很有用🙏', time: '昨天 22:10' }
    ],
    'chat_8': [
      { sender: 'them', text: '你的 Zotero 配置能再发一下吗？换了电脑找不到了', time: '昨天 15:40' }
    ],
    'chat_stranger_1': [
      { sender: 'them', text: '你好，请问你是英语专业的吗？想向你请教一下六级备考。', time: '昨天 10:00' }
    ],
    'chat_stranger_2': [
      { sender: 'them', text: '欢迎使用校声！如果有任何问题，可以随时联系我哦。', time: '3天前' }
    ],
    'chat_stranger_3': [
      { sender: 'me', text: '你好，请问这周末操场有活动吗？', time: '4天前' }
    ]
  })

  // 计算时间排序权重
  function getTimeWeight(timeStr) {
    if (!timeStr) return 0
    if (timeStr.includes(':') && !timeStr.includes('昨天')) {
      const [h, m] = timeStr.split(':').map(Number)
      return 1000000 + h * 60 + m
    }
    if (timeStr.startsWith('昨天')) {
      const timePart = timeStr.replace('昨天', '').trim()
      const [h, m] = timePart.split(':').map(Number)
      return 500000 + h * 60 + m
    }
    const match = timeStr.match(/(\d+)天前/)
    if (match) {
      const days = parseInt(match[1])
      return 100000 - days * 1440
    }
    return 10000
  }

  // 正常聊天列表（群聊，或者互相发送过消息的私聊）
  const normalChats = computed(() => {
    return chatListData.value.filter(c => c.isGroup || (c.sentByMeCount > 0 && c.sentByThemCount > 0))
  })

  // 陌生人聊天列表（未互发消息的私聊）
  const strangerChats = computed(() => {
    return chatListData.value.filter(c => !c.isGroup && (c.sentByMeCount === 0 || c.sentByThemCount === 0))
  })

  // 获取最新的陌生人消息
  const latestStrangerChat = computed(() => {
    if (strangerChats.value.length === 0) return null
    const sorted = [...strangerChats.value].sort((a, b) => getTimeWeight(b.lastTime) - getTimeWeight(a.lastTime))
    return sorted[0]
  })

  // 陌生人消息文件夹卡片
  const strangersFolderItem = computed(() => {
    const latest = latestStrangerChat.value
    if (!latest) return null
    const totalUnread = strangerChats.value.reduce((sum, c) => sum + c.unread, 0)
    return {
      id: 'strangers_folder',
      isStrangersFolder: true,
      name: '陌生人消息',
      lastMsg: latest.lastMsg,
      lastTime: latest.lastTime,
      unread: totalUnread
    }
  })

  // 消息页面可见的聊天列表
  const visibleChatList = computed(() => {
    const list = [...normalChats.value]
    if (strangersFolderItem.value) {
      list.push(strangersFolderItem.value)
    }
    return list.sort((a, b) => getTimeWeight(b.lastTime) - getTimeWeight(a.lastTime))
  })

  function openChat(chatId) {
    activeChatId.value = chatId
    isChatOpen.value = true
    const chat = chatListData.value.find(c => c.id === chatId)
    if (chat) chat.unread = 0
  }

  function closeChat() {
    isChatOpen.value = false
    activeChatId.value = null
  }

  function sendChatMessage(chatId, text) {
    const chat = chatListData.value.find(c => c.id === chatId)
    if (!chat) return
    if (!messagesMap.value[chatId]) {
      messagesMap.value[chatId] = []
    }
    const now = new Date()
    const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    messagesMap.value[chatId].push({
      sender: 'me',
      text,
      time: timeStr
    })
    chat.lastMsg = text
    chat.lastTime = timeStr

    if (!chat.isGroup) {
      chat.sentByMeCount = (chat.sentByMeCount || 0) + 1
      // 如果对方发过消息，且我刚发了第一条消息（达成双方互发）
      if (chat.sentByMeCount === 1 && chat.sentByThemCount > 0) {
        showToast(`双方已互发消息，${getUserById(chat.userId)?.nickname} 已移至普通聊天列表！`)
      }
      // 如果是我发起的第一条消息，对方还没有回过
      else if (chat.sentByMeCount === 1 && chat.sentByThemCount === 0) {
        // 1.2秒后模拟对方回复，以达成“互相发送消息”
        setTimeout(() => {
          const replyText = `（模拟自动回复）你好呀，我收到了你的消息！这周末操场没有大型活动，不过有小型的路演演出，可以来看看。`
          const replyTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
          messagesMap.value[chatId].push({
            sender: 'them',
            text: replyText,
            time: replyTime
          })
          chat.lastMsg = replyText
          chat.lastTime = replyTime
          chat.sentByThemCount = 1
          showToast(`双方已互发消息，${getUserById(chat.userId)?.nickname} 已移至普通聊天列表！`)
        }, 1200)
      }
    }
  }

  // 未读计数
  const unreadLikeCount = computed(() =>
    likedNotifs.value.filter(n => !n.read).length
  )
  const unreadCommentAtCount = computed(() =>
    commentAtNotifs.value.filter(n => !n.read).length
  )
  const unreadFollowerCount = computed(() =>
    followerNotifs.value.filter(n => !n.read).length
  )
  const unreadAnonCount = computed(() => getAnonUnreadCount())
  const unreadChatCount = computed(() =>
    chatListData.value.reduce((sum, c) => sum + c.unread, 0)
  )

  // 分类通知一键已读（在各独立子页面调用）
  function markAllLikesRead() {
    likedNotifs.value.forEach(n => { n.read = true })
  }
  function markAllCommentsRead() {
    commentAtNotifs.value.forEach(n => { n.read = true })
  }
  function markAllFansRead() {
    followerNotifs.value.forEach(n => { n.read = true })
  }

  // 全局一键已读：清除消息页全部未读标记
  function markAllMessagesRead() {
    // 三大通知入口全部已读
    likedNotifs.value.forEach(n => { n.read = true })
    commentAtNotifs.value.forEach(n => { n.read = true })
    followerNotifs.value.forEach(n => { n.read = true })
    // 所有聊天会话未读清零
    chatListData.value.forEach(c => { c.unread = 0 })
    // 所有匿名会话未读清零
    anonSessionData.value.forEach(s => { s.unread = 0 })
  }

  // 标记某个聊天已读
  function markChatRead(chatId) {
    const chat = chatListData.value.find(c => c.id === chatId)
    if (chat) chat.unread = 0
  }

  // 获取用户发的帖子
  function getUserPosts(uid) {
    return posts.value.filter(p => p.authorId === uid && p.visibility !== 'private')
  }

  // 获取用户评论过的帖子
  function getUserCommentedPosts(uid) {
    const userCommentPostIds = [...new Set(
      allComments.value.filter(c => c.authorId === uid && !c.isAnon).map(c => c.postId)
    )]
    return posts.value.filter(p => userCommentPostIds.includes(p.id) && p.visibility !== 'private')
  }

  // 获取用户收藏的帖子
  function getUserCollectedPosts() {
    return posts.value.filter(p => collectedPosts.value.has(p.id))
  }

  // 获取用户赞过的帖子
  function getUserLikedPosts() {
    return posts.value.filter(p => likedPosts.value.has(p.id))
  }

  // 浏览记录（自己可见）
  const browseHistory = ref([
    { postId: 'p002', title: 'Zotero 文献管理全攻略，让论文写作不再痛苦', time: '1小时前' },
    { postId: 'p012', title: '大一新生，离家三千公里…', time: '3小时前' },
    { postId: 'p006', title: '周末有没有打篮球的？组个局', time: '昨天 18:30' },
    { postId: 'p009', title: '本周五校园音乐节节目单出炉！', time: '昨天 15:00' }
  ])

  // 主页内容 Tab
  const profileActiveTab = ref('posts')

  // ===== 隐私设置 =====
  const schoolVisibility = ref('public')
  const searchByName = ref(true)
  const searchByEchoId = ref(true)
  const searchScope = ref('everyone')
  const allowRecommend = ref(true)
  const messagePermission = ref('everyone')
  const followPermission = ref('everyone')
  const defaultVisibility = ref('everyone')     // 默认可见范围（发帖偏好）
  const schoolOnlyContent = ref(false)
  const allowAnonPost = ref(true)
  const allowAnonComment = ref(true)
  const allowAnonMessage = ref(true)

  // ===== 默认发帖偏好（补充）=====
  const defaultAnonPost = ref(false)           // 默认匿名发布
  const defaultSchoolOnly = ref(false)          // 默认仅本校可见

  const defaultVisibilityLabels = { private: '完全私密', followers: '仅关注者可见', mutual: '仅互关者可见', everyone: '所有人可见' }

  // 内容级可见性（帖子/评论/收藏各独立控制）
  const postVisibility = ref('everyone')
  const commentVisibility = ref('everyone')
  const collectionVisibility = ref('everyone')

  // 隐私标签映射
  const visibilityLabels = { public: '所有人可见', school_only: '仅本校可见', hidden: '完全隐藏' }
  const scopeLabels = { everyone: '所有人可搜索', school_only: '仅本校可搜索', nobody: '不允许被搜索' }
  const messageLabels = { everyone: '所有人可私信', followers: '仅关注者可私信', mutual: '仅互关者可私信', nobody: '不接受私信' }
  const followLabels = { everyone: '所有人可关注', require_approval: '关注需验证', nobody: '不允许陌生人关注' }
  const contentVisibilityLabels = { everyone: '所有人可见', followers: '仅关注者可见', mutual: '仅互关者可见', private: '仅自己可见' }

  // ===== 圈子（Circles）状态与操作 =====
  const circles = ref([
    {
      id: 'c1',
      name: '摄影爱好者协会',
      number: '112893049',
      icon: '📷',
      color: 'linear-gradient(135deg, #667eea, #764ba2)',
      backgroundImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60',
      description: '用镜头记录校园生活的美好瞬间，欢迎分享你的摄影作品与心得。',
      memberCount: 1286,
      maxMemberCount: 2000,
      postCount: 3456,
      unread: 3,
      official: true,
      isAnon: false,
      latestPost: '本周六组织校园外拍活动，有意向的同学请接龙~',
      category: '推荐',
      city: '北京',
      school: '中央民族大学',
      createdAt: '2023/10/12',
      joined: true,
      memberStats: {
        femalePercent: 48,
        femaleCount: 617,
        cityCount: 512,
        post00sCount: 980,
        recentActiveText: '最近有230人发言'
      }
    },
    {
      id: 'c2',
      name: '考研交流群',
      number: '552910394',
      icon: '📖',
      color: 'linear-gradient(135deg, #f093fb, #f5576c)',
      backgroundImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
      description: '考研资料分享、每日打卡、互相鼓励监督的学习社区。',
      memberCount: 2340,
      maxMemberCount: 3000,
      postCount: 8900,
      unread: 12,
      official: false,
      isAnon: false,
      latestPost: '分享一套肖秀荣政治冲刺笔记，有需要的自取。',
      category: '学习',
      city: '北京',
      school: '中央民族大学',
      createdAt: '2024/09/01',
      joined: true,
      memberStats: {
        femalePercent: 55,
        femaleCount: 1287,
        cityCount: 450,
        post00sCount: 1980,
        recentActiveText: '最近有890人发言'
      }
    },
    {
      id: 'c3',
      name: '校园匿名树洞',
      number: '990384102',
      icon: '🌳',
      color: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      backgroundImage: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=60',
      description: '说出你不敢说的话，匿名吐槽、倾诉、分享心事。',
      memberCount: 5600,
      maxMemberCount: 10000,
      postCount: 23400,
      unread: 0,
      official: false,
      isAnon: true,
      latestPost: '有时候真的很羡慕那些勇敢表达自己的人...',
      category: '推荐',
      city: '北京',
      school: '北京大学',
      createdAt: '2022/05/18',
      joined: true,
      memberStats: {
        femalePercent: 50,
        femaleCount: 2800,
        cityCount: 1200,
        post00sCount: 4800,
        recentActiveText: '最近有1205人发言'
      }
    },
    {
      id: 'c4',
      name: '日系摇滚同好会',
      number: '448209384',
      icon: '🎸',
      color: 'linear-gradient(135deg, #fa709a, #fee140)',
      backgroundImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=60',
      description: 'ONE OK ROCK、RADWIMPS、凛として時雨... 日系摇滚爱好者聚集地。',
      memberCount: 456,
      maxMemberCount: 500,
      postCount: 1230,
      unread: 0,
      official: false,
      isAnon: false,
      latestPost: '有人去看下个月的RADWIMPS演唱会吗？组队！',
      category: '音乐',
      city: '北京',
      school: '清华大学',
      createdAt: '2023/12/01',
      joined: true,
      memberStats: {
        femalePercent: 35,
        femaleCount: 160,
        cityCount: 88,
        post00sCount: 390,
        recentActiveText: '最近有48人发言'
      }
    },
    {
      id: 'c5',
      name: '渴望遗忘却总是苏醒的三角初华',
      number: '975336438',
      icon: '🎭',
      color: 'linear-gradient(135deg, #30cfd0, #330867)',
      backgroundImage: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=800&auto=format&fit=crop&q=60',
      description: '专注于讨论初华的群聊，希望能让你更懂她一点。欢迎加入！',
      memberCount: 205,
      maxMemberCount: 500,
      postCount: 847,
      unread: 0,
      official: false,
      isAnon: false,
      latestPost: '三角初华本月新单曲太强了！大家觉得呢？',
      category: '动漫',
      city: '北京',
      school: '中央民族大学',
      createdAt: '2025/11/11',
      joined: false,
      memberStats: {
        femalePercent: 28,
        femaleCount: 57,
        cityCount: 8,
        post00sCount: 81,
        recentActiveText: '最近有77人发言'
      }
    },
    {
      id: 'c6',
      name: '未定乐队今天练琴了吗？',
      number: '102934849',
      icon: '🎸',
      color: 'linear-gradient(135deg, #1e3c72, #2a5298)',
      backgroundImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=60',
      description: '这里是未定乐队（MyGO!!!!!/Ave Mujica）同好交流圈，每天打卡练琴！',
      memberCount: 1003,
      maxMemberCount: 2000,
      postCount: 3429,
      unread: 0,
      official: false,
      isAnon: false,
      latestPost: '今天练习了春日影，有人来合一下吗？',
      category: '动漫',
      city: '上海',
      school: '复旦大学',
      createdAt: '2025/06/15',
      joined: false,
      memberStats: {
        femalePercent: 42,
        femaleCount: 421,
        cityCount: 15,
        post00sCount: 650,
        recentActiveText: '最近有342人发言'
      }
    },
    {
      id: 'c7',
      name: 'bakaの咖啡厅（避风港）',
      number: '884729104',
      icon: '☕',
      color: 'linear-gradient(135deg, #a8ff78, #78ffd6)',
      backgroundImage: 'https://images.unsplash.com/photo-1447078806655-40579c2520d6?w=800&auto=format&fit=crop&q=60',
      description: '一个位于朱拉大森林的城镇中的咖啡厅，欢迎各位baka和冒险者来闲聊歇脚。',
      memberCount: 131,
      maxMemberCount: 500,
      postCount: 582,
      unread: 0,
      official: false,
      isAnon: true,
      latestPost: '今天老板不在，咖啡免费喝了啊',
      category: '游戏',
      city: '广州',
      school: '北京大学',
      createdAt: '2024/02/10',
      joined: false,
      memberStats: {
        femalePercent: 15,
        femaleCount: 20,
        cityCount: 3,
        post00sCount: 95,
        recentActiveText: '最近有14人发言'
      }
    },
    {
      id: 'c8',
      name: 'galgame大剧院',
      number: '662810398',
      icon: '🎮',
      color: 'linear-gradient(135deg, #f857a6, #ff5858)',
      backgroundImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60',
      description: '一切都是命运石之门的选择，galgame、视觉小说同好聚集地。',
      memberCount: 196,
      maxMemberCount: 200,
      postCount: 421,
      unread: 0,
      official: false,
      isAnon: false,
      latestPost: '《白色相簿2》冬马线通关，胃疼中...',
      category: '游戏',
      city: '深圳',
      school: '清华大学',
      createdAt: '2026/02/20',
      joined: false,
      memberStats: {
        femalePercent: 8,
        femaleCount: 15,
        cityCount: 5,
        post00sCount: 180,
        recentActiveText: '最近有7人发言'
      }
    },
    {
      id: 'c9',
      name: '校园音乐节组委会',
      number: '220394859',
      icon: '🎵',
      color: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
      backgroundImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60',
      description: '一年一度校园音乐节的策划、组织、演出安排。',
      memberCount: 320,
      maxMemberCount: 500,
      postCount: 567,
      unread: 0,
      official: true,
      isAnon: false,
      latestPost: '本届校园十佳歌手复赛名单已公示，大家快来围观！',
      category: '音乐',
      city: '北京',
      school: '中央民族大学',
      createdAt: '2025/08/10',
      joined: false,
      memberStats: {
        femalePercent: 50,
        femaleCount: 160,
        cityCount: 120,
        post00sCount: 280,
        recentActiveText: '最近有45人发言'
      }
    },
    {
      id: 'c10',
      name: '美剧英剧交流圈',
      number: '772910394',
      icon: '🎬',
      color: 'linear-gradient(135deg, #13547a, #80d0c7)',
      backgroundImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=60',
      description: '追剧不迷路！最新英剧美剧资源讨论、影评交流、无剧透推荐。',
      memberCount: 85,
      maxMemberCount: 200,
      postCount: 188,
      unread: 0,
      official: false,
      isAnon: false,
      latestPost: '《权力的游戏》最终季到底算不算烂尾？大家聊聊',
      category: '影视',
      city: '深圳',
      school: '清华大学',
      createdAt: '2026/01/05',
      joined: false,
      memberStats: {
        femalePercent: 45,
        femaleCount: 38,
        cityCount: 12,
        post00sCount: 68,
        recentActiveText: '最近有12人发言'
      }
    },
    {
      id: 'c11',
      name: '夜跑打卡协会',
      number: '334810293',
      icon: '🏃',
      color: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
      backgroundImage: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=60',
      description: '每天夜跑，强身健体！欢迎大家在这里打卡跑步路线和数据，组队跑！',
      memberCount: 95,
      maxMemberCount: 500,
      postCount: 219,
      unread: 0,
      official: false,
      isAnon: false,
      latestPost: '今晚8点操场见，打算跑5公里，有一起的吗？',
      category: '运动',
      city: '上海',
      school: '复旦大学',
      createdAt: '2025/09/20',
      joined: false,
      memberStats: {
        femalePercent: 35,
        femaleCount: 33,
        cityCount: 18,
        post00sCount: 78,
        recentActiveText: '最近有15人发言'
      }
    }
  ])

  // 加入圈子
  function joinCircle(circleId) {
    const circle = circles.value.find(c => c.id === circleId)
    if (circle && !circle.joined) {
      circle.joined = true
      circle.memberCount++
      if (circle.memberStats) {
        circle.memberStats.femaleCount = Math.round(circle.memberCount * (circle.memberStats.femalePercent / 100))
        circle.memberStats.post00sCount++
        circle.memberStats.cityCount++
      }
      return true
    }
    return false
  }

  // 退出圈子
  function leaveCircle(circleId) {
    const circle = circles.value.find(c => c.id === circleId)
    if (circle && circle.joined) {
      circle.joined = false
      circle.memberCount = Math.max(0, circle.memberCount - 1)
      if (circle.memberStats) {
        circle.memberStats.femaleCount = Math.round(circle.memberCount * (circle.memberStats.femalePercent / 100))
        circle.memberStats.post00sCount = Math.max(0, circle.memberStats.post00sCount - 1)
        circle.memberStats.cityCount = Math.max(0, circle.memberStats.cityCount - 1)
      }
      return true
    }
    return false
  }

  return {
    // 用户
    isLoggedIn, currentUser, users,
    getUserById, login, logout,

    // 关注用户
    followedUserIds, followedUsers,
    isFollowing, toggleFollow,

    // 频道 & 帖子
    posts, activeChannel, activeCategoryTag, channelLabels,
    filteredPosts, allPostTags,
    setChannel, setCategoryTag, searchPosts,
    getPostWithAuthor,

    // 频道标签
    currentChannelTags, userTags, hiddenTags, visibleTags,
    syncTagsToChannel, toggleTagVisibility,

    // 互动
    likedPosts, collectedPosts, forwardedPosts, likedComments,
    toggleLike, toggleCollect, toggleForward, toggleCommentLike,
    isPostLiked, isPostCollected, isPostForwarded, isCommentLiked,
    blockUser, isUserBlocked,

    // 评论
    allComments, getPostComments, getCommentReplies, addComment,

    // 草稿 & 发帖
    drafts, saveDraft, removeDraft, createPost,

    // 滚动锁
    lockPhoneScroll, unlockPhoneScroll,

    // 消息 & 通知
    likedNotifs, commentAtNotifs, followerNotifs,
    chatListData, anonSessionData, sysNotices,
    plusMenuVisible,
    unreadLikeCount, unreadCommentAtCount, unreadFollowerCount,
    unreadAnonCount, unreadChatCount,
    markAllLikesRead, markAllCommentsRead, markAllFansRead, markChatRead,
    markAllMessagesRead,
    activeChatId, isChatOpen, messagesMap, normalChats, strangerChats,
    latestStrangerChat, strangersFolderItem, visibleChatList, openChat, closeChat,
    sendChatMessage,

    // 用户内容
    getUserPosts, getUserCommentedPosts, getUserCollectedPosts, getUserLikedPosts,
    browseHistory,

    // 隐私设置
    schoolVisibility, searchByName, searchByEchoId,
    searchScope, allowRecommend,
    commentPermission: () => 'everyone', // 评论默认公开，不可关闭（固定值）
    messagePermission, followPermission,
    defaultVisibility, schoolOnlyContent,
    allowAnonPost, allowAnonComment, allowAnonMessage,
    // 默认发帖偏好
    defaultAnonPost, defaultSchoolOnly,
    defaultVisibilityLabels,
    postVisibility, commentVisibility, collectionVisibility,
    visibilityLabels, scopeLabels,
    messageLabels, followLabels, contentVisibilityLabels,

    // 个人设置
    profileActiveTab,

    // 圈子模块
    circles, joinCircle, leaveCircle
  }
})
