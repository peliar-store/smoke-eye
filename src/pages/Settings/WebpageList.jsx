import { useState } from 'react';
import { Box, Button, IconButton, List, ListItem, ListItemText, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function WebpageList({ pages, onChange }) {
  const [input, setInput] = useState('');

  const add = () => {
    const v = input.trim();
    if (!v) return;
    onChange([...pages, v]);
    setInput('');
  };

  const remove = (idx) => onChange(pages.filter((_, i) => i !== idx));

  return (
    <>
      <List dense sx={{ maxHeight: 240, overflow: 'auto', mb: 2 }}>
        {pages.map((url, i) => (
          <ListItem
            key={i}
            sx={{ bgcolor: 'action.hover', borderRadius: 1, mb: 0.5 }}
            secondaryAction={
              <IconButton edge="end" size="small" onClick={() => remove(i)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemText primary={url} primaryTypographyProps={{ noWrap: true, fontSize: 12 }} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          placeholder="https://…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          fullWidth
        />
        <Button variant="contained" onClick={add}>Add</Button>
      </Box>
    </>
  );
}
