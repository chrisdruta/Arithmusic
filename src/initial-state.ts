import type { AppState } from './types';

const initialState: Omit<AppState, 'revision'> = {
  selectedSegment: { row: 0, col: 0 },
  compositionErrors: null,
  settings: {
    fs: { value: 44100, error: '' },
    volume: { value: 10, error: '' },
    multiplier: { value: 1, error: '' },
    graphRange: { value: 4000, error: '' },
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
      options: { title: 'C2 Steps', wave: 'sine', mute: false },
      segments: [
        { id: 't0', title: { value: 'C2', error: '' }, expression: { value: '65.41', error: '' }, length: { value: 500, error: '' }, volume: { value: 100, error: '' } },
        { id: 't1', title: { value: 'D2', error: '' }, expression: { value: '73.42', error: '' }, length: { value: 500, error: '' }, volume: { value: 100, error: '' } },
        { id: 't2', title: { value: 'E2', error: '' }, expression: { value: '82.41', error: '' }, length: { value: 500, error: '' }, volume: { value: 100, error: '' } },
        { id: 't3', title: { value: 'F2', error: '' }, expression: { value: '87.31', error: '' }, length: { value: 500, error: '' }, volume: { value: 100, error: '' } },
        { id: 't4', title: { value: 'G2', error: '' }, expression: { value: '98', error: '' }, length: { value: 500, error: '' }, volume: { value: 100, error: '' } },
        { id: 't5', title: { value: 'A3', error: '' }, expression: { value: '110', error: '' }, length: { value: 500, error: '' }, volume: { value: 100, error: '' } },
        { id: 't6', title: { value: 'B2', error: '' }, expression: { value: '123.47', error: '' }, length: { value: 500, error: '' }, volume: { value: 100, error: '' } },
        { id: 't7', title: { value: 'C3', error: '' }, expression: { value: '130.81', error: '' }, length: { value: 500, error: '' }, volume: { value: 100, error: '' } },
      ],
    },
    {
      options: { title: 'C2 Linear', wave: 'sine', mute: false },
      segments: [
        { id: 't8', title: { value: 'Delay', error: '' }, expression: { value: '0', error: '' }, length: { value: 4000, error: '' }, volume: { value: 100, error: '' } },
        { id: 't9', title: { value: 'Linear Eqn', error: '' }, expression: { value: '130.81 + x * (65.41 - 130.81) / 4', error: '' }, length: { value: 4000, error: '' }, volume: { value: 100, error: '' } },
      ],
    },
  ],
};

export default initialState;
