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
      options: { title: 'C2 Steps', wave: 'sine', mute: false },
      segments: [
        { id: 't0', title: { value: 'C2', error: null }, expression: { value: '65.41', error: null }, length: { value: 500, error: null }, volume: { value: 100, error: null } },
        { id: 't1', title: { value: 'D2', error: null }, expression: { value: '73.42', error: null }, length: { value: 500, error: null }, volume: { value: 100, error: null } },
        { id: 't2', title: { value: 'E2', error: null }, expression: { value: '82.41', error: null }, length: { value: 500, error: null }, volume: { value: 100, error: null } },
        { id: 't3', title: { value: 'F2', error: null }, expression: { value: '87.31', error: null }, length: { value: 500, error: null }, volume: { value: 100, error: null } },
        { id: 't4', title: { value: 'G2', error: null }, expression: { value: '98', error: null }, length: { value: 500, error: null }, volume: { value: 100, error: null } },
        { id: 't5', title: { value: 'A3', error: null }, expression: { value: '110', error: null }, length: { value: 500, error: null }, volume: { value: 100, error: null } },
        { id: 't6', title: { value: 'B2', error: null }, expression: { value: '123.47', error: null }, length: { value: 500, error: null }, volume: { value: 100, error: null } },
        { id: 't7', title: { value: 'C3', error: null }, expression: { value: '130.81', error: null }, length: { value: 500, error: null }, volume: { value: 100, error: null } },
      ],
    },
    {
      options: { title: 'C2 Linear', wave: 'sine', mute: false },
      segments: [
        { id: 't8', title: { value: 'Delay', error: null }, expression: { value: '0', error: null }, length: { value: 4000, error: null }, volume: { value: 100, error: null } },
        { id: 't9', title: { value: 'Linear Eqn', error: null }, expression: { value: '130.81 + x * (65.41 - 130.81) / 4', error: null }, length: { value: 4000, error: null }, volume: { value: 100, error: null } },
      ],
    },
  ],
};

export default initialState;
