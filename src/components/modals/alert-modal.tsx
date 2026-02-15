import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useComposition } from '../../context/CompositionContext';

const errorKeyMap: Record<string, string> = {
  fs: 'Sampling frequency',
  volume: 'Volume',
  multiplier: 'Auto multiplier',
  expression: 'Expression',
  length: 'Length',
};

export default function AlertModal() {
  const { state, dispatch } = useComposition();
  const errors = state.compositionErrors;

  const items: { key: string; text: string }[] = [];

  if (errors) {
    errors.settings.forEach((key, index) => {
      items.push({ key: `s${index}`, text: `${errorKeyMap[key] ?? key} in Settings` });
    });
    errors.editor.forEach((err, index) => {
      items.push({
        key: `e${index}`,
        text: `${errorKeyMap[err.key] ?? err.key} for tab titled '${err.title}' in Timeline [row ${err.row}, column ${err.col}]`,
      });
    });
  }

  return (
    <Dialog open={state.showingModals.alert} onOpenChange={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'alert' })}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Composition Errors</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Please fix the following errors and try again
        </DialogDescription>
        <ul className="flex flex-col gap-1">
          {items.map((item, i) => (
            <li key={item.key}>
              <p className="py-2 text-sm">{item.text}</p>
              {i < items.length - 1 && <Separator />}
            </li>
          ))}
        </ul>
        <DialogFooter>
          <Button variant="calc" onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'alert' })}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
