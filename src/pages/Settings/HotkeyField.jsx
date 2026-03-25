import { useState } from 'react';
import { Box, OutlinedInput, Typography } from '@mui/material';

const KEY_MAP = {
  ArrowUp: 'Up', ArrowDown: 'Down', ArrowLeft: 'Left', ArrowRight: 'Right',
  ' ': 'Space', Escape: 'Esc', '+': 'Plus'
};

function normalize(k) {
  if (KEY_MAP[k]) return KEY_MAP[k];
  if (k.length === 1) return k.toUpperCase();
  return k;
}

export default function HotkeyField({ label, value, onChange }) {
  const [recording, setRecording] = useState(false);

  const onKeyDown = (e) => {
    e.preventDefault();
    if (e.key === 'Escape') { e.target.blur(); return; }
    if (e.key === 'Backspace' || e.key === 'Delete') { onChange(''); return; }
    if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;
    const parts = [];
    if (e.ctrlKey || e.metaKey) parts.push('CommandOrControl');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    parts.push(normalize(e.key));
    onChange(parts.join('+'));
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
      <Typography variant="body2">{label}</Typography>
      <OutlinedInput
        value={value}
        readOnly
        onFocus={() => { setRecording(true); window.api.suspendHotkeys(); }}
        onBlur={() => { setRecording(false); window.api.resumeHotkeys(); }}
        onKeyDown={onKeyDown}
        size="small"
        sx={{
          width: 180, fontFamily: 'monospace', fontSize: 12,
          '& input': { textAlign: 'center', cursor: 'pointer' },
          ...(recording && { boxShadow: '0 0 0 2px rgba(59,130,246,.4)' })
        }}
      />
    </Box>
  );
}
