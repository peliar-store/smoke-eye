import { useMemo, useRef, useState } from 'react';
import { Box, Button, MenuItem, Stack, TextField } from '@mui/material';
import { useApp } from '../../context/AppContext';

const MANUAL = '__manual__';

export default function WebPanel() {
  const { settings } = useApp();
  const pages = useMemo(() => settings.webpages || [], [settings.webpages]);

  const [active, setActive] = useState(pages[0] || MANUAL);
  const [manualUrl, setManualUrl] = useState('https://example.com');
  const manualRef = useRef(null);

  const goManual = () => {
    const u = manualUrl.trim();
    if (!u) return;
    setActive(MANUAL);
    if (manualRef.current) manualRef.current.src = u;
  };

  const switchTo = (url) => {
    setActive(url);
    setManualUrl(url);
  };

  return (
    <>
      <Stack direction="row" spacing={0.5} sx={{ p: 1, borderBottom: 1, borderColor: 'divider', flexWrap: 'wrap' }}>
        <TextField
          select
          value={pages.includes(active) ? active : ''}
          onChange={e => switchTo(e.target.value)}
          sx={{ width: 140 }}
          SelectProps={{ displayEmpty: true }}
        >
          <MenuItem value="" disabled>— pages —</MenuItem>
          {pages.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
        </TextField>
        <TextField
          value={manualUrl}
          onChange={e => setManualUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && goManual()}
          sx={{ flex: 1, minWidth: 120 }}
        />
        <Button variant="contained" onClick={goManual}>Go</Button>
      </Stack>

      <Box sx={{ flex: 1, position: 'relative', minHeight: 0 }}>
        {pages.map(url => (
          <webview
            key={url}
            src={url}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              visibility: active === url ? 'visible' : 'hidden'
            }}
          />
        ))}
        <webview
          ref={manualRef}
          src="about:blank"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            visibility: active === MANUAL ? 'visible' : 'hidden'
          }}
        />
      </Box>
    </>
  );
}
