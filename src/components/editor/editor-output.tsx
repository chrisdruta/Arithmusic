import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { parse, simplify } from 'mathjs';

// Colorize LaTeX tokens using \textcolor — base color (LCD green) handles
// structural elements (parens, braces, equals, prefix) automatically
const TEX_TOKEN = /(\\(?:sin|cos|tan|asin|acos|atan|log|ln|exp|min|max)\b)|(\\pi\b)|(\d+\.?\d*)|(\\cdot|\\times)|(\\[a-zA-Z]+)|([+\-])|(x)(?![a-zA-Z])|(.)/g;

function colorizeTex(tex: string): string {
  const parts: string[] = [];
  let m;
  TEX_TOKEN.lastIndex = 0;
  while ((m = TEX_TOKEN.exec(tex)) !== null) {
    const [full, func, , num, mulOp, , addOp, variable] = m;
    if (func) parts.push(`\\textcolor{#66aaff}{${func}}`);
    else if (num) parts.push(`\\textcolor{#d4a017}{${num}}`);
    else if (mulOp || addOp) parts.push(`\\textcolor{#cc3333}{${full}}`);
    else if (variable) parts.push(`\\textcolor{#33ff66}{${variable}}`);
    else parts.push(full);
  }
  return parts.join('');
}

function generateTex(expression: string): string {
  const exprTex = parse(expression).toTex();
  return `\\Large f(x)=${colorizeTex(exprTex)}`;
}

interface EditorOutputProps {
  output: string;
  error: boolean;
}

export default function EditorOutput({ output, error }: EditorOutputProps) {
  return (
    <div className="flex min-w-0 shrink flex-col gap-2" style={{ flexBasis: '30%' }}>
      <span className="text-sm uppercase tracking-wider text-muted-foreground">Output</span>
      {!error ? (
        <span className="lcd-katex overflow-hidden">
          <InlineMath math={generateTex(output)} />
        </span>
      ) : (
        <span className="text-base font-medium text-destructive">{output}</span>
      )}
    </div>
  );
}
