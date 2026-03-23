// ---------- helpers ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

let role = null;
let connected = false;
let msgCounter = 0;
let settings = { hotkeys: {}, webpages: [] };

function showView(id) {
  $$('.view').forEach(v => v.classList.toggle('active', v.id === id));
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// Only allow safe inline formatting tags from the rich editor / peer edits
function sanitizeHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const allowed = new Set(['B', 'STRONG', 'MARK', 'BR']);
  (function walk(node) {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 1) {
        if (!allowed.has(child.tagName)) {
          while (child.firstChild) node.insertBefore(child.firstChild, child);
          node.removeChild(child);
        } else {
          for (const a of [...child.attributes]) child.removeAttribute(a.name);
          walk(child);
        }
      }
    }
  })(tmp);
  return tmp.innerHTML;
}

function appendMsg(logEl, { id, from, html, text }, withDelete) {
  const div = document.createElement('div');
  div.className = 'msg ' + (from === role ? 'me' : 'them');
  div.dataset.id = id;

  const content = document.createElement('span');
  content.className = 'msg-content';
  content.innerHTML = html ? sanitizeHtml(html) : escapeHtml(text);
  div.appendChild(content);

  if (withDelete) {
    const del = document.createElement('button');
    del.className = 'msg-del';
    del.textContent = '×';
    del.title = 'Delete message';
    del.addEventListener('click', (e) => {
      e.stopPropagation();
      div.remove();
      window.api.sendMessage({ type: 'delete', id });
    });
    div.appendChild(del);
  }

  logEl.appendChild(div);
  logEl.scrollTop = logEl.scrollHeight;
  return div;
}

// ---------- role select ----------
$('#btn-interviewer').addEventListener('click', async () => {
  role = 'interviewer';
  showView('view-interviewer');
  $('#iv-grid').dataset.focus = 'caption';
  populateWebList();
  try {
    await window.api.startServer(5000);
  } catch (e) {
    $('#iv-status').textContent = 'Server error: ' + e;
  }
});

$('#btn-support').addEventListener('click', () => {
  role = 'support';
  showView('view-support');
});

$('#btn-settings').addEventListener('click', () => {
  renderSettings();
  showView('view-settings');
});

$$('.back-btn').forEach(b =>
  b.addEventListener('click', () => showView(b.dataset.target))
);

// ---------- interviewer: panel focus ----------
$$('#iv-grid .panel-head').forEach(head => {
  head.addEventListener('click', () => {
    $('#iv-grid').dataset.focus = head.dataset.panel;
  });
});

// ---------- interviewer: web viewer ----------
function populateWebList() {
  const sel = $('#web-list');
  sel.innerHTML = '<option value="">-- pages --</option>';
  for (const url of settings.webpages) {
    const opt = document.createElement('option');
    opt.value = url;
    opt.textContent = url;
    sel.appendChild(opt);
  }
}
$('#web-list').addEventListener('change', (e) => {
  if (e.target.value) {
    $('#web-url').value = e.target.value;
    $('#webview').src = e.target.value;
  }
});
$('#web-go').addEventListener('click', () => {
  const url = $('#web-url').value.trim();
  if (url) $('#webview').src = url;
});
$('#web-url').addEventListener('keydown', e => {
  if (e.key === 'Enter') $('#web-go').click();
});

// ---------- interviewer: chat ----------
function ivSend(text) {
  text = (text ?? $('#iv-chat-input').value).trim();
  if (!text) return;
  const id = `${role}-${Date.now()}-${msgCounter++}`;
  const payload = { type: 'msg', id, from: role, text, html: escapeHtml(text) };
  appendMsg($('#iv-chat-log'), payload, false);
  window.api.sendMessage(payload);
  $('#iv-chat-input').value = '';
}
$('#iv-chat-send').addEventListener('click', () => ivSend());
$('#iv-chat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') ivSend();
});

// ---------- support: connect ----------
$('#sp-connect').addEventListener('click', async () => {
  if (!connected) {
    const host = $('#sp-ip').value.trim();
    const port = parseInt($('#sp-port').value, 10);
    if (!host || !port) return;
    try {
      await window.api.connect(host, port);
    } catch (e) {
      $('#sp-status').textContent = 'Error: ' + e;
    }
  } else {
    await window.api.disconnect();
  }
});

