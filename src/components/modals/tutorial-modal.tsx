import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const STORAGE_KEY = 'arithmusic-tutorial-dismissed';

interface Step {
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    title: 'WELCOME',
    body: 'Arithmusic is a synthesizer where you compose music using math. Type frequency expressions like 440 + 100 * x and hear them come alive as sound waves.',
  },
  {
    title: 'THE LCD GRAPH',
    body: 'The large screen plots frequency over time for every track. Each track is a different color. When you hit Play, a playhead sweeps across so you can see exactly what\'s sounding.',
  },
  {
    title: 'TRACKS & TIMELINE',
    body: 'The bottom panel holds your tracks. Each track has a wave type (sine, square, etc.) and a row of segments you can drag to reorder. Add tracks and segments with the + buttons.',
  },
  {
    title: 'SEGMENT EDITOR',
    body: 'Click any segment to edit it in the right panel. Set the frequency expression (e.g. 440 * sin(x)), duration in milliseconds, and volume percentage.',
  },
  {
    title: 'PLAY & SAVE',
    body: 'Use the playback controls on the left to Play, Pause, or Stop. Open Settings to tweak sample rate and volume. Save and load compositions as JSON files.',
  },
];

export default function TutorialModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Auto-open on mount if not dismissed
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true);
    }
  }, []);

  // Listen for help button re-open event
  useEffect(() => {
    const handler = () => {
      setStep(0);
      setDontShowAgain(false);
      setOpen(true);
    };
    window.addEventListener('open-tutorial', handler);
    return () => window.removeEventListener('open-tutorial', handler);
  }, []);

  const handleClose = useCallback(() => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    setOpen(false);
  }, [dontShowAgain]);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest text-highlight">
            {STEPS[step].title}
          </DialogTitle>
          <DialogDescription className="sr-only">Tutorial step {step + 1} of {STEPS.length}</DialogDescription>
        </DialogHeader>

        {/* LCD-style content panel */}
        <div className="rounded-sm border border-lcd-dim bg-lcd-bg p-5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5),0_0_6px_rgba(51,255,102,0.08)]">
          <p className="text-sm leading-relaxed text-lcd-dim">
            {STEPS[step].body}
          </p>
        </div>

        {/* Step indicator dots */}
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={
                i === step
                  ? 'h-1.5 w-6 rounded-full bg-highlight shadow-[0_0_6px_rgba(51,255,102,0.4)] transition-all'
                  : 'h-1.5 w-1.5 rounded-full bg-lcd-dim transition-all'
              }
            />
          ))}
        </div>

        <DialogFooter className="flex-row items-center justify-between sm:justify-between">
          {/* Don't show again */}
          <div className="flex items-center gap-2">
            <Switch
              id="tutorial-dismiss"
              size="sm"
              checked={dontShowAgain}
              onCheckedChange={setDontShowAgain}
            />
            <Label htmlFor="tutorial-dismiss" className="text-xs uppercase tracking-wider text-muted-foreground">
              Don't show again
            </Label>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="calc-secondary" size="sm" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <>
                <Button variant="calc-secondary" size="sm" onClick={handleClose}>
                  Skip
                </Button>
                <Button variant="calc" size="sm" onClick={() => setStep(step + 1)}>
                  Next
                </Button>
              </>
            ) : (
              <Button variant="calc" size="sm" onClick={handleClose}>
                Get Started
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
