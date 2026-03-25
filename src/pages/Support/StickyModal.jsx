import { useEffect, useRef, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import HighlightIcon from '@mui/icons-material/Highlight';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import RichInput from '../../components/RichInput';
import { useApp } from '../../context/AppContext';
import { sanitizeHtml } from '../../utils/sanitize';

let counter = 0;

export default function StickyModal({ note, onClose, onDelete }) {
  const { setReceivedStickies, sendRaw, shownStickyId, setShownStickyId } = useApp();
  const [title, setTitle] = useState('');
  const [currentId, setCurrentId] = useState(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setCurrentId(note.id);
      setTimeout(() => {
        if (bodyRef.current) bodyRef.current.innerHTML = note.html ? sanitizeHtml(note.html) : (note.content || '');
      }, 0);
    }
  }, [note]);

  const save = () => {
    const html = sanitizeHtml(bodyRef.current.innerHTML);
    const content = bodyRef.current.textContent;
    const t = title.trim() || 'Note';
    if (currentId) {
      const updated = { id: currentId, title: t, content, html };
      setReceivedStickies(s => s.map(n => n.id === currentId ? updated : n));
      sendRaw({ type: 'sticky-update', note: updated });
      return updated;
    } else {
      const id = `sp-sticky-${Date.now()}-${++counter}`;
      const newNote = { id, title: t, content, html };
      setReceivedStickies(s => [...s, newNote]);
      sendRaw({ type: 'sticky-add', note: newNote });
      setCurrentId(id);
      return newNote;
    }
  };

  const toggleShow = () => {
    const n = save();
    if (shownStickyId === n.id) {
      sendRaw({ type: 'hide-sticky' });
      setShownStickyId(null);
    } else {
      sendRaw({ type: 'show-sticky', note: n });
      setShownStickyId(n.id);
    }
  };

  const wrap = (tag) => {
    const sel = window.getSelection();
    if (!sel.rangeCount || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    let c = range.commonAncestorContainer;
    if (c.nodeType === 3) c = c.parentElement;
    if (!bodyRef.current.contains(c)) return;
    let ex = c.closest(tag);
    if (ex && !bodyRef.current.contains(ex)) ex = null;
    if (ex) {
      while (ex.firstChild) ex.parentNode.insertBefore(ex.firstChild, ex);
      ex.remove();
    } else {
      const w = document.createElement(tag);
      try { range.surroundContents(w); }
      catch { w.appendChild(range.extractContents()); range.insertNode(w); }
    }
    sel.removeAllRanges();
  };

  const isShown = currentId && shownStickyId === currentId;

  return (
    <Dialog open={!!note} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <TextField
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          variant="standard"
          fullWidth
          InputProps={{ sx: { fontWeight: 600 } }}
        />
      </DialogTitle>

      <Stack direction="row" spacing={0.5} sx={{ px: 3, pb: 1 }}>
        <IconButton size="small" onMouseDown={e => e.preventDefault()} onClick={() => wrap('b')}><FormatBoldIcon fontSize="small" /></IconButton>
        <IconButton size="small" onMouseDown={e => e.preventDefault()} onClick={() => wrap('mark')}><HighlightIcon fontSize="small" /></IconButton>
        <IconButton size="small" onMouseDown={e => e.preventDefault()} onClick={() => { bodyRef.current.textContent = bodyRef.current.textContent; }}><FormatClearIcon fontSize="small" /></IconButton>
      </Stack>

      <DialogContent dividers>
        <RichInput ref={bodyRef} placeholder="Note content…" minHeight={96} maxHeight={260} />
      </DialogContent>

      <DialogActions>
        {currentId && <Button color="error" onClick={() => { onDelete(currentId); onClose(); }} sx={{ mr: 'auto' }}>Delete</Button>}
        <Button onClick={onClose}>Close</Button>
        <Button onClick={() => save()}>Save</Button>
        <Button variant="contained" color={isShown ? 'inherit' : 'secondary'} onClick={toggleShow}>
          {isShown ? 'Hide from Interviewer' : 'Show to Interviewer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
