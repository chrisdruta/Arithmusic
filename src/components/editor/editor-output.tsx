import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { parse, simplify } from 'mathjs';

// KaTeX \textcolor requires hex literals (can't use CSS vars)
const KATEX_COLORS = {
  func: '#66aaff',
  number: '#d4a017',
  operator: '#cc3333',
} as const;

// Colorize LaTeX tokens using \textcolor — base color (LCD green) handles
// structural elements (parens, braces, equals, prefix) automatically
const TEX_TOKEN = /(\\(?:sin|cos|tan|asin|acos|atan|log|ln|exp|min|max)\b)|(\\pi\b)|(\d+\.?\d*)|(\\cdot|\\times)|(\\[a-zA-Z]+)|([+\-])|(x)(?![a-zA-Z])|(.)/g;

function colorizeTex(tex: string, variableColor: string): string {
  const parts: string[] = [];
  let m;
  TEX_TOKEN.lastIndex = 0;
  while ((m = TEX_TOKEN.exec(tex)) !== null) {
    const [full, func, , num, mulOp, , addOp, variable] = m;
    if (func) parts.push(`\\textcolor{${KATEX_COLORS.func}}{${func}}`);
    else if (num) parts.push(`\\textcolor{${KATEX_COLORS.number}}{${num}}`);
    else if (mulOp || addOp) parts.push(`\\textcolor{${KATEX_COLORS.operator}}{${full}}`);
    else if (variable) parts.push(`\\textcolor{${variableColor}}{${variable}}`);
    else parts.push(full);
  }
  return parts.join('');
}

function generateTex(expression: string, variableColor: string): string {
  const tex = parse(`f(x) = ${expression}`).toTex();
  // mathjs outputs \mathrm{f} — swap to \mathit for italic function name
  return colorizeTex(tex.replace('\\mathrm{f}', '\\mathit{f}'), variableColor);
}

interface EditorOutputProps {
  output: string;
  error: boolean;
  trackColor: string;
}

export default function EditorOutput({ output, error, trackColor }: EditorOutputProps) {
  const variableHex = getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${trackColor}`).trim();

  return (
    <div className="flex min-w-0 shrink basis-[30%] flex-col gap-2">
      <span className="text-sm uppercase tracking-wider text-muted-foreground">Output</span>
      <div className="rounded-sm border border-border bg-lcd-bg px-3 py-2 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5),0_0_6px_rgba(51,255,102,0.08)]">
        {!error ? (
          <span className="lcd-katex overflow-hidden">
            <InlineMath math={generateTex(output, variableHex)} />
          </span>
        ) : (
          <span className="text-base font-medium text-destructive">{output}</span>
        )}
      </div>
    </div>
  );
}
