import { Box, Button, FormControlLabel, Link, Modal, Switch, TextField, Typography } from '@mui/material';
import { modalStyle } from '../modals';
import type { Settings } from '../../types';

interface SettingsModalProps {
  open: boolean;
  settings: Settings;
  toggleModal: (kind: 'settings') => void;
  onChange: (field: string, value?: string) => void;
  resetSettings: () => void;
}

export default function SettingsModal({
  open,
  settings,
  toggleModal,
  onChange,
  resetSettings,
}: SettingsModalProps) {
  const { fs, volume, multiplier, graphRange, aliasing } = settings;

  return (
    <Modal open={open}>
      <Box sx={modalStyle}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div className="settingsColumn">
            <Typography variant="h5">Settings</Typography>
            <TextField
              label="Master volume (%)"
              value={volume.value}
              error={!!volume.error}
              helperText={volume.error}
              onChange={(e) => onChange('volume', e.target.value)}
              margin="normal"
              sx={{ width: 139 }}
            />
            <TextField
              label="Auto multipler for function input (x)"
              value={multiplier.value}
              error={!!multiplier.error}
              helperText={multiplier.error}
              onChange={(e) => onChange('multiplier', e.target.value)}
              margin="normal"
              sx={{ width: 250 }}
            />
            <TextField
              label="Upper graph range (Hz)"
              value={graphRange.value}
              error={!!graphRange.error}
              helperText={graphRange.error}
              onChange={(e) => onChange('graphRange', e.target.value)}
              margin="normal"
              sx={{ width: 173 }}
            />
            <TextField
              label="Sampling frequency (Hz)"
              value={fs.value}
              error={!!fs.error}
              helperText={fs.error}
              onChange={(e) => onChange('fs', e.target.value)}
              margin="normal"
              sx={{ width: 180 }}
            />
            <FormControlLabel
              sx={{ alignSelf: 'flex-start', marginLeft: 0, marginTop: '15px' }}
              control={<Switch checked={aliasing} onChange={() => onChange('aliasing')} />}
              label="Enable Aliasing"
              labelPlacement="start"
            />
          </div>
          <div className="aboutBorder">
            <Typography variant="h6" sx={{ alignSelf: 'center' }}>
              About Arithmusic
            </Typography>
            <Typography>
              Version: 2.0.0
              <br />
              <Link href="https://github.com/chrisdruta/arithmusic" target="_blank">
                github.com/chrisdruta/arithmusic
              </Link>
              <br />
              GPL v3.0
            </Typography>
            <Typography>
              Made with <span role="img" style={{ fontSize: 20 }} aria-label="heart">&#10084;&#65039;</span>,
              <br />
              Chris Druta
            </Typography>
          </div>
        </div>

        <br />
        <div className="modalActions">
          <Button variant="contained" sx={{ marginRight: '10px' }} onClick={resetSettings}>
            Defaults
          </Button>
          <Button variant="contained" onClick={() => toggleModal('settings')}>
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
