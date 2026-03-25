import { forwardRef } from 'react';
import { Box } from '@mui/material';

const RichInput = forwardRef(function RichInput({ placeholder, onSend, minHeight = 38, maxHeight = 128 }, ref) {
  return (
    <Box
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onKeyDown={e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend?.(); }
      }}
      sx={{
        flex: 1, minHeight, maxHeight, overflow: 'auto',
        px: 1.5, py: 1,
        bgcolor: 'background.default',
        border: 1, borderColor: 'divider', borderRadius: 1,
        outline: 'none', userSelect: 'text',
        '&:focus': { borderColor: 'primary.main' },
        '&:empty::before': { content: 'attr(data-placeholder)', color: 'text.disabled' },
        '& b, & strong': { fontWeight: 700 }
      }}
    />
  );
});

export default RichInput;
