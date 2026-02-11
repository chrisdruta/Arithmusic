import { useRef } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useComposition } from '../context/CompositionContext';
import EditorControls from './editor/editor-controls';
import EditorPanel from './editor/editor-panel';
import TrackTimeline from './editor/track-timeline';
import TrackOptions from './editor/track-options';

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

export default function Editor() {
  const { state, dispatch } = useComposition();
  const { timelines, selectedSegment } = state;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const animate = () => {
    timerRef.current = setInterval(() => dispatch({ type: 'ANIMATE_GRAPH' }), 16);
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
          <EditorControls />
          <div className="EditorTimelineContainer">
            {timelines.map((_tl, rowIndex) => (
              <div key={rowIndex} className="EditorTimelineRow">
                <TrackOptions rowIndex={rowIndex} />
                <TrackTimeline rowIndex={rowIndex} />
              </div>
            ))}
          </div>
          {selectedSegmentData ? (
            <EditorPanel />
          ) : (
            <div className="EmptyEditorPanel" />
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
