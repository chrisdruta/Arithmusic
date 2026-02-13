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
const lineColors = ['#33ff66', '#66ff99', '#00cc44', '#99ffbb'];
const gridColor = '#0d2e0d';
const bgColor = '#0a1a0a';
const textColor = '#1a6633';
const tickColor = '#33ff66';

function Chart({ width, height }: { width: number; height: number }) {
  const { state } = useComposition();
  const { settings, timelines, selectedSegment } = state;
  const segments = timelines[selectedSegment.row]?.segments ?? null;

  const traces = useMemo(
    () => SampleTrackGraph(segments, settings.multiplier.value) ?? [],
    [segments, settings.multiplier.value]
  );

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  if (innerWidth <= 0 || innerHeight <= 0) return null;

  const xMax = traces.reduce(
    (max, t) => Math.max(max, t.x.length > 0 ? t.x[t.x.length - 1] : 0),
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
      <rect x={margin.left} y={margin.top} width={innerWidth} height={innerHeight} fill={bgColor} />
      <Group left={margin.left} top={margin.top}>
        <GridRows scale={yScale} width={innerWidth} stroke={gridColor} />
        <GridColumns scale={xScale} height={innerHeight} stroke={gridColor} />
        {traces.map((trace, i) => {
          const points = trace.x.map((xVal, j) => ({ x: xVal, y: trace.y[j] }));
          return (
            <LinePath
              key={i}
              data={points}
              x={(d) => xScale(d.x)}
              y={(d) => yScale(d.y)}
              stroke={lineColors[i % lineColors.length]}
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
      </Group>
    </svg>
  );
}

export default function Graph() {
  return (
    <div className="lcd-screen lcd-pixel-grid m-2 min-h-0 flex-1 overflow-hidden border-2 border-[#3a3a38] rounded-sm">
      <ParentSize>
        {({ width, height }) => <Chart width={width} height={height} />}
      </ParentSize>
    </div>
  );
}
