import { useEffect, useState } from 'react';
import { Box, Button, Grid, IconButton, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TitleBar from '../../components/TitleBar';
import HotkeyField from './HotkeyField';
import WebpageList from './WebpageList';
import { useApp } from '../../context/AppContext';

const HOTKEYS = [
  ['sizeMobile', 'Window → Mobile'],
  ['sizeTablet', 'Window → Tablet'],
  ['toggleShow', 'Hide / Show window'],
  ['moveUp', 'Move Up'],
  ['moveDown', 'Move Down'],
  ['moveLeft', 'Move Left'],
  ['moveRight', 'Move Right'],
  ['helpRequest', 'Help Request'],
  ['focusCaption', 'Focus Caption'],
  ['focusWeb', 'Focus Web'],
  ['focusChat', 'Focus Chat'],
  ['toggleSticky', 'Toggle Sticky Note'],
  ['stickyPrev', 'Previous Sticky'],
  ['stickyNext', 'Next Sticky'],
  ['captureArea', 'Capture Screen Area']
];

export default function Settings() {
  const { settings, saveSettings, setView } = useApp();
  const [draft, setDraft] = useState(settings);

  useEffect(() => setDraft(settings), [settings]);

  const save = async () => {
    await saveSettings(draft);
    setView('role');
  };

  return (
    <>
      <TitleBar title="Settings">
        <IconButton size="small" onClick={() => setView('role')}><ArrowBackIcon fontSize="small" /></IconButton>
      </TitleBar>

      <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Paper variant="outlined" sx={{ p: 2.5 }}>
              <Typography variant="h6" gutterBottom>Hotkeys</Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                Click a field and press the key combination.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {HOTKEYS.map(([key, label]) => (
                  <HotkeyField
                    key={key}
                    label={label}
                    value={draft.hotkeys[key] || ''}
                    onChange={v => setDraft(d => ({ ...d, hotkeys: { ...d.hotkeys, [key]: v } }))}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Paper variant="outlined" sx={{ p: 2.5 }}>
              <Typography variant="h6" gutterBottom>Webpage List</Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                Quick-access URLs for the web viewer.
              </Typography>
              <WebpageList
                pages={draft.webpages}
                onChange={pages => setDraft(d => ({ ...d, webpages: pages }))}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="success" size="large" onClick={save}>Save</Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
