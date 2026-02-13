import { Plus, Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useComposition } from '../../context/CompositionContext';

export default function EditorControls() {
  const { dispatch } = useComposition();

  return (
    <div className="flex w-full items-center justify-between bg-surface-alt px-2.5 pb-2.5">
      <Button variant="secondary" size="sm" className="calc-button" onClick={() => dispatch({ type: 'ADD_TRACK' })}>
        Track <Plus className="size-4" />
      </Button>
      <div className="flex-1" />
      <Button
        variant="secondary"
        size="sm"
        className="calc-button mr-2.5"
        onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'load' })}
      >
        Load <Upload className="size-4" />
      </Button>
      <Button variant="secondary" size="sm" className="calc-button" onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'save' })}>
        Save <Save className="size-4" />
      </Button>
    </div>
  );
}
