import { Plus, Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useComposition } from '../../context/CompositionContext';
import TemplateDropdowns from './template-bar';

export default function EditorControls() {
  const { state, dispatch } = useComposition();
  const { timelines } = state;

  return (
    <div className="groove-bottom flex w-full items-center gap-2 bg-surface-alt px-2.5 py-2.5">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Timeline
      </span>
      <span className="flex items-center gap-1">
        {timelines.map((_, i) => (
          <span
            key={i}
            className="inline-block size-1.5 rounded-full"
            style={{ backgroundColor: `var(--color-${['lcd-green', 'amber', 'func-blue', 'accent'][i % 4]})` }}
          />
        ))}
      </span>
      <div className="mx-1 self-stretch border-r border-border/40" />
      <Button variant="calc-secondary" size="sm" onClick={() => dispatch({ type: 'ADD_TRACK' })}>
        Track <Plus className="size-4" />
      </Button>
      <div className="mx-1 self-stretch border-r border-border/40" />
      <TemplateDropdowns />
      <div className="flex-1" />
      <Button
        variant="calc-secondary"
        size="sm"
        onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'load' })}
      >
        Load <Upload className="size-4" />
      </Button>
      <Button variant="calc-secondary" size="sm" onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'save' })}>
        Save <Save className="size-4" />
      </Button>
    </div>
  );
}
