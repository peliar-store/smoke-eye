import { Chip } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';

export default function StatusChip({ connected, onText = 'Connected', offText = 'Waiting…' }) {
  return (
    <Chip
      size="small"
      color={connected ? 'success' : 'error'}
      icon={connected ? <LinkIcon /> : <LinkOffIcon />}
      label={connected ? onText : offText}
      sx={{ '& .MuiChip-label': { display: { xs: 'none', sm: 'inline' } } }}
    />
  );
}
