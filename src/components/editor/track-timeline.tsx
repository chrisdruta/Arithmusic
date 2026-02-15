import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useComposition } from '../../context/CompositionContext';

export default function TrackTimeline({ rowIndex }: { rowIndex: number }) {
  const { state, dispatch } = useComposition();
  const segments = state.timelines[rowIndex].segments;
  const selectedSegment = state.selectedSegment;

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
                    style={provided.draggableProps.style as React.CSSProperties | undefined}
                    onClick={() => dispatch({ type: 'SEGMENT_SELECT', row: rowIndex, col: colIndex })}
                    className={cn(
                      "ml-1 select-none self-center truncate rounded-sm px-2 py-1.5 text-sm transition-[background,color,border-color,box-shadow] duration-75",
                      "calc-button",
                      isSelected
                        ? "bg-secondary text-highlight border-b-2 border-b-highlight"
                        : "bg-surface text-foreground border-b-2 border-b-transparent hover:bg-secondary hover:text-highlight",
                      snapshot.isDragging && "glow-lcd"
                    )}
                  >
                    {segment.title.value}
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
          <div className="mx-1.5 self-stretch border-r border-border" />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => dispatch({ type: 'ADD_SEGMENT', rowIndex })}
            className="self-center text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      )}
    </Droppable>
  );
}
