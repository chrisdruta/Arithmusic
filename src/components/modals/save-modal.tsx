import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useComposition, exportCompositionJson } from '../../context/CompositionContext';

export default function SaveModal() {
  const { state, dispatch } = useComposition();
  const currentComposition = exportCompositionJson(state.timelines);

  return (
    <Dialog open={state.showingModals.save} onOpenChange={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'save' })}>
      <DialogContent showCloseButton={false} className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Save Composition</DialogTitle>
        </DialogHeader>
        <DialogDescription>Copy the text below</DialogDescription>
        <Textarea readOnly rows={7} value={currentComposition} className="font-mono text-xs" />
        <p className="text-sm text-muted-foreground">or</p>
        <Button asChild variant="calc" className="self-center">
          <a
            download="composition.json"
            target="_blank"
            href={`data:text/json;charset=utf-8,${encodeURIComponent(currentComposition)}`}
          >
            Save Json
          </a>
        </Button>
        <DialogFooter>
          <Button variant="calc-secondary" onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'save' })}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
