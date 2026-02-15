import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/ui/form-field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useComposition } from '../../context/CompositionContext';

export default function SettingsModal() {
  const { state, dispatch } = useComposition();
  const { fs, volume, multiplier, graphRange, aliasing } = state.settings;

  return (
    <Dialog open={state.showingModals.settings} onOpenChange={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'settings' })}>
      <DialogContent showCloseButton={false} className="sm:max-w-xl">
        <div className="flex flex-row gap-6">
          <div className="flex flex-1 flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription className="sr-only">Configure synthesis settings</DialogDescription>
            </DialogHeader>
            <FormField
              label="Master volume (%)"
              value={volume.value}
              error={volume.error}
              onChange={(e) => dispatch({ type: 'SETTINGS_CHANGE', field: 'volume', value: e.target.value })}
              wrapperClassName="w-36"
            />
            <FormField
              label="Auto multiplier for function input (x)"
              value={multiplier.value}
              error={multiplier.error}
              onChange={(e) => dispatch({ type: 'SETTINGS_CHANGE', field: 'multiplier', value: e.target.value })}
              wrapperClassName="w-64"
            />
            <FormField
              label="Upper graph range (Hz)"
              value={graphRange.value}
              error={graphRange.error}
              onChange={(e) => dispatch({ type: 'SETTINGS_CHANGE', field: 'graphRange', value: e.target.value })}
              wrapperClassName="w-44"
            />
            <FormField
              label="Sampling frequency (Hz)"
              value={fs.value}
              error={fs.error}
              onChange={(e) => dispatch({ type: 'SETTINGS_CHANGE', field: 'fs', value: e.target.value })}
              wrapperClassName="w-48"
            />
            <div className="flex items-center gap-3 mt-2">
              <Label htmlFor="aliasing" className="text-sm uppercase tracking-wider text-muted-foreground">Enable Aliasing</Label>
              <Switch
                id="aliasing"
                checked={aliasing}
                onCheckedChange={() => dispatch({ type: 'SETTINGS_CHANGE', field: 'aliasing' })}
              />
            </div>
          </div>
          <div className="flex w-56 flex-col justify-between rounded-sm border border-lcd-dim bg-lcd-bg p-4 self-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.5),0_0_6px_rgba(51,255,102,0.08)]">
            <h3 className="text-center font-display text-lg tracking-wider text-highlight">ARITHMUSIC</h3>
            <div className="mt-3 space-y-1 text-sm text-lcd-dim">
              <p>v2.0.0</p>
              <a
                href="https://github.com/chrisdruta/arithmusic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-highlight/70 hover:text-highlight transition-colors duration-75"
              >
                github.com/chrisdruta/arithmusic
              </a>
              <p>GPL v3.0</p>
            </div>
            <p className="mt-3 text-sm text-lcd-dim">
              Chris Druta
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="calc-secondary" onClick={() => dispatch({ type: 'RESET_SETTINGS' })}>
            Defaults
          </Button>
          <Button variant="calc" onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'settings' })}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