// ---------- support: chat (rich input) ----------
function spSend() {
  const input = $('#sp-chat-input');
  const html = sanitizeHtml(input.innerHTML).trim();
  const text = input.textContent.trim();
  if (!text) return;
  const id = `${role}-${Date.now()}-${msgCounter++}`;
  const payload = { type: 'msg', id, from: role, text, html };
  appendMsg($('#sp-chat-log'), payload, true);
  window.api.sendMessage(payload);
  input.innerHTML = '';
}
$('#sp-chat-send').addEventListener('click', spSend);
$('#sp-chat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); spSend(); }
});

// ---------- support: formatting (toggle) ----------
// Works on both the contenteditable input and existing messages in the log.
function toggleWrap(tag) {
  const sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed) return;
  const range = sel.getRangeAt(0);

  let container = range.commonAncestorContainer;
  if (container.nodeType === 3) container = container.parentElement;

  const inInput = container.closest('#sp-chat-input');
  const msgEl = container.closest('#sp-chat-log .msg');
  if (!inInput && !msgEl) return;

  // detect if selection is already inside this tag -> unwrap
  let existing = container.closest(tag);
  const boundary = inInput || msgEl.querySelector('.msg-content');
  if (existing && !boundary.contains(existing)) existing = null;

  if (existing) {
    while (existing.firstChild)
      existing.parentNode.insertBefore(existing.firstChild, existing);
    existing.remove();
  } else {
    const wrapper = document.createElement(tag);
    try {
      range.surroundContents(wrapper);
    } catch {
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);
    }
  }
  sel.removeAllRanges();

  if (msgEl) syncEdit(msgEl);
}

function clearFormat() {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  let node = sel.getRangeAt(0).commonAncestorContainer;
  if (node.nodeType === 3) node = node.parentElement;

  const inInput = node.closest('#sp-chat-input');
  const msgEl = node.closest('#sp-chat-log .msg');

  if (inInput) {
    inInput.textContent = inInput.textContent;
  } else if (msgEl) {
    const c = msgEl.querySelector('.msg-content');
    c.textContent = c.textContent;
    syncEdit(msgEl);
  }
  sel.removeAllRanges();
}

function syncEdit(msgEl) {
  window.api.sendMessage({
    type: 'edit',
    id: msgEl.dataset.id,
    html: msgEl.querySelector('.msg-content').innerHTML
  });
}

// preserve selection when clicking toolbar buttons
['#fmt-bold', '#fmt-hl', '#fmt-clear'].forEach(id =>
  $(id).addEventListener('mousedown', e => e.preventDefault())
);
$('#fmt-bold').addEventListener('click', () => toggleWrap('b'));
$('#fmt-hl').addEventListener('click', () => toggleWrap('mark'));
$('#fmt-clear').addEventListener('click', clearFormat);

// ---------- support: clear history ----------
$('#chat-clear').addEventListener('click', () => {
  if (!confirm('Clear all chat history?')) return;
  $('#sp-chat-log').innerHTML = '';
  window.api.sendMessage({ type: 'clear' });
});

// ---------- incoming ----------
window.api.onChatMessage((msg) => {
  const log = role === 'interviewer' ? $('#iv-chat-log') : $('#sp-chat-log');
  const withDel = role === 'support';

  if (msg.type === 'msg') {
    appendMsg(log, msg, withDel);
    if (role === 'interviewer') {
      const badge = $('#iv-badge');
      badge.classList.remove('hidden');
      clearTimeout(badge._timer);
      badge._timer = setTimeout(() => badge.classList.add('hidden'), 3000);
    }
  } else if (msg.type === 'edit') {
    const el = log.querySelector(`.msg[data-id="${msg.id}"] .msg-content`);
    if (el) el.innerHTML = sanitizeHtml(msg.html);
  } else if (msg.type === 'delete') {
    const el = log.querySelector(`.msg[data-id="${msg.id}"]`);
    if (el) el.remove();
  } else if (msg.type === 'clear') {
    log.innerHTML = '';
  }
});

