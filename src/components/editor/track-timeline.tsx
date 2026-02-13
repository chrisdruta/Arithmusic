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
    borderRadius: '2px',
    fontSize: '0.875rem',
    fontFamily: '"Share Tech Mono", monospace',
    background: isSelected ? '#2a2a2c' : '#222224',
    color: isSelected ? '#33ff66' : '#c8c8c0',
    borderBottom: isSelected ? '2px solid #33ff66' : '2px solid transparent',
    borderTop: '1px solid #444',
    borderLeft: '1px solid #444',
    borderRight: '1px solid #1a1a1a',
    boxShadow: isDragging
      ? '0 0 8px rgba(51,255,102,0.3), 1px 1px 0px #111'
      : '1px 1px 0px #111, inset 0 1px 0 rgba(255,255,255,0.05)',
    ...draggableStyle,
  };
}

function getListStyle(isDraggingOver: boolean): React.CSSProperties {
  return {
    background: isDraggingOver ? '#2a2a2c' : '#222224',
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
