import { useState } from 'react';
import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { useApp } from '../../context/AppContext';
import FileUpload from './FileUpload';
import StickyEditor from './StickyEditor';

const INTERVIEW_TYPES = [
  { value: 'technical', label: 'Technical' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'system-design', label: 'System Design' },
  { value: 'general', label: 'General' }
];

export default function InterviewerTab() {
  const { setView, setRole } = useApp();
  const [port, setPort] = useState(5000);
  const [type, setType] = useState('technical');
  const [status, setStatus] = useState('');

  const start = async () => {
    setRole('interviewer');
    setView('interviewer');
    try {
      await window.api.startServer(port);
    } catch (e) {
      setStatus('Server error: ' + e);
    }
  };

  return (
    <Stack spacing={2.5}>
      <TextField
        label="Port"
        type="number"
        value={port}
        onChange={e => setPort(+e.target.value || 5000)}
        fullWidth
      />

      <TextField
        select
        label="Interview Type"
        value={type}
        onChange={e => setType(e.target.value)}
        fullWidth
      >
        {INTERVIEW_TYPES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
      </TextField>

      <FileUpload />
      <StickyEditor />

      <Button variant="contained" size="large" onClick={start} fullWidth>
        Start Interviewer
      </Button>

      {status && <div>{status}</div>}
    </Stack>
  );
}
