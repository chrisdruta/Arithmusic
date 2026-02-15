import { useState } from 'react';
import { cn } from '@/lib/utils';

type DomainMode = 'time' | 'beat';

export default function DomainToggle() {
  const [domain, setDomain] = useState<DomainMode>('time');

  return (
    <div className="flex items-center">
      <span className="mr-2 text-xs tracking-widest text-muted-foreground">Domain:</span>
      <div className="relative inline-flex rounded-sm border border-lcd-dim bg-lcd-bg p-px shadow-[inset_0_1px_3px_rgba(0,0,0,0.5),0_0_6px_rgba(51,255,102,0.08)]">
        <button
          className={cn(
            "relative z-[1] cursor-pointer border-none bg-transparent px-3 py-1 text-xs leading-[1.4] tracking-[0.12em] transition-colors duration-150 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            domain === 'time' ? "text-highlight [text-shadow:0_0_8px_rgba(51,255,102,0.6)]" : "text-lcd-dim"
          )}
          onClick={() => setDomain('time')}
        >
          TIME
        </button>
        <button
          className={cn(
            "relative z-[1] cursor-pointer border-none bg-transparent px-3 py-1 text-xs leading-[1.4] tracking-[0.12em] transition-colors duration-150 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            domain === 'beat' ? "text-highlight [text-shadow:0_0_8px_rgba(51,255,102,0.6)]" : "text-lcd-dim"
          )}
          onClick={() => setDomain('beat')}
        >
          BEAT
        </button>
        <div
          className={cn(
            "pointer-events-none absolute left-px top-px h-[calc(100%-2px)] w-[calc(50%-1px)] rounded-sm border border-highlight/15 bg-highlight/8 transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
            domain === 'beat' && "translate-x-full"
          )}
        />
      </div>
    </div>
  );
}
