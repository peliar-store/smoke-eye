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

      <Box sx={{ flex: 1, overflow: 'auto', py: { xs: 2, sm: 3 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h5"
            align="center"
            fontWeight={300}
            sx={{ mb: { xs: 1.5, sm: 2 } }}
          >
            Interview Support
          </Typography>

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            centered
            sx={{
              mb: { xs: 2, sm: 3 },
              '& .MuiTab-root': { minWidth: { xs: 120, sm: 160 } }
            }}
          >
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
