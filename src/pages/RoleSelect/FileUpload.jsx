import { useState } from 'react';
import { Button, Chip, IconButton, List, ListItem, MenuItem, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useApp } from '../../context/AppContext';

const FILE_TYPES = {
  cv: 'CV', 'job-description': 'JD', 'support-material': 'Material', other: 'Other'
};

export default function FileUpload() {
  const { uploadedFiles, setUploadedFiles } = useApp();
  const [type, setType] = useState('cv');

  const addFiles = async () => {
    const paths = await window.api.openFileDialog();
    if (paths?.length) {
      setUploadedFiles(f => [
        ...f,
        ...paths.map(p => ({ path: p, name: p.split(/[/\\]/).pop(), type }))
      ]);
    }
  };

  const remove = (idx) => setUploadedFiles(f => f.filter((_, i) => i !== idx));

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1}>
        <TextField
          select
          value={type}
          onChange={e => setType(e.target.value)}
          sx={{ minWidth: 110 }}
        >
          {Object.entries(FILE_TYPES).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
        </TextField>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={addFiles} fullWidth>
          Add
        </Button>
      </Stack>

      {uploadedFiles.length > 0 ? (
        <List dense disablePadding sx={{ maxHeight: 160, overflow: 'auto' }}>
          {uploadedFiles.map((f, i) => (
            <ListItem
              key={i}
              sx={{ bgcolor: 'action.hover', borderRadius: 1, mb: 0.5, pr: 6 }}
              secondaryAction={
                <IconButton edge="end" size="small" onClick={() => remove(i)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
            >
              <Chip label={FILE_TYPES[f.type]} size="small" color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2" noWrap title={f.path}>{f.name}</Typography>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="caption" color="text.disabled" align="center" sx={{ py: 1 }}>
          No files added
        </Typography>
      )}
    </Stack>
  );
}
