import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DomainMode = 'time' | 'beat';

export default function DomainToggle() {
  const [domain, setDomain] = useState<DomainMode>('time');

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">Domain</span>
      <div className="relative flex flex-col rounded-sm border border-lcd-dim bg-lcd-bg p-px shadow-[inset_0_1px_3px_rgba(0,0,0,0.5),0_0_6px_rgba(51,255,102,0.08)]">
        <Button
          variant="ghost"
          className={cn(
            "relative z-[1] h-auto rounded-none px-4 py-1.5 text-xs font-normal leading-[1.4] tracking-[0.12em] hover:bg-transparent",
            domain === 'time'
              ? "text-highlight hover:text-highlight [text-shadow:0_0_8px_rgba(51,255,102,0.6)]"
              : "text-lcd-dim hover:text-lcd-dim"
          )}
          onClick={() => setDomain('time')}
        >
          TIME
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "relative z-[1] h-auto rounded-none px-4 py-1.5 text-xs font-normal leading-[1.4] tracking-[0.12em] hover:bg-transparent",
            domain === 'beat'
              ? "text-highlight hover:text-highlight [text-shadow:0_0_8px_rgba(51,255,102,0.6)]"
              : "text-lcd-dim hover:text-lcd-dim"
          )}
          onClick={() => setDomain('beat')}
        >
          BEAT
        </Button>
        <div
          className={cn(
            "pointer-events-none absolute left-px top-px h-[calc(50%-1px)] w-[calc(100%-2px)] rounded-sm border border-highlight/15 bg-highlight/8 transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
            domain === 'beat' && "translate-y-full"
          )}
        />
      </div>
    </div>
  );
}
