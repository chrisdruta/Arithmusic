import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useComposition } from '../../context/CompositionContext';

export default function TrackTimeline({ rowIndex, maxTotalMs }: { rowIndex: number; maxTotalMs: number }) {
  const { state, dispatch } = useComposition();
  const segments = state.timelines[rowIndex].segments;
  const selectedSegment = state.selectedSegment;

  const trackTotalMs = segments.reduce((sum, s) => sum + Math.max(s.length.value, 1), 0);
  const remainderMs = maxTotalMs - trackTotalMs;

  return (
    <Droppable droppableId={String(rowIndex)} direction="horizontal">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            "flex w-full flex-1 items-start overflow-x-auto p-2",
            snapshot.isDraggingOver ? "bg-secondary" : "bg-surface"
          )}
        >
          {segments.map((segment, colIndex) => {
            const isSelected = selectedSegment.row === rowIndex && selectedSegment.col === colIndex;
            return (
              <Draggable key={segment.id} draggableId={segment.id} index={colIndex}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      flexGrow: Math.max(segment.length.value, 1),
                      flexShrink: 0,
                      flexBasis: 0,
                      minWidth: '3rem',
                      ...(provided.draggableProps.style as React.CSSProperties | undefined),
                    }}
                    onClick={() => dispatch({ type: 'SEGMENT_SELECT', row: rowIndex, col: colIndex })}
                    className={cn(
                      "ml-1 select-none self-stretch truncate rounded-sm px-2 py-1.5 text-sm transition-all duration-75",
                      "border border-t-[#555] border-l-[#555] border-b-[#222] border-r-[#222] shadow-[1px_1px_0px_#111,inset_0_1px_0_rgba(255,255,255,0.08)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] active:translate-y-px",
                      isSelected
                        ? "bg-secondary text-highlight border-b-2 border-b-highlight [text-shadow:0_0_8px_rgba(51,255,102,0.4)]"
                        : "bg-surface text-foreground border-b-2 border-b-transparent hover:bg-secondary/80 hover:text-highlight/80",
                      snapshot.isDragging && snapshot.draggingOver != null && "glow-lcd",
                      snapshot.isDragging && snapshot.draggingOver == null && "border-destructive! bg-destructive/20! text-destructive! opacity-60"
                    )}
                  >
                    {segment.title.value}
                  </div>
                )}
              </Draggable>
            );
          })}
          {remainderMs > 0 && (
            <div style={{ flexGrow: remainderMs, flexShrink: 0, flexBasis: 0 }} />
          )}
          {provided.placeholder}
          <div className="mx-1 self-stretch border-r border-border/40" />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => dispatch({ type: 'ADD_SEGMENT', rowIndex })}
            className="self-center text-muted-foreground hover:bg-secondary hover:text-highlight"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      )}
    </Droppable>
  );
}
