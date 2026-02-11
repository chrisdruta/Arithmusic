import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
    padding: 5,
    minHeight: 16,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    alignSelf: 'center',
    background: '#ffa4a2',
    borderBottom: isSelected ? '2px solid #EE6E73' : '2px solid #ffa4a2',
    ...draggableStyle,
  };
}

function getListStyle(isDraggingOver: boolean): React.CSSProperties {
  return {
    background: isDraggingOver ? '#af4448' : '#ffa4a2',
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
            <div className="verticalDivider" />
            <IconButton onClick={() => dispatch({ type: 'ADD_SEGMENT', rowIndex })} size="small">
              <AddIcon />
            </IconButton>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
