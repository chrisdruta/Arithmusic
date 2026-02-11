import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { Segment, SelectedSegment } from '../../types';

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

interface TrackTimelineProps {
  segments: Segment[];
  rowIndex: number;
  selectedSegment: SelectedSegment;
  onSegmentSelection: (row: number, col: number) => void;
  onSegmentRearrange: (rowIndex: number, src: number, dest: number, segments: Segment[]) => void;
  onAddSegment: (rowIndex: number) => void;
}

export default function TrackTimeline({
  segments,
  rowIndex,
  selectedSegment,
  onSegmentSelection,
  onSegmentRearrange,
  onAddSegment,
}: TrackTimelineProps) {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = reorder(segments, result.source.index, result.destination.index);
    onSegmentRearrange(rowIndex, result.source.index, result.destination.index, reordered);
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
                    onClick={() => onSegmentSelection(rowIndex, colIndex)}
                  >
                    {segment.title.value}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <div className="verticalDivider" />
            <IconButton onClick={() => onAddSegment(rowIndex)} size="small">
              <AddIcon />
            </IconButton>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
