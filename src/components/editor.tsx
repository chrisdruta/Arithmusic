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

export function TimelinePanel() {
  const { state, dispatch } = useComposition();
  const { timelines, selectedSegment } = state;

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

  return (
    <div className="flex h-full flex-col overflow-hidden bg-surface">
      <DragDropContext onDragEnd={onDragEnd}>
        <EditorControls />
        <div className="flex-1 overflow-y-auto pb-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]">
          {timelines.map((_tl, rowIndex) => (
            <div key={rowIndex} className="mt-px flex w-full justify-start border-b border-border/50 bg-surface">
              <div
                className={`shrink-0 self-stretch ${selectedSegment.row === rowIndex ? 'w-1.5' : 'w-1'}`}
                style={{ backgroundColor: `var(--color-${['lcd-green', 'amber', 'func-blue', 'accent'][rowIndex % 4]})` }}
              />
              <TrackOptions rowIndex={rowIndex} />
              <TrackTimeline rowIndex={rowIndex} />
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export function SegmentPanel() {
  const { state } = useComposition();
  const { timelines, selectedSegment } = state;
  const selectedSegmentData = timelines[selectedSegment.row]?.segments[selectedSegment.col];
  const trackColor = selectedSegmentData
    ? ['lcd-green', 'amber', 'func-blue', 'accent'][selectedSegment.row % 4]
    : null;

  return (
    <div className="flex w-80 shrink-0 flex-col overflow-hidden border-l border-border/50 bg-surface">
      <div className="groove-bottom flex items-center gap-2 bg-surface-alt px-3 py-1.5">
        {trackColor && (
          <span
            className="inline-block size-1.5 rounded-full"
            style={{ backgroundColor: `var(--color-${trackColor})` }}
          />
        )}
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Segment Editor
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        {selectedSegmentData ? (
          <EditorPanel />
        ) : (
          <div className="lcd-scanlines relative flex h-full items-center justify-center border-[3px] border-t-0 border-border bg-lcd-bg shadow-[inset_0_2px_6px_rgba(0,0,0,0.6),inset_0_0_1px_rgba(0,0,0,0.8),0_0_8px_rgba(51,255,102,0.06)]">
            <span className="font-display text-center text-sm tracking-widest text-lcd-dim/60">
              SELECT A SEGMENT TO EDIT
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
