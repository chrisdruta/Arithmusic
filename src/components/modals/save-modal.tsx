import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { modalStyle } from '../modals';
import { useComposition, exportCompositionJson } from '../../context/CompositionContext';

export default function SaveModal() {
  const { state, dispatch } = useComposition();
  const currentComposition = exportCompositionJson(state.timelines);

  return (
    <Modal open={state.showingModals.save}>
      <Box sx={modalStyle}>
        <Typography variant="h5">Save Composition</Typography>
        <br />
        <Typography variant="subtitle1">Copy the text below</Typography>
        <TextField
          label="Output"
          multiline
          rows={7}
          value={currentComposition}
          margin="normal"
          variant="filled"
        />
        <br />
        <Typography variant="subtitle1">or</Typography>
        <Button
          variant="contained"
          download="composition.json"
          target="_blank"
          href={`data:text/json;charset=utf-8,${encodeURIComponent(currentComposition)}`}
          sx={{ maxWidth: 200, alignSelf: 'center' }}
        >
          Save Json
        </Button>
        <br />
        <div className="modalActions">
          <Button variant="contained" onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'save' })}>
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
