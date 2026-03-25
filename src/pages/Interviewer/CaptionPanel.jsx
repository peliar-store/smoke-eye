import { Box, Typography } from '@mui/material';
import { useApp } from '../../context/AppContext';

export default function CaptionPanel() {
  const { captionLines } = useApp();

  return (
    <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
      {captionLines.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          Caption will appear here when audio is detected…
        </Typography>
      ) : (
        captionLines.map((line, i) => (
          <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>{line}</Typography>
        ))
      )}
    </Box>
  );
}
