import { useRef, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

import { useComposition } from '../context/CompositionContext';
import EditorControls from './editor/editor-controls';
import EditorPanel from './editor/editor-panel';
import TrackTimeline from './editor/track-timeline';
import TrackOptions from './editor/track-options';

export default function Editor() {
  const { state, dispatch } = useComposition();
  const { timelines, selectedSegment } = state;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [value, setValue] = useState('editor');

  const handleValueChange = (val: string) => {
    setValue(val);
    // Animate graph during accordion transition
    timerRef.current = setInterval(() => dispatch({ type: 'ANIMATE_GRAPH' }), 16);
    setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current);
    }, 350);
  };

  const selectedSegmentData =
    timelines[selectedSegment.row]?.segments[selectedSegment.col];

  return (
    <Accordion
      type="single"
      collapsible
      value={value}
      onValueChange={handleValueChange}
      className="w-full flex-none"
    >
      <AccordionItem value="editor" className="border-b-0">
        <AccordionTrigger className="bg-surface-alt px-4 py-2 text-sm font-semibold uppercase tracking-widest hover:no-underline">
          Timeline Editor
        </AccordionTrigger>
        <AccordionContent className="p-0">
          <div className="flex w-full flex-col items-start bg-surface text-foreground">
            <EditorControls />
            <div className="mb-1 w-full">
              {timelines.map((_tl, rowIndex) => (
                <div key={rowIndex} className="mt-1 flex w-full justify-start bg-surface">
                  <TrackOptions rowIndex={rowIndex} />
                  <TrackTimeline rowIndex={rowIndex} />
                </div>
              ))}
            </div>
            {selectedSegmentData ? (
              <EditorPanel />
            ) : (
              <div style={{ height: '15vh', paddingBottom: 5 }} />
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
