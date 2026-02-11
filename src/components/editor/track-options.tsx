import { Button, InputBase, ToggleButton, ToggleButtonGroup, SvgIcon } from '@mui/material';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import RemoveIcon from '@mui/icons-material/Remove';
import { mdiSineWave, mdiTriangleWave, mdiSawtoothWave } from '@mdi/js';
import type { TimelineOptions } from '../../types';

function MdiIcon({ path }: { path: string }) {
  return (
    <SvgIcon>
      <path d={path} />
    </SvgIcon>
  );
}

interface TrackOptionsProps {
  options: TimelineOptions;
  rowIndex: number;
  onTrackOptionChange: (index: number, field: string, value: TimelineOptions['wave'] | string | null) => void;
  onDeleteTrack: (rowIndex: number) => void;
}

export default function TrackOptions({
  options,
  rowIndex,
  onTrackOptionChange,
  onDeleteTrack,
}: TrackOptionsProps) {
  return (
    <div className="TrackControl">
      {rowIndex !== 0 ? (
        <Button
          variant="contained"
          size="medium"
          onClick={() => onDeleteTrack(rowIndex)}
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
        onChange={(e) => onTrackOptionChange(rowIndex, 'title', e.target.value)}
      />
      <ToggleButtonGroup
        size="small"
        exclusive
        value={options.wave}
        onChange={(_e, val) => onTrackOptionChange(rowIndex, 'wave', val)}
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
          onClick={() => onTrackOptionChange(rowIndex, 'mute', '')}
        >
          <VolumeOffIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
