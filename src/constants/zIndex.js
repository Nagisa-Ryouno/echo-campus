/**
 * 统一 z-index 系统常量定义
 * 规范全站层级关系，杜绝任意魔法数字导致层级冲突
 */

export const Z_INDEX = {
  // 底部 TabBar 全局导航层
  TABBAR: 1000,
  
  // 顶部 Header 导航层
  HEADER: 900,
  
  // 普通悬浮按钮、浮动层
  FLOAT_BTN: 500,
  
  // 下拉菜单、局部 ContextMenu
  CONTEXT_MENU: 1500,
  
  // 抽屉弹窗、ActionSheet 侧滑层
  DRAWER: 2000,
  
  // 确认对话框、全局模态弹窗
  DIALOG: 3000,
  
  // 全局极高优先级遮罩、Toast 提示、Runtime 错误警告
  OVERLAY: 9000,
  TOAST: 9500,
  ERROR_OVERLAY: 9999
}
