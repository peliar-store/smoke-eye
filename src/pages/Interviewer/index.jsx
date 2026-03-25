import { Badge, Box, IconButton, Snackbar, useMediaQuery } from '@mui/material';
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

const PANELS = [
  { id: 'caption', title: 'Interview Caption', Body: CaptionPanel },
  { id: 'web',     title: 'Web Viewer',        Body: WebPanel },
  { id: 'chat',    title: 'Support Chat',      Body: ChatPanel }
];

export default function Interviewer() {
  const { setView, connected, focus, setFocus, toast, setToast, badge, showStickyAt, doCapture, currentStickyIdx } = useApp();
  const isTablet = useMediaQuery('(min-width:900px)');

  // Grid areas: active panel = 'm', others = 'a'/'b' in original order
  let sideIdx = 0;
  const areaMap = {};
  PANELS.forEach(p => {
    areaMap[p.id] = p.id === focus ? 'm' : (sideIdx++ === 0 ? 'a' : 'b');
  });

  const gridSx = isTablet
    ? {
        gridTemplateColumns: '1fr 280px',
        gridTemplateRows: '1fr 1fr',
        gridTemplateAreas: '"m a" "m b"'
      }
    : {
        gridTemplateColumns: '1fr',
        gridTemplateRows: PANELS.map(p => p.id === focus ? '1fr' : 'auto').join(' '),
        gridTemplateAreas: PANELS.map(p => `"${areaMap[p.id]}"`).join(' ')
      };

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
        <StatusChip connected={connected} onText="" offText="" />
        {badge && <Badge color="secondary" variant="dot"><ChatIcon fontSize="small" /></Badge>}
      </TitleBar>

      <Box sx={{ flex: 1, minHeight: 0, display: 'grid', gap: 1, p: 1, ...gridSx }}>
        {PANELS.map(p => {
          const isMain = p.id === focus;
          const mode = isMain ? 'main' : isTablet ? 'side' : 'collapsed';
          return (
            <Box key={p.id} sx={{ gridArea: areaMap[p.id], minHeight: 0, display: 'flex' }}>
              <Panel title={p.title} mode={mode} onSelect={() => setFocus(p.id)}>
                <p.Body />
              </Panel>
            </Box>
          );
        })}
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
