import { DragDropContext, type DropResult } from '@hello-pangea/dnd';

import { useComposition } from '../context/CompositionContext';
import EditorControls from './editor/editor-controls';
import EditorPanel from './editor/editor-panel';
import TrackTimeline from './editor/track-timeline';
import TrackOptions from './editor/track-options';
import { Led } from './ui/led';
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
    const sourceDropId = result.source.droppableId;

    if (!result.destination) {
      // Template dropped nowhere — ignore
      if (sourceDropId.startsWith('templates-')) return;
      // Segment dragged outside all tracks — delete it
      const sourceRow = Number(sourceDropId);
      const sourceCol = result.source.index;
      dispatch({ type: 'DELETE_SEGMENT', row: sourceRow, col: sourceCol });
      return;
    }

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
              <div className="flex w-6 shrink-0 items-center justify-center">
                <Led
                  color={`var(--color-${['lcd-green', 'amber', 'func-blue', 'accent'][rowIndex % 4]})`}
                  on={selectedSegment.row === rowIndex}
                />
              </div>
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
        <Led
          color={trackColor ? `var(--color-${trackColor})` : 'var(--color-muted-foreground)'}
          on={!!trackColor}
        />
        <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Segment Editor
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        {selectedSegmentData ? (
          <EditorPanel />
        ) : (
          <div className="flex h-full items-center justify-center bg-surface">
            <span className="font-display text-center text-sm tracking-widest text-muted-foreground/40">
              SELECT A SEGMENT TO EDIT
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
