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
    <div className="EditorOutput">
      <span style={{ marginRight: 25 }}>Output:</span>
      {!error ? (
        <InlineMath math={generateTex(output)} />
      ) : (
        <span className="EditorOutputError">{output}</span>
      )}
    </div>
  );
}
