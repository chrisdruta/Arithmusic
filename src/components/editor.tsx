import { useRef } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import EditorControls from './editor/editor-controls';
import EditorPanel from './editor/editor-panel';
import TrackTimeline from './editor/track-timeline';
import TrackOptions from './editor/track-options';
import type { SelectedSegment, Segment, Timeline, TimelineOptions } from '../types';

interface EditorProps {
  animateGraph: () => void;
  timelines: Timeline[];
  selectedSegment: SelectedSegment;
  onSegmentSelection: (row: number, col: number) => void;
  onSegmentRearrange: (rowIndex: number, src: number, dest: number, segments: Segment[]) => void;
  onAddTrack: () => void;
  onDeleteTrack: (rowIndex: number) => void;
  onTrackOptionChange: (index: number, field: string, value: TimelineOptions['wave'] | string | null) => void;
  onTrackDataChange: (col: number, row: number, field: 'title' | 'expression' | 'length' | 'volume', value: string | number) => void;
  onAddSegment: (rowIndex: number) => void;
  onDeleteSegment: () => void;
  toggleModal: (kind: 'load' | 'save' | 'settings' | 'alert') => void;
}

const accordionSx = {
  width: '100%',
  backgroundColor: '#ffa4a2',
  flex: 0,
  '&.Mui-expanded': { margin: 0 },
};

const detailsSx = {
  width: '100%',
  backgroundColor: 'black',
  padding: 0,
};

export default function Editor({
  animateGraph,
  timelines,
  selectedSegment,
  onSegmentSelection,
  onSegmentRearrange,
  onAddTrack,
  onDeleteTrack,
  onTrackOptionChange,
  onTrackDataChange,
  onAddSegment,
  onDeleteSegment,
  toggleModal,
}: EditorProps) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const animate = () => {
    timerRef.current = setInterval(animateGraph, 16);
  };
  const stopAnimate = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const selectedSegmentData =
    timelines[selectedSegment.row]?.segments[selectedSegment.col];

  return (
    <Accordion
      defaultExpanded
      sx={accordionSx}
      slotProps={{
        transition: {
          onEnter: animate,
          onEntered: stopAnimate,
          onExit: animate,
          onExited: stopAnimate,
        },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
          Timeline Editor
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={detailsSx}>
        <div className="Editor">
          <EditorControls onAddTrack={onAddTrack} toggleModal={toggleModal} />
          <div className="EditorTimelineContainer">
            {timelines.map((tl, rowIndex) => (
              <div key={rowIndex} className="EditorTimelineRow">
                <TrackOptions
                  options={tl.options}
                  rowIndex={rowIndex}
                  onTrackOptionChange={onTrackOptionChange}
                  onDeleteTrack={onDeleteTrack}
                />
                <TrackTimeline
                  segments={tl.segments}
                  rowIndex={rowIndex}
                  selectedSegment={selectedSegment}
                  onSegmentSelection={onSegmentSelection}
                  onSegmentRearrange={onSegmentRearrange}
                  onAddSegment={onAddSegment}
                />
              </div>
            ))}
          </div>
          {selectedSegmentData ? (
            <EditorPanel
              title={selectedSegmentData.title}
              expression={selectedSegmentData.expression}
              length={selectedSegmentData.length}
              volume={selectedSegmentData.volume}
              onTrackDataChange={onTrackDataChange}
              onDeleteSegment={onDeleteSegment}
              timelines={timelines}
              selectedSegment={selectedSegment}
            />
          ) : (
            <div className="EmptyEditorPanel" />
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
