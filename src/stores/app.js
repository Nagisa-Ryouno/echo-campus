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
  const users = ref([...mockUsers])

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
  const chatListData = ref([...chatList])
  const anonSessionData = ref([...anonSessions])
  const sysNotices = ref([...systemNotices])
  const plusMenuVisible = ref(false)

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
    profileActiveTab
  }
})
