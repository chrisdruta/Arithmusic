import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';

interface EditorControlsProps {
  onAddTrack: () => void;
  toggleModal: (kind: 'load' | 'save') => void;
}

const buttonSx = { backgroundColor: '#f5f5f5', fontWeight: 500 };

export default function EditorControls({ onAddTrack, toggleModal }: EditorControlsProps) {
  return (
    <div className="EditorOptions">
      <Button variant="contained" size="medium" sx={buttonSx} onClick={onAddTrack}>
        Track&nbsp;<AddIcon />
      </Button>
      <div style={{ flexGrow: 1 }} />
      <Button
        variant="contained"
        size="medium"
        sx={{ ...buttonSx, marginRight: '10px' }}
        onClick={() => toggleModal('load')}
      >
        Load&nbsp;<UploadIcon />
      </Button>
      <Button variant="contained" size="medium" sx={buttonSx} onClick={() => toggleModal('save')}>
        Save&nbsp;<SaveIcon />
      </Button>
    </div>
  );
}
