import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Segment } from '../../types';
import { useComposition } from '../../context/CompositionContext';

function reorder(list: Segment[], startIndex: number, endIndex: number): Segment[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

function getItemStyle(
  isDragging: boolean,
  draggableStyle: React.CSSProperties | undefined,
  isSelected: boolean
): React.CSSProperties {
  return {
    userSelect: 'none',
    marginLeft: 5,
    padding: '5px 8px',
    minHeight: 16,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    alignSelf: 'center',
    borderRadius: 'var(--radius)',
    fontSize: '0.875rem',
    background: isSelected ? '#252533' : '#1a1a24',
    borderBottom: isSelected ? '2px solid #00e5ff' : '2px solid transparent',
    color: '#f0f0f5',
    ...(isDragging ? { boxShadow: '0 0 12px rgba(0,229,255,0.3)' } : {}),
    ...draggableStyle,
  };
}

function getListStyle(isDraggingOver: boolean): React.CSSProperties {
  return {
    background: isDraggingOver ? '#252533' : '#1a1a24',
    display: 'flex',
    justifyContent: 'flex-start',
    padding: 8,
    overflow: 'auto',
    flexGrow: 1,
    width: '100%',
  };
}

export default function TrackTimeline({ rowIndex }: { rowIndex: number }) {
  const { state, dispatch } = useComposition();
  const segments = state.timelines[rowIndex].segments;
  const selectedSegment = state.selectedSegment;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = reorder(segments, result.source.index, result.destination.index);
    dispatch({
      type: 'SEGMENT_REARRANGE',
      rowIndex,
      sourceCol: result.source.index,
      destCol: result.destination.index,
      segments: reordered,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
            {...provided.droppableProps}
          >
            {segments.map((segment, colIndex) => (
              <Draggable key={segment.id} draggableId={segment.id} index={colIndex}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style as React.CSSProperties | undefined,
                      selectedSegment.row === rowIndex && selectedSegment.col === colIndex
                    )}
                    onClick={() => dispatch({ type: 'SEGMENT_SELECT', row: rowIndex, col: colIndex })}
                  >
                    {segment.title.value}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <div className="mx-1.5 border-r border-border self-stretch" />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => dispatch({ type: 'ADD_SEGMENT', rowIndex })}
              className="self-center text-muted-foreground hover:text-foreground"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
