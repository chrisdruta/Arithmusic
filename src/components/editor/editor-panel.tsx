import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import EditorOutput from './editor-output';
import EquationInput from './equation-input';
import InfiniteSlider from './infinite-slider';
import { useComposition } from '../../context/CompositionContext';

export default function EditorPanel() {
  const { state, dispatch } = useComposition();
  const { row, col } = state.selectedSegment;
  const segment = state.timelines[row]?.segments[col];
  if (!segment) return null;

  const { title, expression, length, volume } = segment;

  return (
    <div className="lcd-scanlines relative flex w-full items-center gap-5 bg-lcd-bg px-6 py-5 text-foreground min-h-[15vh]">
      <FormField
        label="Title"
        value={title.value}
        error={title.error}
        onChange={(e) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'title', value: e.target.value })}
        wrapperClassName="w-32"
      />
      <EquationInput
        value={expression.value}
        error={expression.error ? 'See output' : null}
        onChange={(e) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'expression', value: e.target.value })}
      />
      <InfiniteSlider
        valueMs={length.value}
        error={length.error}
        onChange={(val) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'length', value: val })}
      />
      <div className="flex w-28 flex-col gap-2">
        <Label htmlFor="volume" className="text-sm uppercase tracking-wider text-muted-foreground">
          Volume (%)
        </Label>
        <Input
          id="volume"
          value={volume.value}
          onChange={(e) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'volume', value: e.target.value })}
          size="lg"
          className={cn(volume.error && "border-destructive")}
          aria-invalid={!!volume.error}
        />
        <Label className="font-display text-xs italic text-lcd-dim tracking-wide">0 — 200</Label>
        <input
          type="range"
          min={0}
          max={200}
          step={1}
          value={Number(volume.value) || 0}
          onChange={(e) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'volume', value: e.target.value })}
          className="lcd-slider w-full"
          aria-label="Volume"
        />
        {volume.error && <p className="text-sm text-destructive">{volume.error}</p>}
      </div>
      <EditorOutput
        output={expression.error ? expression.error : expression.value}
        error={!!expression.error}
      />
      <Button variant="ghost-destructive" size="icon" className="shrink-0" aria-label="Delete segment" onClick={() => dispatch({ type: 'DELETE_SEGMENT' })}>
        <Trash2 className="size-5" />
      </Button>
    </div>
  );
}
