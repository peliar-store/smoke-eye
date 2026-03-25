import { useRef, useState } from 'react';
import { Box, Button, MenuItem, Stack, TextField } from '@mui/material';
import { useApp } from '../../context/AppContext';

export default function WebPanel() {
  const { settings } = useApp();
  const [url, setUrl] = useState('https://example.com');
  const wv = useRef(null);

  const go = (u) => {
    const target = u || url;
    if (target && wv.current) wv.current.src = target;
  };

  return (
    <>
      <Stack direction="row" spacing={0.5} sx={{ p: 1, borderBottom: 1, borderColor: 'divider', flexWrap: 'wrap' }}>
        <TextField
          select
          value=""
          onChange={e => { setUrl(e.target.value); go(e.target.value); }}
          sx={{ width: 140 }}
          SelectProps={{ displayEmpty: true }}
        >
          <MenuItem value="" disabled>— pages —</MenuItem>
          {settings.webpages.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
        </TextField>
        <TextField
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && go()}
          sx={{ flex: 1, minWidth: 120 }}
        />
        <Button variant="contained" onClick={() => go()}>Go</Button>
      </Stack>
      <Box sx={{ flex: 1, display: 'flex' }}>
        <webview ref={wv} src="https://example.com" style={{ flex: 1, width: '100%' }} />
      </Box>
    </>
  );
}
