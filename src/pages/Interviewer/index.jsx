import { Badge, Box, IconButton, Snackbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PushPinIcon from '@mui/icons-material/PushPin';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ChatIcon from '@mui/icons-material/Chat';
import TitleBar from '../../components/TitleBar';
import StatusChip from '../../components/StatusChip';
import Panel from './Panel';
import CaptionPanel from './CaptionPanel';
import WebPanel from './WebPanel';
import ChatPanel from './ChatPanel';
import { useApp } from '../../context/AppContext';
import { sanitizeHtml } from '../../utils/sanitize';

export default function Interviewer() {
  const { setView, connected, focus, setFocus, toast, setToast, badge, showStickyAt, doCapture, currentStickyIdx } = useApp();

  return (
    <>
      <TitleBar title="Interviewer">
        <IconButton size="small" onClick={() => setView('role')}><ArrowBackIcon fontSize="small" /></IconButton>
        <IconButton size="small" onClick={() => showStickyAt(currentStickyIdx.current)} title="Show sticky">
          <PushPinIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={doCapture} title="Capture screen area">
          <ContentCutIcon fontSize="small" />
        </IconButton>
        <StatusChip connected={connected} onText="Support connected" offText="Listening…" />
        {badge && <Badge color="secondary" variant="dot"><ChatIcon fontSize="small" /></Badge>}
      </TitleBar>

      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 1, p: 1 }}>
        <Panel title="Interview Caption" id="caption" focus={focus} onFocus={setFocus}>
          <CaptionPanel />
        </Panel>
        <Panel title="Web Viewer" id="web" focus={focus} onFocus={setFocus}>
          <WebPanel />
        </Panel>
        <Panel title="Support Chat" id="chat" focus={focus} onFocus={setFocus}>
          <ChatPanel />
        </Panel>
      </Box>

      <Snackbar
        open={!!toast}
        autoHideDuration={5000}
        onClose={() => setToast(null)}
        onClick={() => { setToast(null); setFocus('chat'); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message={
          toast && (
            <Box sx={{ cursor: 'pointer', maxWidth: 280 }}>
              <Box sx={{ fontSize: 11, color: 'secondary.main', fontWeight: 600, mb: 0.5 }}>
                💬 Support says
              </Box>
              {toast.html?.startsWith('data:image')
                ? <img src={toast.html} style={{ maxWidth: '100%', borderRadius: 4 }} />
                : <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(toast.html || toast.text) }} />
              }
            </Box>
          )
        }
      />
    </>
  );
}
