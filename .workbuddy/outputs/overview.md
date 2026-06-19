# 隐私设置调整 — 删除「更多设置」→ 新增「默认发帖偏好」

## 变更概览

| 操作 | 文件 | 说明 |
|------|------|------|
| **删除** | `MoreSettingsPage.vue` | 整页 + `/settings/privacy/more` 路由 |
| **新建** | `DefaultPostPreferencePage.vue` | 默认发帖偏好二级页面 |
| **修改** | `PrivacySettingsPage.vue` | 第 4 张卡片替换 |
| **修改** | `stores/app.js` | 新增 defaultAnonPost / defaultSchoolOnly / defaultVisibilityLabels |
| **修改** | `router/index.js` | 路由更新 |
| **修改** | `PostCreate.vue` | 读取默认偏好预填表单 |

## 默认发帖偏好页结构

- 区块 1：默认匿名发布（开关）
- 区块 2：默认可见范围（三选一：完全私密 / 仅关注者 / 所有人）
- 区块 3：默认本校限制（开关，可联动禁用）

### 联动规则
- 默认匿名 → 可见强制「所有人」+ 本校置灰
- 完全私密 → 本校置灰

## PostCreate 预填逻辑

- `onMounted` 从 store 读取默认偏好预填表单
- 发布后重置也回归默认偏好（而非硬编码 public）
