import { Box } from '@mui/material';
import { useApp } from './context/AppContext';
import RoleSelect from './pages/RoleSelect';
import Interviewer from './pages/Interviewer';
import Support from './pages/Support';
import Settings from './pages/Settings';

export default function App() {
  const { view } = useApp();

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {view === 'role' && <RoleSelect />}
      {view === 'interviewer' && <Interviewer />}
      {view === 'support' && <Support />}
      {view === 'settings' && <Settings />}
    </Box>
  );
}
