export interface ValidatedField<T = string> {
  value: T;
  error: string | null;
}

export interface Segment {
  id: string;
  title: ValidatedField;
  expression: ValidatedField;
  length: ValidatedField<number>;
  volume: ValidatedField<number>;
}

export interface TimelineOptions {
  title: string;
  wave: 'sine' | 'triangle' | 'saw';
  mute: boolean;
}

export interface Timeline {
  options: TimelineOptions;
  segments: Segment[];
}

export interface Settings {
  fs: ValidatedField<number>;
  volume: ValidatedField<number>;
  multiplier: ValidatedField<number>;
  graphRange: ValidatedField<number>;
  aliasing: boolean;
}

export interface SelectedSegment {
  row: number;
  col: number;
}

export interface ShowingModals {
  load: boolean;
  save: boolean;
  settings: boolean;
  alert: boolean;
}

export interface CompositionErrors {
  settings: string[];
  editor: { key: string; title: string; row: number; col: number }[];
}

export interface AppState {
  selectedSegment: SelectedSegment;
  compositionErrors: CompositionErrors | null;
  settings: Settings;
  showingModals: ShowingModals;
  timelines: Timeline[];
  revision: number;
  nextId: number;
}
