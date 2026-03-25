import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Slider, Tooltip, Typography } from '@mui/material';
import MinimizeIcon from '@mui/icons-material/Minimize';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import CloseIcon from '@mui/icons-material/Close';
import OpacityIcon from '@mui/icons-material/Opacity';
import ShieldIcon from '@mui/icons-material/Shield';
import OpacitySlider from './OpacitySlider';

const drag = { WebkitAppRegion: 'drag' };
const noDrag = { WebkitAppRegion: 'no-drag' };

export default function TitleBar({ title = 'Interview Support', children }) {
  const [maximized, setMaximized] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const trackRef = useRef(null);

  useEffect(() => {
    window.api.winIsMaximized().then(setMaximized);
    window.api.onWinState((s) => setMaximized(s.maximized));
  }, []);

  return (
    <Box
      sx={{
        ...drag,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        pl: 1.5,
        flexShrink: 0
      }}
    >
      <Typography variant="body2" fontWeight={600} sx={{ mr: 2 }}>
        {title}
      </Typography>

      <Box sx={{ ...noDrag, display: 'flex', gap: 0.5, alignItems: 'center' }}>
        {children}
      </Box>

      <Box sx={{ flex: 1 }} />

      <Box sx={{ ...noDrag, display: 'flex', alignItems: 'center' }}>
        <OpacitySlider />
      </Box>

      <Tooltip title="Shield">
        <IconButton size="small" sx={{ ...noDrag, mr: 0.5 }}>
          <ShieldIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>

      <Box sx={{ ...noDrag, display: 'flex' }}>
        <WinBtn onClick={() => window.api.winCtrl('minimize')}>
          <MinimizeIcon sx={{ fontSize: 16 }} />
        </WinBtn>
        <WinBtn onClick={() => window.api.winCtrl('maximize')}>
          {maximized ? <FilterNoneIcon sx={{ fontSize: 13 }} /> : <CropSquareIcon sx={{ fontSize: 15 }} />}
        </WinBtn>
        <WinBtn onClick={() => window.api.winCtrl('close')} danger>
          <CloseIcon sx={{ fontSize: 17 }} />
        </WinBtn>
      </Box>
    </Box>
  );
}

function WinBtn({ children, onClick, danger }) {
  return (
    <IconButton
      onClick={onClick}
      size="small"
      sx={{
        width: 44, height: 36, borderRadius: 0,
        '&:hover': { bgcolor: danger ? 'error.main' : 'action.hover', color: danger ? '#fff' : 'inherit' }
      }}
    >
      {children}
    </IconButton>
  );
}
