import { Box, Button, FormControlLabel, Link, Modal, Switch, TextField, Typography } from '@mui/material';
import { modalStyle } from '../modals';
import { useComposition } from '../../context/CompositionContext';

export default function SettingsModal() {
  const { state, dispatch } = useComposition();
  const { fs, volume, multiplier, graphRange, aliasing } = state.settings;

  return (
    <Modal open={state.showingModals.settings}>
      <Box sx={modalStyle}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div className="settingsColumn">
            <Typography variant="h5">Settings</Typography>
            <TextField
              label="Master volume (%)"
              value={volume.value}
              error={!!volume.error}
              helperText={volume.error}
              onChange={(e) => dispatch({ type: 'SETTINGS_CHANGE', field: 'volume', value: e.target.value })}
              margin="normal"
              sx={{ width: 139 }}
            />
            <TextField
              label="Auto multipler for function input (x)"
              value={multiplier.value}
              error={!!multiplier.error}
              helperText={multiplier.error}
              onChange={(e) => dispatch({ type: 'SETTINGS_CHANGE', field: 'multiplier', value: e.target.value })}
              margin="normal"
              sx={{ width: 250 }}
            />
            <TextField
              label="Upper graph range (Hz)"
              value={graphRange.value}
              error={!!graphRange.error}
              helperText={graphRange.error}
              onChange={(e) => dispatch({ type: 'SETTINGS_CHANGE', field: 'graphRange', value: e.target.value })}
              margin="normal"
              sx={{ width: 173 }}
            />
            <TextField
              label="Sampling frequency (Hz)"
              value={fs.value}
              error={!!fs.error}
              helperText={fs.error}
              onChange={(e) => dispatch({ type: 'SETTINGS_CHANGE', field: 'fs', value: e.target.value })}
              margin="normal"
              sx={{ width: 180 }}
            />
            <FormControlLabel
              sx={{ alignSelf: 'flex-start', marginLeft: 0, marginTop: '15px' }}
              control={<Switch checked={aliasing} onChange={() => dispatch({ type: 'SETTINGS_CHANGE', field: 'aliasing' })} />}
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
          <Button variant="contained" sx={{ marginRight: '10px' }} onClick={() => dispatch({ type: 'RESET_SETTINGS' })}>
            Defaults
          </Button>
          <Button variant="contained" onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'settings' })}>
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
