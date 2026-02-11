import { Button, InputBase, ToggleButton, ToggleButtonGroup, SvgIcon } from '@mui/material';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import RemoveIcon from '@mui/icons-material/Remove';
import { mdiSineWave, mdiTriangleWave, mdiSawtoothWave } from '@mdi/js';
import { useComposition } from '../../context/CompositionContext';

function MdiIcon({ path }: { path: string }) {
  return (
    <SvgIcon>
      <path d={path} />
    </SvgIcon>
  );
}

export default function TrackOptions({ rowIndex }: { rowIndex: number }) {
  const { state, dispatch } = useComposition();
  const options = state.timelines[rowIndex].options;

  return (
    <div className="TrackControl">
      {rowIndex !== 0 ? (
        <Button
          variant="contained"
          size="medium"
          onClick={() => dispatch({ type: 'DELETE_TRACK', rowIndex })}
          sx={{ marginRight: '10px', backgroundColor: '#f5f5f5', fontWeight: 500 }}
        >
          Track&nbsp;
          <RemoveIcon />
        </Button>
      ) : (
        <div style={{ width: 120 }} />
      )}
      <InputBase
        value={options.title}
        className="trackTitle"
        inputProps={{
          style: {
            fontSize: 16,
            padding: '6px 3px 5px',
            backgroundColor: '#f5f5f5',
          },
        }}
        onChange={(e) => dispatch({ type: 'TRACK_OPTION_CHANGE', index: rowIndex, field: 'title', value: e.target.value })}
      />
      <ToggleButtonGroup
        size="small"
        exclusive
        value={options.wave}
        onChange={(_e, val) => dispatch({ type: 'TRACK_OPTION_CHANGE', index: rowIndex, field: 'wave', value: val })}
      >
        <ToggleButton size="small" value="sine">
          <MdiIcon path={mdiSineWave} />
        </ToggleButton>
        <ToggleButton size="small" value="triangle">
          <MdiIcon path={mdiTriangleWave} />
        </ToggleButton>
        <ToggleButton size="small" value="saw">
          <MdiIcon path={mdiSawtoothWave} />
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup size="small" sx={{ marginLeft: '10px' }}>
        <ToggleButton
          size="small"
          selected={options.mute}
          value="mute"
          onClick={() => dispatch({ type: 'TRACK_OPTION_CHANGE', index: rowIndex, field: 'mute', value: '' })}
        >
          <VolumeOffIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
