import type { AppState } from './types';

const initialState: Omit<AppState, 'revision' | 'nextId'> = {
  selectedSegment: { row: 0, col: 0 },
  compositionErrors: null,
  settings: {
    fs: { value: 44100, error: null },
    volume: { value: 10, error: null },
    multiplier: { value: 1, error: null },
    graphRange: { value: 4000, error: null },
    aliasing: false,
  },
  showingModals: {
    load: false,
    save: false,
    settings: false,
    alert: false,
  },
  timelines: [
    {
      options: { title: 'Am Arpeggio', wave: 'sine', mute: false },
      segments: [
        { id: 't0', title: { value: 'A4', error: null }, expression: { value: '440', error: null }, length: { value: 200, error: null }, volume: { value: 100, error: null } },
        { id: 't1', title: { value: 'C5', error: null }, expression: { value: '523.25', error: null }, length: { value: 200, error: null }, volume: { value: 100, error: null } },
        { id: 't2', title: { value: 'E5', error: null }, expression: { value: '659.26', error: null }, length: { value: 200, error: null }, volume: { value: 100, error: null } },
        { id: 't3', title: { value: 'G5', error: null }, expression: { value: '783.99', error: null }, length: { value: 200, error: null }, volume: { value: 100, error: null } },
        { id: 't4', title: { value: 'A5', error: null }, expression: { value: '880', error: null }, length: { value: 600, error: null }, volume: { value: 100, error: null } },
        { id: 't5', title: { value: 'E5', error: null }, expression: { value: '659.26', error: null }, length: { value: 300, error: null }, volume: { value: 80, error: null } },
        { id: 't6', title: { value: 'A4', error: null }, expression: { value: '440', error: null }, length: { value: 1100, error: null }, volume: { value: 60, error: null } },
      ],
    },
    {
      options: { title: 'Octave Sweep', wave: 'sine', mute: false },
      segments: [
        { id: 't7', title: { value: 'Glide Up', error: null }, expression: { value: '220 + 220 * x', error: null }, length: { value: 1000, error: null }, volume: { value: 70, error: null } },
        { id: 't8', title: { value: 'Glide Down', error: null }, expression: { value: '440 - 220 * x', error: null }, length: { value: 1800, error: null }, volume: { value: 70, error: null } },
      ],
    },
    {
      options: { title: 'Bass Pulse', wave: 'triangle', mute: false },
      segments: [
        { id: 't9', title: { value: 'Root', error: null }, expression: { value: '110', error: null }, length: { value: 1000, error: null }, volume: { value: 100, error: null } },
        { id: 't10', title: { value: 'Fifth', error: null }, expression: { value: '164.81', error: null }, length: { value: 500, error: null }, volume: { value: 90, error: null } },
        { id: 't11', title: { value: 'Root', error: null }, expression: { value: '110', error: null }, length: { value: 1300, error: null }, volume: { value: 100, error: null } },
      ],
    },
  ],
};

export default initialState;
