import { Box, Collapse, Paper, Typography } from '@mui/material';

export default function Panel({ title, id, focus, onFocus, children }) {
  const active = focus === id;

  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex', flexDirection: 'column',
        flex: active ? 1 : '0 0 auto',
        minHeight: 0, overflow: 'hidden',
        transition: 'flex .2s'
      }}
    >
      <Box
        onClick={() => onFocus(id)}
        sx={{
          px: 1.5, py: 1,
          bgcolor: active ? 'primary.dark' : 'action.hover',
          cursor: 'pointer', userSelect: 'none',
          '&:hover': { bgcolor: active ? 'primary.dark' : 'action.selected' }
        }}
      >
        <Typography variant="subtitle2" fontWeight={600}>{title}</Typography>
      </Box>
      <Collapse in={active} sx={{ flex: 1, minHeight: 0, '& .MuiCollapse-wrapper': { height: '100%' }, '& .MuiCollapse-wrapperInner': { height: '100%', display: 'flex', flexDirection: 'column' } }}>
        {children}
      </Collapse>
    </Paper>
  );
}
