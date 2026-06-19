# 隐私设置模块 — 完成简报

## 构建日期
2026-06-19

## 模块定位
校声「隐私控制中心」— 统一管理用户在平台中的可见性、搜索性、互动权限和内容发布权限。

## 页面架构

```
设置页 (SettingsPage.vue)
  └─ 点击「隐私设置」
        └─ 隐私设置总览 (PrivacySettingsPage.vue) ─── 4 个入口卡片
              ├─ 学校信息可见性 (SchoolVisibilityPage.vue)
              │     └─ 三选一：所有人/仅本校/完全隐藏
              ├─ 搜索与推荐 (SearchRecommendPage.vue)
              │     ├─ 搜索方式复选（昵称/回声号）——联动置灰
              │     ├─ 搜索范围单选（所有人/本校/不允许）
              │     └─ 推荐开关
              ├─ 互动权限 (InteractionPermissionsPage.vue)
              │     ├─ 评论权限单选（4层级）
              │     ├─ 私信权限单选（4层级）
              │     ├─ 关注权限单选（3层级）
              │     └─ 补充开关（匿名消息/陌生人查看）
              └─ 内容发布权限 (ContentPublishPage.vue)
                    ├─ 默认可见范围单选（3层级）
                    ├─ 本校限制开关 ——联动置灰
                    ├─ 匿名规则开关 ——联动自动切换
                    └─ 分发规则说明卡片
```

## 联动规则

| 规则 | 触发条件 | 效果 |
|------|----------|------|
| 搜索方式置灰 | 搜索范围 = "不允许被搜索" | 昵称/回声号开关 disabled + opacity 0.45 |
| 本校可见置灰 | 默认可见 = "完全私密" | schoolOnlyContent 开关 disabled + 自动关闭 |
| 本校可见置灰 | 匿名发帖 = true | schoolOnlyContent 开关 disabled |
| 匿名发帖联动 | 开启匿名 + 默认非公开 | defaultVisibility 自动切为 "everyone" |
| 完全私密联动 | 切到完全私密 | schoolOnlyContent 自动关闭 |

## 文件变更

| 操作 | 文件 | 说明 |
|------|------|------|
| **新建** | `src/views/settings/PrivacySettingsPage.vue` | 隐私总览 |
| **新建** | `src/views/settings/SchoolVisibilityPage.vue` | 学校可见性 |
| **新建** | `src/views/settings/SearchRecommendPage.vue` | 搜索与推荐 |
| **新建** | `src/views/settings/InteractionPermissionsPage.vue` | 互动权限 |
| **新建** | `src/views/settings/ContentPublishPage.vue` | 发布权限 |
| **修改** | `src/stores/app.js` | +12 ref + 6 标签映射 |
| **修改** | `src/router/index.js` | +5 条隐私路由 |
| **修改** | `src/views/settings/SettingsPage.vue` | inline toggle → 隐私入口链接 |

## 构建状态
✅ `npx vite build` 通过，4.98s，零错误
