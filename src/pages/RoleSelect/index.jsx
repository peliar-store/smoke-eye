import { useState } from 'react';
import { Box, Container, IconButton, Tab, Tabs, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import TitleBar from '../../components/TitleBar';
import InterviewerTab from './InterviewerTab';
import SupportTab from './SupportTab';
import { useApp } from '../../context/AppContext';

export default function RoleSelect() {
  const { setView } = useApp();
  const [tab, setTab] = useState(0);

  return (
    <>
      <TitleBar>
        <IconButton size="small" onClick={() => setView('settings')}>
          <SettingsIcon fontSize="small" />
        </IconButton>
      </TitleBar>

      <Box sx={{ flex: 1, overflow: 'auto', py: 3 }}>
        <Container maxWidth="sm">
          <Typography variant="h5" align="center" fontWeight={300} gutterBottom>
            Interview Support
          </Typography>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth" sx={{ mb: 3 }}>
            <Tab label="Interviewer" />
            <Tab label="Support" />
          </Tabs>

          {tab === 0 && <InterviewerTab />}
          {tab === 1 && <SupportTab />}
        </Container>
      </Box>
    </>
  );
}
