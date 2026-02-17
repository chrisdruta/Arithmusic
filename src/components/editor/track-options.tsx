import { useEffect, useRef, useState } from 'react';
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

const waves = [
  { value: 'sine', path: mdiSineWave, label: 'Sine wave' },
  { value: 'triangle', path: mdiTriangleWave, label: 'Triangle wave' },
  { value: 'saw', path: mdiSawtoothWave, label: 'Sawtooth wave' },
] as const;

function WaveSelect({ rowIndex }: { rowIndex: number }) {
  const { state, dispatch } = useComposition();
  const wave = state.timelines[rowIndex].options.wave;
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [expanded]);

  const selected = waves.find((w) => w.value === wave) || waves[0];

  if (!expanded) {
    return (
      <Button
        variant="calc-secondary"
        size="sm"
        onClick={() => setExpanded(true)}
        className="text-highlight"
        aria-label={`Wave: ${selected.label}. Click to change.`}
      >
        <MdiIcon path={selected.path} />
      </Button>
    );
  }

  return (
    <div ref={ref}>
      <ToggleGroup
        type="single"
        size="sm"
        value={wave}
        onValueChange={(val) => {
          if (val) dispatch({ type: 'TRACK_OPTION_CHANGE', index: rowIndex, field: 'wave', value: val });
          setExpanded(false);
        }}
      >
        {waves.map((w) => (
          <ToggleGroupItem key={w.value} value={w.value} aria-label={w.label} variant="calc">
            <MdiIcon path={w.path} />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export default function TrackOptions({ rowIndex }: { rowIndex: number }) {
  const { state, dispatch } = useComposition();
  const options = state.timelines[rowIndex].options;

  return (
    <div className="flex items-center gap-2.5 bg-surface px-2.5 py-1">
      <Button
        variant="calc-secondary"
        size="sm"
        onClick={() => dispatch({ type: 'DELETE_TRACK', rowIndex })}
      >
        Track <Minus className="size-4" />
      </Button>
      <Input
        value={options.title}
        onChange={(e) => dispatch({ type: 'TRACK_OPTION_CHANGE', index: rowIndex, field: 'title', value: e.target.value })}
        size="sm"
        className="w-32 bg-muted"
      />
      <WaveSelect rowIndex={rowIndex} />
      <Toggle
        size="sm"
        pressed={options.mute}
        onPressedChange={() => dispatch({ type: 'TRACK_OPTION_CHANGE', index: rowIndex, field: 'mute', value: '' })}
        aria-label="Mute track"
        variant="calc"
      >
        <VolumeX className="size-4" />
      </Toggle>
    </div>
  );
}
