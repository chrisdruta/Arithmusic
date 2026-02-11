import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-basic-dist-min';
import { SampleTrackGraph } from '../api/synthesize';
import { useComposition } from '../context/CompositionContext';

const Plot = createPlotlyComponent(Plotly);

export default function Graph() {
  const { state } = useComposition();
  const { revision, settings, timelines, selectedSegment } = state;
  const data = timelines[selectedSegment.row]?.segments ?? null;

  return (
    <Plot
      className="Graph"
      useResizeHandler
      revision={revision}
      config={{ displayModeBar: false }}
      data={SampleTrackGraph(data, settings.multiplier.value) ?? []}
      layout={{
        showlegend: false,
        autosize: true,
        xaxis: { title: 'Time (s)' },
        yaxis: {
          title: 'Frequency (Hz)<br />&nbsp;',
          range: [0, settings.graphRange.value],
        },
        margin: { t: 40, l: 85, r: 50, b: 80, pad: 5 },
      }}
    />
  );
}
