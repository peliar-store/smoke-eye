import { useRef } from 'react';
import { Box, Button, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import HighlightIcon from '@mui/icons-material/Highlight';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ChatLog from '../../components/ChatLog';
import RichInput from '../../components/RichInput';
import { useApp } from '../../context/AppContext';
import { sanitizeHtml } from '../../utils/sanitize';

export default function ChatArea() {
  const { messages, setMessages, sendMsg, sendRaw } = useApp();
  const inputRef = useRef(null);

  const send = () => {
    const el = inputRef.current;
    const html = sanitizeHtml(el.innerHTML).trim();
    const text = el.textContent.trim();
    if (!text) return;
    sendMsg(text, html);
    el.innerHTML = '';
  };

  const toggleWrap = (tag) => {
    const sel = window.getSelection();
    if (!sel.rangeCount || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    let container = range.commonAncestorContainer;
    if (container.nodeType === 3) container = container.parentElement;

    const inInput = inputRef.current.contains(container);
    const msgEl = container.closest('.msg');
    if (!inInput && !msgEl) return;

    const boundary = inInput ? inputRef.current : msgEl.querySelector('.msg-content');
    let existing = container.closest(tag);
    if (existing && !boundary.contains(existing)) existing = null;

    if (existing) {
      while (existing.firstChild) existing.parentNode.insertBefore(existing.firstChild, existing);
      existing.remove();
    } else {
      const w = document.createElement(tag);
      try { range.surroundContents(w); }
      catch { w.appendChild(range.extractContents()); range.insertNode(w); }
    }
    sel.removeAllRanges();

    if (msgEl) {
      const id = msgEl.dataset.id;
      const html = msgEl.querySelector('.msg-content').innerHTML;
      sendRaw({ type: 'edit', id, html });
      setMessages(m => m.map(x => x.id === id ? { ...x, html } : x));
    }
  };

  const clearFmt = () => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    let node = sel.getRangeAt(0).commonAncestorContainer;
    if (node.nodeType === 3) node = node.parentElement;
    if (inputRef.current.contains(node)) {
      inputRef.current.textContent = inputRef.current.textContent;
    }
    sel.removeAllRanges();
  };

  const deleteMsg = (id) => {
    setMessages(m => m.filter(x => x.id !== id));
    sendRaw({ type: 'delete', id });
  };

  const clearAll = () => {
    if (!confirm('Clear all chat history?')) return;
    setMessages([]);
    sendRaw({ type: 'clear' });
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, maxWidth: { md: 900 } }}>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ px: 0.5, pb: 1 }}>
        <Tooltip title="Bold"><IconButton size="small" onMouseDown={e => e.preventDefault()} onClick={() => toggleWrap('b')}><FormatBoldIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Highlight"><IconButton size="small" onMouseDown={e => e.preventDefault()} onClick={() => toggleWrap('mark')}><HighlightIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Clear format"><IconButton size="small" onMouseDown={e => e.preventDefault()} onClick={clearFmt}><FormatClearIcon fontSize="small" /></IconButton></Tooltip>
        <Box sx={{ flex: 1 }} />
        <Tooltip title="Clear history"><IconButton size="small" color="error" onClick={clearAll}><DeleteSweepIcon fontSize="small" /></IconButton></Tooltip>
      </Stack>

      <Paper variant="outlined" sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <ChatLog messages={messages} role="support" onDelete={deleteMsg} editable />
      </Paper>

      <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
        <RichInput
          ref={inputRef}
          placeholder="Type a message…"
          onSend={send}
        />
        <Button variant="contained" onClick={send}>Send</Button>
      </Box>
    </Box>
  );
}
