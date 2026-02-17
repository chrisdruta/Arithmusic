import { useRef } from 'react';
import { CircleHelp } from 'lucide-react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Math expression syntax highlighting via transparent-input overlay
const MATH_TOKEN = /(\b(?:sin|cos|tan|asin|acos|atan|atan2|sqrt|abs|log|ln|exp|ceil|floor|round|min|max|pow|mod)\b)|\b(pi|e)\b|(x)|([0-9]+\.?[0-9]*)|([+\-*/^%])|([()])|(.)/g;

const TOKEN_COLORS: Record<string, string> = {
  func: 'var(--color-func-blue)',
  const: 'var(--color-lcd-green)',
  var: 'var(--color-lcd-green)',
  num: 'var(--color-amber)',
  op: 'var(--color-accent)',
  paren: 'var(--color-muted-foreground)',
  other: 'var(--color-foreground)',
};

function highlightMath(text: string) {
  const spans: { text: string; color: string }[] = [];
  let match;
  MATH_TOKEN.lastIndex = 0;
  while ((match = MATH_TOKEN.exec(text)) !== null) {
    const [full, func, constant, variable, num, op, paren] = match;
    const color = func ? TOKEN_COLORS.func
      : constant ? TOKEN_COLORS.const
      : variable ? TOKEN_COLORS.var
      : num ? TOKEN_COLORS.num
      : op ? TOKEN_COLORS.op
      : paren ? TOKEN_COLORS.paren
      : TOKEN_COLORS.other;
    spans.push({ text: full, color });
  }
  return spans;
}

export default function EquationInput({ value, error, onChange }: {
  value: string;
  error?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);

  // Sync scroll position between input and highlight layer
  const syncScroll = () => {
    if (inputRef.current && mirrorRef.current) {
      mirrorRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  };

  return (
    <div className="flex flex-1 min-w-0 flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <Label className="text-sm uppercase tracking-wider text-muted-foreground">
          Equation f(x)
        </Label>
        <PopoverPrimitive.Root>
          <PopoverPrimitive.Trigger asChild>
            <Button variant="ghost" size="icon-xs" className="text-muted-foreground hover:text-highlight">
              <CircleHelp className="size-3.5" />
            </Button>
          </PopoverPrimitive.Trigger>
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              side="top"
              align="start"
              sideOffset={6}
              className="z-50 w-72 rounded-sm border border-lcd-dim bg-lcd-bg p-3 shadow-[inset_0_1px_3px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.5)] animate-in fade-in-0 zoom-in-95"
            >
              <div className="space-y-2.5 font-mono text-xs">
                <div>
                  <span className="uppercase tracking-widest text-muted-foreground">Variable</span>
                  <p className="mt-0.5 text-lcd-green"><span className="text-highlight">x</span> = elapsed time in seconds</p>
                </div>
                <div>
                  <span className="uppercase tracking-widest text-muted-foreground">Functions</span>
                  <p className="mt-0.5 text-func-blue">sin cos tan asin acos atan sqrt abs log ln exp pow min max ceil floor round</p>
                </div>
                <div>
                  <span className="uppercase tracking-widest text-muted-foreground">Constants</span>
                  <p className="mt-0.5 text-lcd-green">pi &nbsp; e</p>
                </div>
                <div>
                  <span className="uppercase tracking-widest text-muted-foreground">Examples</span>
                  <div className="mt-0.5 space-y-0.5 text-amber">
                    <p>440</p>
                    <p>440 + 100 * x</p>
                    <p>sin(x * 2 * pi) * 200 + 440</p>
                  </div>
                </div>
              </div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      </div>
      <span className="font-display text-xs italic text-lcd-dim tracking-wide">x = time (s)</span>
      <div className="relative">
        {/* Colored highlight layer */}
        <div
          ref={mirrorRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 flex h-11 items-center overflow-hidden rounded-sm border border-transparent px-3 text-base"
        >
          <span className="whitespace-pre">
            {highlightMath(value).map((t, i) => (
              <span key={i} style={{ color: t.color }}>{t.text}</span>
            ))}
          </span>
        </div>
        {/* Actual input — transparent text, visible caret */}
        <Input
          ref={inputRef}
          value={value}
          onChange={onChange}
          onScroll={syncScroll}
          size="lg"
          surface="lcd"
          className={cn(
            "text-transparent caret-highlight",
            error && "border-destructive"
          )}
          aria-invalid={!!error}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
