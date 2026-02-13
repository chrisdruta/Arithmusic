import { useRef, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';

import { useComposition } from '../context/CompositionContext';
import EditorControls from './editor/editor-controls';
import EditorPanel from './editor/editor-panel';
import TrackTimeline from './editor/track-timeline';
import TrackOptions from './editor/track-options';
import type { Segment } from '../types';

function reorder(list: Segment[], startIndex: number, endIndex: number): Segment[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceRow = Number(result.source.droppableId);
    const destRow = Number(result.destination.droppableId);
    const sourceCol = result.source.index;
    const destCol = result.destination.index;

    if (sourceRow === destRow) {
      if (sourceCol === destCol) return;
      const reordered = reorder(timelines[sourceRow].segments, sourceCol, destCol);
      dispatch({
        type: 'SEGMENT_REARRANGE',
        rowIndex: sourceRow,
        sourceCol,
        destCol,
        segments: reordered,
      });
    } else {
      dispatch({
        type: 'SEGMENT_MOVE_CROSS_TRACK',
        sourceRow,
        sourceCol,
        destRow,
        destCol,
      });
    }
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
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="mb-1 w-full">
                {timelines.map((_tl, rowIndex) => (
                  <div key={rowIndex} className="mt-1 flex w-full justify-start bg-surface">
                    <TrackOptions rowIndex={rowIndex} />
                    <TrackTimeline rowIndex={rowIndex} />
                  </div>
                ))}
              </div>
            </DragDropContext>
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
