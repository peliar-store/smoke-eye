import { useEffect, useState } from 'react';
import { Box, Button, Grid, IconButton, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TuneIcon from '@mui/icons-material/Tune';
import TitleBar from '../../components/TitleBar';
import HotkeyField from './HotkeyField';
import WebpageList from './WebpageList';
import { useApp } from '../../context/AppContext';

const HOTKEYS = [
  ['sizeMobile', 'Window \u2192 Mobile'],
  ['sizeTablet', 'Window \u2192 Tablet'],
  ['toggleShow', 'Hide / Show window'],
  ['toggleProtection', 'Toggle Protection'],
  ['moveUp', 'Move Up'],
  ['moveDown', 'Move Down'],
  ['moveLeft', 'Move Left'],
  ['moveRight', 'Move Right'],
  ['opacityUp', 'Opacity Up'],
  ['opacityDown', 'Opacity Down'],
  ['helpRequest', 'Help Request'],
  ['focusCaption', 'Focus Caption'],
  ['focusWeb', 'Focus Web'],
  ['focusChat', 'Focus Chat'],
  ['toggleSticky', 'Toggle Sticky Note'],
  ['stickyPrev', 'Previous Sticky'],
  ['stickyNext', 'Next Sticky'],
  ['captureArea', 'Capture Screen Area']
];

function SizeRow({ label, size, onSet }) {
  const [adjusting, setAdjusting] = useState(false);

  const toggle = async () => {
    if (!adjusting) {
      window.api.winSetSize(size.w, size.h);
      window.api.winSetResizable(true);
      setAdjusting(true);
    } else {
      // Read current size and save
      const { w, h } = await window.api.winGetSize();
      onSet({ w, h });
      window.api.winSetResizable(false);
      setAdjusting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5 }}>
      <Typography variant="body2" sx={{ minWidth: 80 }}>{label}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
        {size.w} x {size.h}
      </Typography>
      <Button
        size="small"
        variant={adjusting ? 'contained' : 'outlined'}
        color={adjusting ? 'warning' : 'primary'}
        startIcon={<TuneIcon />}
        onClick={toggle}
      >
        {adjusting ? 'Save Size' : 'Set Size'}
      </Button>
    </Box>
  );
}

export default function Settings() {
  const { settings, saveSettings, setView } = useApp();
  const [draft, setDraft] = useState(settings);

  useEffect(() => setDraft(settings), [settings]);

  const save = async () => {
    await saveSettings(draft);
    setView('role');
  };

  const updateSize = (preset, size) => {
    setDraft(d => ({ ...d, sizes: { ...d.sizes, [preset]: size } }));
  };

  return (
    <>
      <TitleBar title="Settings">
        <IconButton size="small" onClick={() => setView('role')}><ArrowBackIcon fontSize="small" /></IconButton>
      </TitleBar>

      <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
        <Grid container spacing={3}>
          {/* Hotkeys — split into two sub-columns on md+ */}
          <Grid item xs={12} md={7} xl={8}>
            <Paper variant="outlined" sx={{ p: 2.5 }}>
              <Typography variant="h6" gutterBottom>Hotkeys</Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                Click a field and press the key combination.
              </Typography>
              <Grid container spacing={1}>
                {HOTKEYS.map(([key, label]) => (
                  <Grid item xs={12} lg={6} key={key}>
                    <HotkeyField
                      label={label}
                      value={draft.hotkeys[key] || ''}
                      onChange={v => setDraft(d => ({ ...d, hotkeys: { ...d.hotkeys, [key]: v } }))}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Right column: Window Sizes + Webpage List */}
          <Grid item xs={12} md={5} xl={4}>
            <Paper variant="outlined" sx={{ p: 2.5, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Window Sizes</Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                Click "Set Size" to enable resize, drag the window to desired size, then click "Save Size".
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <SizeRow
                  label="Mobile"
                  size={draft.sizes?.mobile || { w: 420, h: 780 }}
                  onSet={(s) => updateSize('mobile', s)}
                />
                <SizeRow
                  label="Tablet"
                  size={draft.sizes?.tablet || { w: 900, h: 700 }}
                  onSet={(s) => updateSize('tablet', s)}
                />
              </Box>
            </Paper>

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
