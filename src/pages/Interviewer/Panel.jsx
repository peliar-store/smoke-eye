import { Box, Paper, Typography } from '@mui/material';

/**
 * mode: 'main' | 'side' | 'collapsed'
 */
export default function Panel({ title, mode, onSelect, children }) {
  const isMain = mode === 'main';
  const showBody = mode !== 'collapsed';

  return (
    <Paper
      variant="outlined"
      onClick={!isMain ? onSelect : undefined}
      sx={{
        flex: 1,
        display: 'flex', flexDirection: 'column',
        minHeight: 0, minWidth: 0, overflow: 'hidden',
        cursor: isMain ? 'default' : 'pointer',
        ...(!isMain && { '&:hover': { borderColor: 'primary.main' } })
      }}
    >
      <Box
        sx={{
          px: 1.5, py: 1,
          bgcolor: isMain ? 'primary.dark' : 'action.hover',
          userSelect: 'none', flexShrink: 0
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} noWrap>{title}</Typography>
      </Box>

      <Box
        sx={{
          flex: 1, minHeight: 0,
          display: showBody ? 'flex' : 'none',
          flexDirection: 'column',
          pointerEvents: mode === 'side' ? 'none' : 'auto'
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}
