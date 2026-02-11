import { simplify } from 'mathjs';
import type { Segment, Settings, Timeline, TimelineOptions } from '../types';

function rangeArray(start: number, end: number, step: number): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

const waveFunctions: Record<TimelineOptions['wave'], (x: number) => number> = {
  sine: (x) => Math.sin(x),
  triangle: (x) => (2 / Math.PI) * Math.asin(Math.sin(x)),
  saw: (x) => (1 / Math.PI) * Math.atan(Math.tan(x / 2 + Math.PI / 2)),
};

export function SampleTrackGraph(
  segments: Segment[] | null,
  multiplier: number
): Array<{ mode: string; x: number[]; y: number[] }> | undefined {
  if (segments === null) return undefined;
  const data: Array<{ mode: string; x: number[]; y: number[] }> = [];

  segments.forEach((segment, index) => {
    const lengthMs = !segment.length.error ? segment.length.value : 0;
    let offsetMs = 0;
    for (let i = 0; i < index; i++) {
      offsetMs += !segments[i].length.error ? segments[i].length.value : 0;
    }

    const sampleInput = rangeArray(0, lengthMs / 1000, 1 / 1000);
    const func = (!segment.expression.error
      ? simplify(segment.expression.value)
      : simplify('0')
    ).compile();
    const sampleOutput = sampleInput.map((x) => func.evaluate({ x: multiplier * x }) as number);
    const shiftedSampleInput = sampleInput.map((x) => x + offsetMs / 1000);

    data.push({
      mode: 'lines',
      x: shiftedSampleInput,
      y: sampleOutput,
    });
  });
  return data;
}

export function SynthesizeComposition(timelines: Timeline[], settings: Settings): Float32Array {
  const { volume, multiplier, fs, aliasing } = settings;

  let maxLengthMs = 0;
  timelines.forEach((timeline) => {
    let trackLengthMs = 0;
    timeline.segments.forEach((segment) => {
      trackLengthMs += !segment.length.error ? segment.length.value : 0;
    });
    if (trackLengthMs > maxLengthMs) maxLengthMs = trackLengthMs;
  });

  const bufferSize = (maxLengthMs / 1000) * fs.value;
  const rawBuffer = new Float32Array(bufferSize + 1);

  timelines.forEach((timeline) => {
    let bufferIndex = 1;
    const phase = new Float32Array(bufferSize + 1);
    const waveFunc = waveFunctions[timeline.options.wave];
    const muteMultiplier = timeline.options.mute ? 0 : 1;

    timeline.segments.forEach((segment) => {
      const func = simplify(segment.expression.value);
      for (let i = 0; i <= segment.length.value / 1000; i += 1 / fs.value) {
        let tone = func.evaluate({ x: multiplier.value * i }) as number;

        if (!aliasing && (tone > fs.value / 2 || tone < 0)) tone = 0;
        const volMultiplier =
          (segment.volume.value * volume.value) / 10000 * muteMultiplier;

        phase[bufferIndex] =
          phase[bufferIndex - 1] + (2 * Math.PI * tone) / fs.value;
        if (phase[bufferIndex] > 2 * Math.PI)
          phase[bufferIndex] -= 2 * Math.PI;
        else if (phase[bufferIndex] < -2 * Math.PI)
          phase[bufferIndex] += 2 * Math.PI;

        rawBuffer[bufferIndex] += volMultiplier * waveFunc(phase[bufferIndex]);
        bufferIndex++;
      }
    });
  });

  return rawBuffer;
}
