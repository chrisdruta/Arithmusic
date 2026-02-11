import { IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditorOutput from './editor-output';
import { useComposition } from '../../context/CompositionContext';

export default function EditorPanel() {
  const { state, dispatch } = useComposition();
  const { row, col } = state.selectedSegment;
  const segment = state.timelines[row]?.segments[col];
  if (!segment) return null;

  const { title, expression, length, volume } = segment;

  return (
    <div className="EditorPanel">
      <TextField
        label="Title"
        value={title.value}
        error={!!title.error}
        helperText={title.error}
        onChange={(e) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'title', value: e.target.value })}
        margin="normal"
        sx={{ width: 100 }}
      />
      <TextField
        label="Equation f(x)"
        value={expression.value}
        error={!!expression.error}
        helperText={expression.error ? 'See output' : ''}
        onChange={(e) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'expression', value: e.target.value })}
        margin="normal"
        sx={{ width: '25%' }}
      />
      <TextField
        label="Length (ms)"
        value={length.value}
        error={!!length.error}
        helperText={length.error}
        onChange={(e) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'length', value: e.target.value })}
        margin="normal"
        sx={{ width: 100 }}
      />
      <TextField
        label="Volume (%)"
        value={volume.value}
        error={!!volume.error}
        helperText={volume.error}
        onChange={(e) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'volume', value: e.target.value })}
        margin="normal"
        sx={{ width: 90 }}
      />
      <EditorOutput
        output={expression.error ? expression.error : expression.value}
        error={!!expression.error}
      />
      <IconButton onClick={() => dispatch({ type: 'DELETE_SEGMENT' })}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
}
