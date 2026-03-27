import { useState } from 'react';
import { Box, Button, Chip, Paper, Stack, TextField, Typography } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useApp } from '../../context/AppContext';

export default function SupportTab() {
  const { setView, setRole } = useApp();
  const [host, setHost] = useState('127.0.0.1');
  const [port, setPort] = useState(5000);
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState('Disconnected');

  const toggle = async () => {
    if (!connected) {
      if (!host || !port) return;
      try {
        setRole('support');
        await window.api.connect(host, port);
        setConnected(true);
        setStatus('Connected');
      } catch (e) {
        setStatus('Error: ' + e);
      }
    } else {
      await window.api.disconnect();
      setConnected(false);
      setStatus('Disconnected');
    }
  };

  const statusColor = connected ? 'success' : status.startsWith('Error') ? 'error' : 'default';

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto' }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2.5 }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11 }}
          >
            Connect to Interviewer
          </Typography>
          <Chip size="small" label={status} color={statusColor} variant="outlined" />
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 2.5 }}
        >
          <TextField
            label="Interviewer IP"
            value={host}
            onChange={e => setHost(e.target.value)}
            disabled={connected}
            fullWidth
          />
          <TextField
            label="Port"
            type="number"
            value={port}
            onChange={e => setPort(+e.target.value || 5000)}
            disabled={connected}
            sx={{ width: { xs: '100%', sm: 140 } }}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button
            variant={connected ? 'outlined' : 'contained'}
            color={connected ? 'error' : 'success'}
            startIcon={connected ? <LinkOffIcon /> : <LinkIcon />}
            onClick={toggle}
            fullWidth
          >
            {connected ? 'Disconnect' : 'Connect'}
          </Button>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            disabled={!connected}
            onClick={() => setView('support')}
            fullWidth
          >
            Start
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
