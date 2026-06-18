import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockPosts, channels, channelTagMap, allCategoryTags, getPostsByChannel, getPostsByCategoryTag, getPostById } from '@/mock/posts.js'
import { mockUsers, currentUser as defaultUser } from '@/mock/users.js'
import { mockComments, getCommentsByPostId, getRepliesByCommentId, getTopLevelComments } from '@/mock/comments.js'

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

  // ===== 喜欢 / 收藏状态（本地点赞数） =====
  const likedPosts = ref(new Set())
  const collectedPosts = ref(new Set())
  const likedComments = ref(new Set())

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
  function isCommentLiked(commentId) { return likedComments.value.has(commentId) }

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
    likedPosts, collectedPosts, likedComments,
    toggleLike, toggleCollect, toggleCommentLike,
    isPostLiked, isPostCollected, isCommentLiked,

    // 评论
    allComments, getPostComments, getCommentReplies, addComment,

    // 草稿 & 发帖
    drafts, saveDraft, removeDraft, createPost,

    // 滚动锁
    lockPhoneScroll, unlockPhoneScroll
  }
})
