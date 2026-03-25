import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3b82f6' },
    secondary: { main: '#f59e0b' },
    background: { default: '#121212', paper: '#1e1e1e' }
  },
  shape: { borderRadius: 10 },
  typography: {
    fontSize: 13,
    button: { textTransform: 'none', fontWeight: 500 }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body, #root': {
          height: '100%', margin: 0, overflow: 'hidden', userSelect: 'none'
        },
        '::-webkit-scrollbar': { width: 6, height: 6 },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': { background: '#52525b', borderRadius: 3 },
        '::-webkit-scrollbar-thumb:hover': { background: '#71717a' },
        '*': { scrollbarWidth: 'thin', scrollbarColor: '#52525b transparent' },
        mark: { background: '#fbbf24', color: '#000', padding: '0 2px', borderRadius: 2 },
        webview: { display: 'flex', flex: 1 }
      }
    },
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiTextField: { defaultProps: { size: 'small', variant: 'outlined' } }
  }
});

export default theme;
