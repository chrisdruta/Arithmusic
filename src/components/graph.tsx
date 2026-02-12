import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-basic-dist-min';
import { SampleTrackGraph } from '../lib/synthesize';
import { useComposition } from '../context/CompositionContext';

const Plot = createPlotlyComponent(Plotly);

export default function Graph() {
  const { state } = useComposition();
  const { revision, settings, timelines, selectedSegment } = state;
  const data = timelines[selectedSegment.row]?.segments ?? null;

  return (
    <Plot
      className="w-full min-h-0 flex-1"
      useResizeHandler
      revision={revision}
      config={{ displayModeBar: false }}
      data={SampleTrackGraph(data, settings.multiplier.value) ?? []}
      layout={{
        showlegend: false,
        autosize: true,
        paper_bgcolor: 'transparent',
        plot_bgcolor: '#1a1a24',
        font: { color: '#f0f0f5' },
        xaxis: {
          title: 'Time (s)',
          gridcolor: '#2a2a3a',
          zerolinecolor: '#2a2a3a',
        },
        yaxis: {
          title: 'Frequency (Hz)<br />&nbsp;',
          range: [0, settings.graphRange.value],
          gridcolor: '#2a2a3a',
          zerolinecolor: '#2a2a3a',
        },
        margin: { t: 40, l: 85, r: 50, b: 80, pad: 5 },
      }}
    />
  );
}
