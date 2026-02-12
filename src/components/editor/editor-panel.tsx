import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import EditorOutput from './editor-output';
import { useComposition } from '../../context/CompositionContext';

export default function EditorPanel() {
  const { state, dispatch } = useComposition();
  const { row, col } = state.selectedSegment;
  const segment = state.timelines[row]?.segments[col];
  if (!segment) return null;

  const { title, expression, length, volume } = segment;

  return (
    <div className="flex w-full items-center justify-around gap-3 bg-card px-4 py-3" style={{ minHeight: '15vh' }}>
      <FormField
        label="Title"
        value={title.value}
        error={title.error}
        onChange={(e) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'title', value: e.target.value })}
        wrapperClassName="w-24"
      />
      <FormField
        label="Equation f(x)"
        value={expression.value}
        error={expression.error ? 'See output' : null}
        onChange={(e) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'expression', value: e.target.value })}
        wrapperClassName="w-1/4"
      />
      <FormField
        label="Length (ms)"
        value={length.value}
        error={length.error}
        onChange={(e) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'length', value: e.target.value })}
        wrapperClassName="w-24"
      />
      <FormField
        label="Volume (%)"
        value={volume.value}
        error={volume.error}
        onChange={(e) => dispatch({ type: 'TRACK_DATA_CHANGE', col, row, field: 'volume', value: e.target.value })}
        wrapperClassName="w-[90px]"
      />
      <EditorOutput
        output={expression.error ? expression.error : expression.value}
        error={!!expression.error}
      />
      <Button variant="ghost" size="icon" onClick={() => dispatch({ type: 'DELETE_SEGMENT' })}>
        <Trash2 className="size-5" />
      </Button>
    </div>
  );
}
