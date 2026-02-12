import { Minus, VolumeX } from 'lucide-react';
import { mdiSineWave, mdiTriangleWave, mdiSawtoothWave } from '@mdi/js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useComposition } from '../../context/CompositionContext';

function MdiIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current">
      <path d={path} />
    </svg>
  );
}

export default function TrackOptions({ rowIndex }: { rowIndex: number }) {
  const { state, dispatch } = useComposition();
  const options = state.timelines[rowIndex].options;

  return (
    <div className="flex items-center gap-2.5 bg-surface px-2.5 py-1">
      {rowIndex !== 0 ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => dispatch({ type: 'DELETE_TRACK', rowIndex })}
        >
          Track <Minus className="size-4" />
        </Button>
      ) : (
        <div className="w-[100px]" />
      )}
      <Input
        value={options.title}
        onChange={(e) => dispatch({ type: 'TRACK_OPTION_CHANGE', index: rowIndex, field: 'title', value: e.target.value })}
        className="h-8 w-32 bg-muted text-sm"
      />
      <ToggleGroup
        type="single"
        size="sm"
        value={options.wave}
        onValueChange={(val) => {
          if (val) dispatch({ type: 'TRACK_OPTION_CHANGE', index: rowIndex, field: 'wave', value: val });
        }}
      >
        <ToggleGroupItem value="sine" aria-label="Sine wave">
          <MdiIcon path={mdiSineWave} />
        </ToggleGroupItem>
        <ToggleGroupItem value="triangle" aria-label="Triangle wave">
          <MdiIcon path={mdiTriangleWave} />
        </ToggleGroupItem>
        <ToggleGroupItem value="saw" aria-label="Sawtooth wave">
          <MdiIcon path={mdiSawtoothWave} />
        </ToggleGroupItem>
      </ToggleGroup>
      <Toggle
        size="sm"
        pressed={options.mute}
        onPressedChange={() => dispatch({ type: 'TRACK_OPTION_CHANGE', index: rowIndex, field: 'mute', value: '' })}
        aria-label="Mute track"
      >
        <VolumeX className="size-4" />
      </Toggle>
    </div>
  );
}
