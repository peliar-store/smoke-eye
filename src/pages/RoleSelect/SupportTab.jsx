import { useState } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';
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

  return (
    <Stack spacing={2.5}>
      <TextField
        label="Interviewer IP"
        value={host}
        onChange={e => setHost(e.target.value)}
        fullWidth
      />
      <TextField
        label="Port"
        type="number"
        value={port}
        onChange={e => setPort(+e.target.value || 5000)}
        fullWidth
      />

      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          color={connected ? 'error' : 'success'}
          onClick={toggle}
          fullWidth
        >
          {connected ? 'Disconnect' : 'Connect'}
        </Button>
        <Button
          variant="contained"
          disabled={!connected}
          onClick={() => setView('support')}
          fullWidth
        >
          Start
        </Button>
      </Stack>

      <Typography variant="caption" align="center" color="text.secondary">
        {status}
      </Typography>
    </Stack>
  );
}
