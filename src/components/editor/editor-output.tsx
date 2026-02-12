import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { parse, simplify } from 'mathjs';

function generateTex(expression: string): string {
  return `\\Large f(x)=${simplify(parse(expression)).toTex()}`;
}

interface EditorOutputProps {
  output: string;
  error: boolean;
}

export default function EditorOutput({ output, error }: EditorOutputProps) {
  return (
    <div className="flex w-[30%] items-center">
      <span className="mr-4 text-sm text-muted-foreground">Output:</span>
      {!error ? (
        <InlineMath math={generateTex(output)} />
      ) : (
        <span className="text-sm font-medium text-destructive">{output}</span>
      )}
    </div>
  );
}
