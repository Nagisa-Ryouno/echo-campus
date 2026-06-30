import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import 'vant/lib/index.css'
import './styles/global.css'

const app = createApp(App)

// ===== 全局异常捕捉并直接以悬浮红底大字层呈现（用于远程无调试环境的 Bug 捕获） =====
function showGlobalError(title, err) {
  // 防御性：避免重复创建
  if (document.getElementById('echo-global-error-overlay')) return;

  const errorDiv = document.createElement('div');
  errorDiv.id = 'echo-global-error-overlay';
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '0';
  errorDiv.style.left = '0';
  errorDiv.style.width = '100vw';
  errorDiv.style.height = '100vh';
  errorDiv.style.background = 'rgba(230, 40, 40, 0.98)';
  errorDiv.style.color = '#fff';
  errorDiv.style.zIndex = '9999999';
  errorDiv.style.padding = '20px';
  errorDiv.style.boxSizing = 'border-box';
  errorDiv.style.overflow = 'auto';
  errorDiv.style.fontFamily = 'monospace';
  errorDiv.style.fontSize = '14px';
  errorDiv.style.whiteSpace = 'pre-wrap';

  let errMsg = 'No message';
  let errStack = 'No stack trace';

  if (err) {
    errMsg = err.message || String(err);
    errStack = err.stack || 'No stack trace available';
  }

  errorDiv.innerHTML = `
    <h2 style="margin-top:0; border-bottom:1px solid #fff; padding-bottom:10px;">🚨 ${title}</h2>
    <div style="margin-bottom:15px; font-weight:bold; font-size:16px;">${errMsg}</div>
    <pre style="background:rgba(0,0,0,0.3); padding:12px; border-radius:4px; overflow:auto;">${errStack}</pre>
    <button onclick="document.getElementById('echo-global-error-overlay').remove()" style="margin-top:15px; padding:8px 16px; background:#fff; color:#e62828; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">关闭提示</button>
  `;
  document.body.appendChild(errorDiv);
}

window.addEventListener('error', (event) => {
  showGlobalError('Window Runtime Error', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  showGlobalError('Unhandled Promise Rejection', event.reason);
});

app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err, info);
  showGlobalError(`Vue Error (${info})`, err);
};

app.use(createPinia())
app.use(router)
app.mount('#app')
