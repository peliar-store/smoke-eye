import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TitleBar from '../../components/TitleBar';
import StatusChip from '../../components/StatusChip';
import ChatArea from './ChatArea';
import Sidebar from './Sidebar';
import { useApp } from '../../context/AppContext';

export default function Support() {
  const { setView, connected } = useApp();

  return (
    <>
      <TitleBar title="Support">
        <IconButton size="small" onClick={() => setView('role')}><ArrowBackIcon fontSize="small" /></IconButton>
        <StatusChip connected={connected} onText="Connected" offText="Disconnected" />
      </TitleBar>

      <Box
        sx={{
          flex: 1, minHeight: 0, display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 1, p: 1
        }}
      >
        <ChatArea />
        <Sidebar />
      </Box>
    </>
  );
}
