import { useEffect, useRef, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import ChatLog from '../../components/ChatLog';
import { useApp } from '../../context/AppContext';

export default function ChatPanel() {
  const { messages, sendMsg, focus } = useApp();
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (focus === 'chat') setTimeout(() => inputRef.current?.focus(), 50);
  }, [focus]);

  const send = () => {
    if (!input.trim()) return;
    sendMsg(input);
    setInput('');
  };

  return (
    <>
      <ChatLog messages={messages} role="interviewer" />
      <Box sx={{ display: 'flex', gap: 1, p: 1, borderTop: 1, borderColor: 'divider' }}>
        <TextField
          inputRef={inputRef}
          placeholder="Type a message…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          fullWidth
        />
        <Button variant="contained" onClick={send}>Send</Button>
      </Box>
    </>
  );
}
