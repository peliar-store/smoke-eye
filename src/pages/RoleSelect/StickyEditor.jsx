import { useState } from 'react';
import { Button, IconButton, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useApp } from '../../context/AppContext';
import { escapeHtml } from '../../utils/sanitize';

let counter = 0;

export default function StickyEditor() {
  const { stickyNotes, setStickyNotes } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const add = () => {
    if (!title.trim() && !content.trim()) return;
    setStickyNotes(n => [...n, {
      id: `sticky-${++counter}`,
      title: title.trim() || 'Note',
      content, html: escapeHtml(content)
    }]);
    setTitle(''); setContent('');
  };

  const remove = (idx) => setStickyNotes(n => n.filter((_, i) => i !== idx));

  return (
    <Stack spacing={1.5}>
      <TextField
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && document.getElementById('sticky-content-field')?.focus()}
        fullWidth
      />
      <TextField
        id="sticky-content-field"
        placeholder="Content (Ctrl+Enter to add)"
        value={content}
        onChange={e => setContent(e.target.value)}
        onKeyDown={e => (e.ctrlKey || e.metaKey) && e.key === 'Enter' && add()}
        multiline rows={2} fullWidth
      />
      <Button variant="outlined" startIcon={<AddIcon />} onClick={add} fullWidth>
        Add Note
      </Button>

      {stickyNotes.length > 0 ? (
        <List dense disablePadding sx={{ maxHeight: 140, overflow: 'auto' }}>
          {stickyNotes.map((n, i) => (
            <ListItem
              key={n.id}
              sx={{ bgcolor: 'action.hover', borderRadius: 1, mb: 0.5, borderLeft: 3, borderColor: 'secondary.main', pr: 6 }}
              secondaryAction={
                <IconButton edge="end" size="small" onClick={() => remove(i)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
            >
              <ListItemText
                primary={n.title}
                secondary={n.content}
                primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
                secondaryTypographyProps={{ noWrap: true }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="caption" color="text.disabled" align="center" sx={{ py: 1 }}>
          No notes yet
        </Typography>
      )}
    </Stack>
  );
}
