import { useMemo } from 'react';
import { ParentSize } from '@visx/responsive';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows, GridColumns } from '@visx/grid';
import { curveLinear } from '@visx/curve';
import { SampleTrackGraph } from '../lib/synthesize';
import { useComposition } from '../context/CompositionContext';

const margin = { top: 40, left: 95, right: 50, bottom: 85 };
const fontFamily = '"Share Tech Mono", monospace';
const trackColors = [
  'var(--color-lcd-green)',
  'var(--color-amber)',
  'var(--color-func-blue)',
  'var(--color-accent)',
];
const dimOpacity = 0.3;
const gridColor = 'var(--color-lcd-grid)';
const bgColor = 'var(--color-lcd-bg)';
const textColor = 'var(--color-lcd-dim)';
const tickColor = 'var(--color-lcd-green)';

function Chart({ width, height, playbackTime }: { width: number; height: number; playbackTime: number | null }) {
  const { state } = useComposition();
  const { settings, timelines, selectedSegment } = state;

  const allTraces = useMemo(
    () =>
      timelines.map((timeline) =>
        SampleTrackGraph(timeline.segments, settings.multiplier.value) ?? []
      ),
    [timelines, settings.multiplier.value]
  );

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  if (innerWidth <= 0 || innerHeight <= 0) return null;

  const xMax = allTraces.reduce(
    (max, traces) =>
      traces.reduce(
        (m, t) => Math.max(m, t.x.length > 0 ? t.x[t.x.length - 1] : 0),
        max
      ),
    0
  );

  const xScale = scaleLinear<number>({
    domain: [0, xMax || 1],
    range: [0, innerWidth],
  });

  const yScale = scaleLinear<number>({
    domain: [0, settings.graphRange.value || 1],
    range: [innerHeight, 0],
  });

  return (
    <svg width={width} height={height}>
      <defs>
        <filter id="playhead-glow-wide" filterUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="playhead-glow-med" filterUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <filter id="playhead-glow" filterUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x={margin.left} y={margin.top} width={innerWidth} height={innerHeight} fill={bgColor} />
      <Group left={margin.left} top={margin.top}>
        <GridRows scale={yScale} width={innerWidth} stroke={gridColor} />
        <GridColumns scale={xScale} height={innerHeight} stroke={gridColor} />
        {/* Render non-selected timelines first (dimmed), then selected on top */}
        {allTraces.map((traces, trackIdx) => {
          if (trackIdx === selectedSegment.row) return null;
          const color = trackColors[trackIdx % trackColors.length];
          return traces.map((trace, segIdx) => {
            const points = trace.x.map((xVal, j) => ({ x: xVal, y: trace.y[j] }));
            return (
              <LinePath
                key={`${trackIdx}-${segIdx}`}
                data={points}
                x={(d) => xScale(d.x)}
                y={(d) => yScale(d.y)}
                stroke={color}
                strokeWidth={1.5}
                strokeOpacity={dimOpacity}
                curve={curveLinear}
              />
            );
          });
        })}
        {(allTraces[selectedSegment.row] ?? []).map((trace, segIdx) => {
          const color = trackColors[selectedSegment.row % trackColors.length];
          const points = trace.x.map((xVal, j) => ({ x: xVal, y: trace.y[j] }));
          return (
            <LinePath
              key={`selected-${segIdx}`}
              data={points}
              x={(d) => xScale(d.x)}
              y={(d) => yScale(d.y)}
              stroke={color}
              strokeWidth={2}
              curve={curveLinear}
            />
          );
        })}
        <AxisBottom
          top={innerHeight}
          scale={xScale}
          label="Time (s)"
          labelProps={{ fill: textColor, fontSize: 16, fontFamily, textAnchor: 'middle', dy: 12 }}
          tickLabelProps={{ fill: tickColor, fontSize: 14, fontFamily }}
          stroke={gridColor}
          tickStroke={gridColor}
        />
        <AxisLeft
          scale={yScale}
          label="Frequency (kHz)"
          labelProps={{ fill: textColor, fontSize: 16, fontFamily, textAnchor: 'middle', dx: -18 }}
          tickFormat={(v) => (Number(v) / 1000).toFixed(1)}
          tickLabelProps={{ fill: tickColor, fontSize: 14, fontFamily }}
          stroke={gridColor}
          tickStroke={gridColor}
        />
        {playbackTime !== null && playbackTime >= 0 && playbackTime <= xMax && (
          <>
            {/* Soft phosphor glow layer */}
            <line
              x1={xScale(playbackTime)}
              x2={xScale(playbackTime)}
              y1={0}
              y2={innerHeight}
              stroke="var(--color-lcd-green)"
              strokeWidth={6}
              strokeOpacity={0.1}
              filter="url(#playhead-glow)"
            />
            {/* Main segmented line */}
            <line
              x1={xScale(playbackTime)}
              x2={xScale(playbackTime)}
              y1={0}
              y2={innerHeight}
              stroke="var(--color-lcd-green)"
              strokeWidth={1.5}
              strokeOpacity={0.9}
              strokeDasharray="8 4"
              filter="url(#playhead-glow)"
            />
            {/* Top tick mark */}
            <line
              x1={xScale(playbackTime) - 5}
              x2={xScale(playbackTime) + 5}
              y1={0}
              y2={0}
              stroke="var(--color-lcd-green)"
              strokeWidth={2}
              strokeOpacity={0.9}
              filter="url(#playhead-glow)"
            />
            {/* Bottom tick mark */}
            <line
              x1={xScale(playbackTime) - 5}
              x2={xScale(playbackTime) + 5}
              y1={innerHeight}
              y2={innerHeight}
              stroke="var(--color-lcd-green)"
              strokeWidth={2}
              strokeOpacity={0.9}
              filter="url(#playhead-glow)"
            />
          </>
        )}
      </Group>
    </svg>
  );
}

export default function Graph({ playbackTime }: { playbackTime: number | null }) {
  return (
    <div className="lcd-scanlines lcd-pixel-grid relative mx-2.5 my-2 min-h-0 flex-1 overflow-hidden rounded-sm border-2 border-border bg-lcd-bg shadow-[inset_0_1px_3px_rgba(0,0,0,0.5),0_0_6px_rgba(51,255,102,0.08)]">
      <ParentSize>
        {({ width, height }) => <Chart width={width} height={height} playbackTime={playbackTime} />}
      </ParentSize>
    </div>
  );
}
