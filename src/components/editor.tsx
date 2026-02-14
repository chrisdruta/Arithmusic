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
import { getTemplateById } from '../lib/templates';
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

    const sourceDropId = result.source.droppableId;
    const destDropId = result.destination.droppableId;
    const destCol = result.destination.index;

    // Template drag → insert new segment from template
    if (sourceDropId.startsWith('templates-')) {
      if (destDropId.startsWith('templates-')) return;
      const template = getTemplateById(result.draggableId);
      if (!template) return;
      const destRow = Number(destDropId);
      dispatch({
        type: 'INSERT_SEGMENT',
        row: destRow,
        col: destCol,
        segment: {
          title: template.title,
          expression: template.expression,
          length: template.length,
          volume: template.volume,
        },
      });
      return;
    }

    const sourceRow = Number(sourceDropId);
    const destRow = Number(destDropId);
    const sourceCol = result.source.index;

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
            <DragDropContext onDragEnd={onDragEnd}>
              <EditorControls />
              <div className="w-full pb-1">
                {timelines.map((_tl, rowIndex) => (
                  <div key={rowIndex} className="mt-px flex w-full justify-start border-b border-border/50 bg-surface">
                    <TrackOptions rowIndex={rowIndex} />
                    <TrackTimeline rowIndex={rowIndex} />
                  </div>
                ))}
              </div>
            </DragDropContext>
            {selectedSegmentData ? (
              <EditorPanel />
            ) : (
              <div className="h-[15vh]" />
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
