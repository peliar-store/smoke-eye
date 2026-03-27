import { useState } from 'react';
import { Box, Button, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useApp } from '../../context/AppContext';
import FileUpload from './FileUpload';
import StickyEditor from './StickyEditor';

const INTERVIEW_TYPES = [
  { value: 'technical', label: 'Technical' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'system-design', label: 'System Design' },
  { value: 'general', label: 'General' }
];

function Section({ title, children }) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, height: '100%' }}>
      <Typography
        variant="subtitle2"
        fontWeight={600}
        color="text.secondary"
        sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11 }}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

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
    <Grid container spacing={{ xs: 2, sm: 2.5 }}>
      {/* Connection / setup — full width on mobile, left column on md+ */}
      <Grid item xs={12} md={4}>
        <Section title="Session Setup">
          <Stack spacing={2}>
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
              {INTERVIEW_TYPES.map(t => (
                <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </Section>
      </Grid>

      {/* Files — stacks on mobile, middle column on md+ */}
      <Grid item xs={12} sm={6} md={4}>
        <Section title="Context Files">
          <FileUpload />
        </Section>
      </Grid>

      {/* Sticky notes — stacks on mobile, right column on md+ */}
      <Grid item xs={12} sm={6} md={4}>
        <Section title="Sticky Notes">
          <StickyEditor />
        </Section>
      </Grid>

      {/* Action row */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={start}
            sx={{ width: { xs: '100%', sm: 280 } }}
          >
            Start Interviewer
          </Button>
          {status && (
            <Typography variant="caption" color="error">{status}</Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
