import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { sanitizeHtml, escapeHtml } from '../utils/sanitize';

export default function ChatLog({ messages, role, onDelete, editable }) {
  return (
    <Box
      sx={{
        flex: 1, overflow: 'auto', p: 1.5,
        display: 'flex', flexDirection: 'column', gap: 1,
        userSelect: editable ? 'text' : 'none'
      }}
    >
      {messages.map(m => {
        const mine = m.from === role;
        return (
          <Box
            key={m.id}
            data-id={m.id}
            className="msg"
            sx={{
              position: 'relative',
              maxWidth: '80%',
              alignSelf: mine ? 'flex-end' : 'flex-start',
              bgcolor: mine ? 'primary.dark' : 'action.selected',
              px: 1.5, py: 1, borderRadius: 2,
              wordBreak: 'break-word', lineHeight: 1.5,
              '&:hover .msg-del': { opacity: 1 }
            }}
          >
            <span
              className="msg-content"
              dangerouslySetInnerHTML={{ __html: m.html ? sanitizeHtml(m.html) : escapeHtml(m.text) }}
            />
            {onDelete && (
              <IconButton
                className="msg-del"
                size="small"
                onClick={() => onDelete(m.id)}
                sx={{
                  position: 'absolute', top: -8, right: -8,
                  width: 20, height: 20, bgcolor: 'error.main',
                  opacity: 0, transition: 'opacity .15s',
                  '&:hover': { bgcolor: 'error.dark' }
                }}
              >
                <CloseIcon sx={{ fontSize: 12 }} />
              </IconButton>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
