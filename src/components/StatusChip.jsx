import { Chip } from '@mui/material';

export default function StatusChip({ connected, onText = 'Connected', offText = 'Waiting…' }) {
  return (
    <Chip
      size="small"
      color={connected ? 'success' : 'error'}
      // icon={connected ? <LinkIcon /> : <LinkOffIcon />}
      label={connected ? onText : offText}
      sx={{ '& .MuiChip-label': { display: { xs: 'none', sm: 'inline' } } }}
      style={{height: "10px", width: "10px"}}
    />
  );
}
