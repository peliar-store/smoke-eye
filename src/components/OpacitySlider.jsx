import { useEffect, useRef, useState } from 'react';
import { Box, Tooltip } from '@mui/material';
import OpacityIcon from '@mui/icons-material/Opacity';

const STORAGE_KEY = 'opacity';

function loadOpacity() {
  try {
    const v = parseFloat(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 1;
  } catch { return 1; }
}

export default function OpacitySlider() {
  const [value, setValue] = useState(loadOpacity);
  const trackRef = useRef(null);

  useEffect(() => {
    window.api.winOpacity(value);
  }, []);

  const onMove = (e) => {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const v = ratio;
    setValue(v);
    localStorage.setItem(STORAGE_KEY, v);
    window.api.winOpacity(v);
  };

  return (
    <Tooltip title={`Opacity ${Math.round(value * 100)}%`} placement="bottom">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 0.5 }}>
        <OpacityIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
        <Box
          ref={trackRef}
          onMouseMove={onMove}
          sx={{
            width: 70, height: 16, display: 'flex', alignItems: 'center',
            cursor: 'ew-resize', position: 'relative'
          }}
        >
          <Box sx={{ width: '100%', height: 3, bgcolor: 'action.disabled', borderRadius: 2 }} />
          <Box
            sx={{
              position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
              height: 3, bgcolor: 'primary.main', borderRadius: 2,
              width: `${value * 100}%`
            }}
          />
          <Box
            sx={{
              position: 'absolute', top: '50%',
              left: `${value * 100}%`,
              transform: 'translate(-50%,-50%)',
              width: 10, height: 10, borderRadius: '50%',
              bgcolor: 'primary.main', pointerEvents: 'none'
            }}
          />
        </Box>
      </Box>
    </Tooltip>
  );
}
