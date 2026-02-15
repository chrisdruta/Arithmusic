import { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
      <Label className="text-sm uppercase tracking-wider text-muted-foreground">
        Equation f(x)
      </Label>
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
