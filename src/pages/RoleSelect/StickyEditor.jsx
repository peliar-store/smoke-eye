import { useState } from 'react';
import { Box, Button, IconButton, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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
    <Box>
      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
        Sticky Notes
      </Typography>
      <TextField
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && document.getElementById('sticky-content-field')?.focus()}
        fullWidth
        sx={{ mb: 1 }}
      />
      <TextField
        id="sticky-content-field"
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        onKeyDown={e => (e.ctrlKey || e.metaKey) && e.key === 'Enter' && add()}
        multiline rows={3} fullWidth sx={{ mb: 1 }}
      />
      <Button variant="contained" onClick={add} fullWidth>Add Note</Button>

      {stickyNotes.length > 0 && (
        <List dense sx={{ maxHeight: 170, overflow: 'auto', mt: 1 }}>
          {stickyNotes.map((n, i) => (
            <ListItem
              key={n.id}
              sx={{ bgcolor: 'action.hover', borderRadius: 1, mb: 0.5, borderLeft: 3, borderColor: 'secondary.main' }}
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
      )}
    </Box>
  );
}