window.api.onPeerStatus((s) => {
  connected = !!s.connected;
  if (role === 'interviewer') {
    const el = $('#iv-status');
    el.textContent = connected ? 'Support connected' : 'Listening on port 5000 — waiting…';
    el.className = 'status ' + (connected ? 'on' : 'off');
  } else if (role === 'support') {
    const el = $('#sp-status');
    el.textContent = connected ? 'Connected' : 'Disconnected';
    el.className = 'status ' + (connected ? 'on' : 'off');

    const btn = $('#sp-connect');
    btn.textContent = connected ? 'Disconnect' : 'Connect';
    btn.classList.toggle('disconnect', connected);
    $('#sp-ip').disabled = connected;
    $('#sp-port').disabled = connected;
  }
});

// ---------- hotkey: help request ----------
window.api.onHotkeyAction((a) => {
  if (a.action === 'focusPanel') {
    if (role === 'interviewer') {
      $('#iv-grid').dataset.focus = a.panel;
    }
    return;
  }
  if (a.action !== 'helpRequest') return;
  if (role === 'interviewer') {
    ivSend('🆘 Help request');
  } else if (role === 'support') {
    const id = `${role}-${Date.now()}-${msgCounter++}`;
    const payload = { type: 'msg', id, from: role, text: 'Help request', html: '<b>🆘 Help request</b>' };
    appendMsg($('#sp-chat-log'), payload, true);
    window.api.sendMessage(payload);
  }
});

// ========================================================
// Settings page
// ========================================================
async function loadSettings() {
  settings = await window.api.getSettings();
}

function renderSettings() {
  // hotkeys
  $$('.hk').forEach(inp => {
    inp.value = settings.hotkeys[inp.dataset.hk] || '';
  });
  // webpages
  renderWebpages();
}

function renderWebpages() {
  const ul = $('#wp-list');
  ul.innerHTML = '';
  settings.webpages.forEach((url, i) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = url;
    const del = document.createElement('button');
    del.textContent = '×';
    del.addEventListener('click', () => {
      settings.webpages.splice(i, 1);
      renderWebpages();
    });
    li.appendChild(span);
    li.appendChild(del);
    ul.appendChild(li);
  });
}

// hotkey capture
$$('.hk').forEach(inp => {
  inp.addEventListener('focus', () => { inp.classList.add('recording'); window.api.suspendHotkeys(); });
  inp.addEventListener('blur', () => { inp.classList.remove('recording'); window.api.resumeHotkeys(); });
  inp.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (e.key === 'Escape') { inp.blur(); return; }
    if (e.key === 'Backspace' || e.key === 'Delete') {
      inp.value = '';
      settings.hotkeys[inp.dataset.hk] = '';
      return;
    }
    const parts = [];
    if (e.ctrlKey || e.metaKey) parts.push('CommandOrControl');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    const k = normalizeKey(e.key);
    if (!k || ['Control','Alt','Shift','Meta'].includes(e.key)) return;
    parts.push(k);
    const accel = parts.join('+');
    inp.value = accel;
    settings.hotkeys[inp.dataset.hk] = accel;
  });
});

function normalizeKey(k) {
  const map = {
    ArrowUp: 'Up', ArrowDown: 'Down', ArrowLeft: 'Left', ArrowRight: 'Right',
    ' ': 'Space', Escape: 'Esc', '+': 'Plus'
  };
  if (map[k]) return map[k];
  if (k.length === 1) return k.toUpperCase();
  return k;
}

$('#wp-add-btn').addEventListener('click', () => {
  const v = $('#wp-input').value.trim();
  if (!v) return;
  settings.webpages.push(v);
  $('#wp-input').value = '';
  renderWebpages();
});
$('#wp-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') $('#wp-add-btn').click();
});

$('#settings-save').addEventListener('click', async () => {
  settings = await window.api.setSettings(settings);
  populateWebList();
  alert('Settings saved');
});

// ---------- init ----------
loadSettings().then(populateWebList);
