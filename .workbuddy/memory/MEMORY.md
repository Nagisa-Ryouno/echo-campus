# Echo Campus 项目记忆

## 技术栈
- Vue 3 (Composition API / `<script setup>`)
- Vite 5 构建
- Vant 4 组件库（按需引入，`unplugin-vue-components`）
- Vue Router 4 (Hash 模式)
- Pinia 状态管理
- 前端 Mock 数据（无需后端）

## 项目结构
```
echo-campus/
├── src/
│   ├── views/           # 14 个页面视���
│   │   ├── splash/      # SplashPage 启动页
│   │   ├── auth/        # LoginPage, RegisterPage
│   │   ├── home/        # HomePage
│   │   ├── discover/    # DiscoverPage
│   │   ├── post/        # PostCreate, PostDetail
│   │   ├── message/     # MessagePage, AnonMessage
│   │   ├── profile/     # MyProfile, UserProfile
│   │   ├── settings/    # SettingsPage
│   │   ├── search/      # SearchPage
│   │   └── circle/      # CirclePage
│   ├── components/
│   │   └── layout/      # PhoneShell, TabBar
│   ├── router/          # Vue Router 路由表
│   ├── stores/          # Pinia stores
│   ├── mock/            # 本地 Mock 数据
│   └── styles/          # 全局样式
└── package.json
```

## 设计规范
- 手机壳容器：375px × 812px，PC 居中，深色边框
- 底部导航：首页/发现/+/消息/我，+ 按钮突出
- 主色：#4caf7d（校园绿），强调色：#ff6b35（活力橙）
- 字体：PingFang SC / Microsoft YaHei

## 开发批次
- 批次 1 ✅ 骨架搭建（2026-06-18）
- 批次 2 ⏳ 首页与发帖
- 批次 3 ⏳ 消息与个人中心
- 批次 4 ⏳ 补全页面与视觉统一
