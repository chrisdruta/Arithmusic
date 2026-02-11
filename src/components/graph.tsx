import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-basic-dist-min';
import { SampleTrackGraph } from '../api/synthesize';
import type { Segment } from '../types';

const Plot = createPlotlyComponent(Plotly);

interface GraphProps {
  revision: number;
  multiplier: number;
  upperRange: number;
  data: Segment[] | null;
}

export default function Graph({ revision, multiplier, upperRange, data }: GraphProps) {
  return (
    <Plot
      className="Graph"
      useResizeHandler
      revision={revision}
      config={{ displayModeBar: false }}
      data={SampleTrackGraph(data, multiplier) ?? []}
      layout={{
        showlegend: false,
        autosize: true,
        xaxis: { title: 'Time (s)' },
        yaxis: {
          title: 'Frequency (Hz)<br />&nbsp;',
          range: [0, upperRange],
        },
        margin: { t: 40, l: 85, r: 50, b: 80, pad: 5 },
      }}
    />
  );
}
