import { IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditorOutput from './editor-output';
import type { SelectedSegment, Timeline, ValidatedField } from '../../types';

interface EditorPanelProps {
  title: ValidatedField;
  expression: ValidatedField;
  length: ValidatedField<number>;
  volume: ValidatedField<number>;
  onTrackDataChange: (col: number, row: number, field: 'title' | 'expression' | 'length' | 'volume', value: string) => void;
  onDeleteSegment: () => void;
  timelines: Timeline[];
  selectedSegment: SelectedSegment;
}

export default function EditorPanel({
  title,
  expression,
  length,
  volume,
  onTrackDataChange,
  onDeleteSegment,
  selectedSegment,
}: EditorPanelProps) {
  const i = selectedSegment.col;
  const j = selectedSegment.row;

  return (
    <div className="EditorPanel">
      <TextField
        label="Title"
        value={title.value}
        error={!!title.error}
        helperText={title.error}
        onChange={(e) => onTrackDataChange(i, j, 'title', e.target.value)}
        margin="normal"
        sx={{ width: 100 }}
      />
      <TextField
        label="Equation f(x)"
        value={expression.value}
        error={!!expression.error}
        helperText={expression.error ? 'See output' : ''}
        onChange={(e) => onTrackDataChange(i, j, 'expression', e.target.value)}
        margin="normal"
        sx={{ width: '25%' }}
      />
      <TextField
        label="Length (ms)"
        value={length.value}
        error={!!length.error}
        helperText={length.error}
        onChange={(e) => onTrackDataChange(i, j, 'length', e.target.value)}
        margin="normal"
        sx={{ width: 100 }}
      />
      <TextField
        label="Volume (%)"
        value={volume.value}
        error={!!volume.error}
        helperText={volume.error}
        onChange={(e) => onTrackDataChange(i, j, 'volume', e.target.value)}
        margin="normal"
        sx={{ width: 90 }}
      />
      <EditorOutput
        output={expression.error ? expression.error : expression.value}
        error={!!expression.error}
      />
      <IconButton onClick={onDeleteSegment}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
}
