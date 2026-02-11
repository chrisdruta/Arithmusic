import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import { useComposition } from '../../context/CompositionContext';

const buttonSx = { backgroundColor: '#f5f5f5', fontWeight: 500 };

export default function EditorControls() {
  const { dispatch } = useComposition();

  return (
    <div className="EditorOptions">
      <Button variant="contained" size="medium" sx={buttonSx} onClick={() => dispatch({ type: 'ADD_TRACK' })}>
        Track&nbsp;<AddIcon />
      </Button>
      <div style={{ flexGrow: 1 }} />
      <Button
        variant="contained"
        size="medium"
        sx={{ ...buttonSx, marginRight: '10px' }}
        onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'load' })}
      >
        Load&nbsp;<UploadIcon />
      </Button>
      <Button variant="contained" size="medium" sx={buttonSx} onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'save' })}>
        Save&nbsp;<SaveIcon />
      </Button>
    </div>
  );
}
