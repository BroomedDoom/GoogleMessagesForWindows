const webview = document.getElementById('messages-webview');
const statusPill = document.getElementById('status-pill');
const actionButtons = document.querySelectorAll('.nav-item');

const injectedCss = `
  :root {
    --gmfw-surface: #10191d;
    --gmfw-surface-2: #16242b;
    --gmfw-surface-3: #1d3139;
    --gmfw-text: #eef8fb;
    --gmfw-muted: #a5bcc5;
    --gmfw-accent: #79d0f5;
    --gmfw-radius: 24px;
  }

  body {
    background: linear-gradient(180deg, #0e161a, #10191d) !important;
  }

  mwc-drawer,
  .bg-primary-background,
  .bg-surface,
  .bg-background {
    background: transparent !important;
  }

  .main-nav,
  .conversation-list,
  .conversation-container,
  .text-msg-list,
  .input-row,
  .start-chat-container,
  .conversation-header,
  .search-view,
  .module-container,
  .ql-editor,
  .list-view,
  .nav-header,
  .conversation-list-container,
  .rcs-education {
    border-radius: var(--gmfw-radius) !important;
  }

  .conversation-list,
  .conversation-container,
  .start-chat-container,
  .search-view,
  .module-container {
    background: var(--gmfw-surface) !important;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05), 0 12px 30px rgba(0,0,0,0.24) !important;
  }

  .conversation-header,
  .input-row,
  .nav-header,
  .search-container {
    background: var(--gmfw-surface-2) !important;
    border-color: rgba(255,255,255,0.06) !important;
  }

  .text-color-primary,
  .text-color-on-surface,
  .text-color-secondary,
  .input,
  .ql-editor,
  .conversation-snippet,
  .conversation-title,
  .participant-name,
  .timestamp,
  span,
  p,
  h1,
  h2,
  h3,
  h4,
  div {
    color: var(--gmfw-text);
  }

  .text-color-secondary,
  .timestamp,
  .secondary-text,
  .preview-text {
    color: var(--gmfw-muted) !important;
  }

  .fab,
  .compose-button,
  button[aria-label*="Start chat"],
  button[aria-label*="New conversation"] {
    border-radius: 18px !important;
    background: linear-gradient(180deg, #79d0f5, #27b4ef) !important;
    color: #0b1417 !important;
    box-shadow: 0 16px 28px rgba(39,180,239,0.32) !important;
  }

  .conversation.selected,
  .list-item.selected,
  .list-item:focus-within,
  .list-item:hover {
    background: rgba(121, 208, 245, 0.12) !important;
    border-radius: 18px !important;
  }

  .message-content,
  .message-bubble,
  .text-msg {
    border-radius: 22px !important;
  }

  .outgoing .message-content,
  .outgoing .message-bubble,
  .message.outgoing .text-msg {
    background: linear-gradient(180deg, #79d0f5, #52c2f1) !important;
    color: #07242e !important;
  }

  .incoming .message-content,
  .incoming .message-bubble,
  .message.incoming .text-msg {
    background: #20323a !important;
    color: var(--gmfw-text) !important;
  }

  .input-row,
  .ql-container,
  .input-container {
    border-radius: 24px !important;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(121, 208, 245, 0.25);
    border-radius: 999px;
  }
`;

const injectedScript = `
  (() => {
    const focusSearch = () => {
      const selectors = [
        'input[type="search"]',
        'input[placeholder*="Search"]',
        'input[aria-label*="Search"]',
        'mws-search-input input',
        'mws-conversations-list input'
      ];
      const target = selectors.map((selector) => document.querySelector(selector)).find(Boolean);
      if (target) {
        target.focus();
        target.select?.();
        return true;
      }
      return false;
    };

    window.__GMFW__ = {
      focusSearch,
      toggleCompactMode() {
        document.body.classList.toggle('gmfw-compact');
        return document.body.classList.contains('gmfw-compact');
      }
    };
  })();
`;

const compactCss = `
  body.gmfw-compact .conversation,
  body.gmfw-compact .list-item,
  body.gmfw-compact .message-row,
  body.gmfw-compact .input-row {
    transform: scale(0.97);
    transform-origin: top center;
  }

  body.gmfw-compact .conversation-list,
  body.gmfw-compact .conversation-container {
    border-radius: 18px !important;
  }
`;

let compactMode = false;

function setStatus(text) {
  statusPill.textContent = text;
}

async function injectEnhancements() {
  try {
    await webview.insertCSS(injectedCss);
    await webview.insertCSS(compactCss);
    await webview.executeJavaScript(injectedScript, true);
    setStatus('Messages ready');
  } catch (error) {
    console.error('Failed to inject desktop enhancements', error);
    setStatus('Loaded with limited enhancements');
  }
}

async function focusSearch() {
  await webview.executeJavaScript('window.__GMFW__?.focusSearch?.();', true);
}

async function toggleCompactMode() {
  compactMode = !compactMode;
  await webview.executeJavaScript('window.__GMFW__?.toggleCompactMode?.();', true);
  actionButtons.forEach((button) => {
    if (button.dataset.action === 'toggle-density') {
      button.classList.toggle('is-active', compactMode);
    }
  });
  setStatus(compactMode ? 'Compact Android mode on' : 'Compact Android mode off');
}

function refreshMessages() {
  setStatus('Refreshing Messages…');
  webview.reload();
}

webview.addEventListener('did-start-loading', () => setStatus('Loading Messages…'));
webview.addEventListener('did-stop-loading', injectEnhancements);
webview.addEventListener('dom-ready', injectEnhancements);
webview.addEventListener('did-fail-load', () => setStatus('Could not load Google Messages'));

for (const button of actionButtons) {
  button.addEventListener('click', () => {
    actionButtons.forEach((item) => item.classList.toggle('is-active', item === button));

    switch (button.dataset.action) {
      case 'focus-search':
        focusSearch();
        break;
      case 'toggle-density':
        toggleCompactMode();
        break;
      case 'refresh':
        refreshMessages();
        break;
      default:
        break;
    }
  });
}

document.addEventListener('keydown', (event) => {
  const isSearchShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
  const isRefreshShortcut = event.key === 'F5';

  if (isSearchShortcut) {
    event.preventDefault();
    focusSearch();
  }

  if (isRefreshShortcut) {
    event.preventDefault();
    refreshMessages();
  }
});
