import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Splash',
    component: () => import('@/views/splash/SplashPage.vue'),
    meta: { title: '校声', tabBar: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginPage.vue'),
    meta: { title: '登录', tabBar: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterMethodPage.vue'),
    meta: { title: '注册', tabBar: false }
  },
  {
    path: '/register/email',
    name: 'EmailRegister',
    component: () => import('@/views/auth/EmailRegisterPage.vue'),
    meta: { title: '邮箱注册', tabBar: false }
  },
  {
    path: '/register/student-id',
    name: 'StudentIdVerify',
    component: () => import('@/views/auth/StudentIdVerifyPage.vue'),
    meta: { title: '学生证审核', tabBar: false }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/HomePage.vue'),
    meta: { title: '首页', tabBar: true }
  },
  {
    path: '/discover',
    name: 'Discover',
    component: () => import('@/views/discover/DiscoverPage.vue'),
    meta: { title: '发现', tabBar: true }
  },
  {
    path: '/post/create',
    name: 'PostCreate',
    component: () => import('@/views/post/PostCreate.vue'),
    meta: { title: '发布', tabBar: false }
  },
  {
    path: '/tag-select',
    name: 'TagSelect',
    component: () => import('@/views/post/TagSelect.vue'),
    meta: { title: '选择标签', tabBar: false }
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: () => import('@/views/post/PostDetail.vue'),
    meta: { title: '帖子详情', tabBar: false }
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('@/views/message/MessagePage.vue'),
    meta: { title: '消息', tabBar: true }
  },
  {
    path: '/message/anon',
    name: 'AnonMessage',
    component: () => import('@/views/message/AnonMessage.vue'),
    meta: { title: '匿名消息', tabBar: false }
  },
  {
    path: '/message/strangers',
    name: 'StrangersMessage',
    component: () => import('@/views/message/StrangersMessagePage.vue'),
    meta: { title: '陌生人消息', tabBar: false }
  },
  {
    path: '/message/likes',
    name: 'NotificationLikes',
    component: () => import('@/views/message/notification/NotificationLikes.vue'),
    meta: { title: '收到喜欢', tabBar: false }
  },
  {
    path: '/message/comments',
    name: 'NotificationComments',
    component: () => import('@/views/message/notification/NotificationComments.vue'),
    meta: { title: '评论与@', tabBar: false }
  },
  {
    path: '/message/fans',
    name: 'NotificationFans',
    component: () => import('@/views/message/notification/NotificationFans.vue'),
    meta: { title: '新增粉丝', tabBar: false }
  },
  {
    path: '/profile/me',
    name: 'MyProfile',
    component: () => import('@/views/profile/MyProfile.vue'),
    meta: { title: '我的主页', tabBar: true }
  },
  {
    path: '/profile/:uid',
    name: 'UserProfile',
    component: () => import('@/views/profile/UserProfile.vue'),
    meta: { title: '用户主页', tabBar: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings/SettingsPage.vue'),
    meta: { title: '设置', tabBar: false }
  },
  {
    path: '/settings/privacy',
    name: 'PrivacySettings',
    component: () => import('@/views/settings/PrivacySettingsPage.vue'),
    meta: { title: '隐私设置', tabBar: false }
  },
  {
    path: '/settings/privacy/school',
    name: 'SchoolVisibility',
    component: () => import('@/views/settings/SchoolVisibilityPage.vue'),
    meta: { title: '学校信息可见性', tabBar: false }
  },
  {
    path: '/settings/privacy/search',
    name: 'SearchRecommend',
    component: () => import('@/views/settings/SearchRecommendPage.vue'),
    meta: { title: '搜索与推荐', tabBar: false }
  },
  {
    path: '/settings/privacy/interaction',
    name: 'InteractionPermissions',
    component: () => import('@/views/settings/InteractionPermissionsPage.vue'),
    meta: { title: '互动权限', tabBar: false }
  },
  {
    path: '/settings/privacy/default-post',
    name: 'DefaultPostPreference',
    component: () => import('@/views/settings/DefaultPostPreferencePage.vue'),
    meta: { title: '默认发帖偏好', tabBar: false }
  },
  {
    path: '/settings/content-visibility',
    name: 'ContentVisibility',
    component: () => import('@/views/settings/ContentVisibilityPage.vue'),
    meta: { title: '内容可见性', tabBar: false }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/search/SearchPage.vue'),
    meta: { title: '搜索', tabBar: false }
  },
  {
    path: '/profile-search',
    name: 'ProfileSearch',
    component: () => import('@/views/profile/ProfileSearchPage.vue'),
    meta: { title: '个人主页搜索', tabBar: false }
  },
  {
    path: '/edit-profile',
    name: 'EditProfile',
    component: () => import('@/views/profile/EditProfile.vue'),
    meta: { title: '编辑资料', tabBar: false }
  },
  {
    path: '/circle',
    name: 'Circle',
    component: () => import('@/views/circle/CirclePage.vue'),
    meta: { title: '我的圈子', tabBar: false }
  },
  {
    path: '/circle/plaza',
    name: 'CirclePlaza',
    component: () => import('@/views/circle/CirclePlaza.vue'),
    meta: { title: '圈子广场', tabBar: false }
  },
  {
    path: '/circle/:id',
    name: 'CircleHome',
    component: () => import('@/views/circle/CircleHome.vue'),
    meta: { title: '圈子主页', tabBar: false }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 校声` : '校声 - Echo Campus'
  next()
})

export default router
