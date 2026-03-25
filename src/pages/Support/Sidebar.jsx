import { useState } from 'react';
import { Box, Chip, IconButton, List, ListItem, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useApp } from '../../context/AppContext';
import StickyModal from './StickyModal';

const FILE_TYPES = { cv: 'CV', 'job-description': 'JD', 'support-material': 'Material', other: 'Other' };

export default function Sidebar() {
  const { receivedStickies, setReceivedStickies, receivedFiles, sendRaw, shownStickyId, setShownStickyId } = useApp();
  const [modal, setModal] = useState(null);

  const deleteSticky = (id) => {
    setReceivedStickies(s => s.filter(n => n.id !== id));
    if (shownStickyId === id) setShownStickyId(null);
    sendRaw({ type: 'sticky-delete', id });
  };

  return (
    <>
      <Box sx={{ width: { xs: '100%', md: 230 }, display: 'flex', flexDirection: 'column', gap: 1, maxHeight: { xs: 300, md: 'none' } }}>
        <SidePanel
          title="Sticky Notes"
          action={<IconButton size="small" color="secondary" onClick={() => setModal({ id: null, title: '', content: '', html: '' })}><AddIcon fontSize="small" /></IconButton>}
        >
          {receivedStickies.length === 0 ? (
            <Empty>No sticky notes yet</Empty>
          ) : (
            <List dense disablePadding>
              {receivedStickies.map(n => (
                <ListItem
                  key={n.id} disablePadding
                  secondaryAction={
                    <IconButton edge="end" size="small" onClick={e => { e.stopPropagation(); deleteSticky(n.id); }}>
                      <DeleteIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  }
                  sx={{ mb: 0.5, '& .MuiListItemSecondaryAction-root': { opacity: 0 }, '&:hover .MuiListItemSecondaryAction-root': { opacity: 1 } }}
                >
                  <ListItemButton
                    onClick={() => setModal(n)}
                    sx={{ borderRadius: 1, borderLeft: 3, borderColor: 'secondary.main', bgcolor: 'action.hover' }}
                  >
                    <ListItemText
                      primary={n.title}
                      secondary={n.content}
                      primaryTypographyProps={{ fontWeight: 600, noWrap: true, fontSize: 12 }}
                      secondaryTypographyProps={{ noWrap: true, fontSize: 11 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </SidePanel>

        <SidePanel title="Files">
          {receivedFiles.length === 0 ? (
            <Empty>No files yet</Empty>
          ) : (
            <List dense disablePadding>
              {receivedFiles.map((f, i) => (
                <ListItemButton
                  key={i}
                  onClick={() => sendRaw({ type: 'request-file', index: i })}
                  sx={{ borderRadius: 1, mb: 0.5, bgcolor: 'action.hover' }}
                >
                  <Chip label={FILE_TYPES[f.type] || f.type} size="small" color="primary" sx={{ mr: 1, height: 18, fontSize: 9 }} />
                  <Typography variant="caption" noWrap>{f.name}</Typography>
                </ListItemButton>
              ))}
            </List>
          )}
        </SidePanel>
      </Box>

      <StickyModal note={modal} onClose={() => setModal(null)} onDelete={deleteSticky} />
    </>
  );
}

function SidePanel({ title, action, children }) {
  return (
    <Paper variant="outlined" sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 100, overflow: 'hidden' }}>
      <Box sx={{ px: 1.5, py: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2" fontWeight={600}>{title}</Typography>
        {action}
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>{children}</Box>
    </Paper>
  );
}

function Empty({ children }) {
  return <Typography variant="caption" color="text.disabled" sx={{ p: 1, display: 'block' }}>{children}</Typography>;
}
