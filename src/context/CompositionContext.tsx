import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import { parse } from 'mathjs';
import initialState from '../initial-state';
import type {
  AppState,
  CompositionErrors,
  Segment,
  Settings,
  Timeline,
  TimelineOptions,
} from '../types';

// ── Action types ───────────────────────────────────────────────────

type SegmentField = 'title' | 'expression' | 'length' | 'volume';
type ModalKind = 'load' | 'save' | 'settings' | 'alert';

export type Action =
  | { type: 'SETTINGS_CHANGE'; field: string; value?: string }
  | { type: 'TRACK_DATA_CHANGE'; col: number; row: number; field: SegmentField; value: string | number }
  | { type: 'SEGMENT_SELECT'; row: number; col: number }
  | { type: 'SEGMENT_REARRANGE'; rowIndex: number; sourceCol: number; destCol: number; segments: Segment[] }
  | { type: 'SEGMENT_MOVE_CROSS_TRACK'; sourceRow: number; sourceCol: number; destRow: number; destCol: number }
  | { type: 'ADD_SEGMENT'; rowIndex: number }
  | { type: 'DELETE_SEGMENT' }
  | { type: 'TRACK_OPTION_CHANGE'; index: number; field: string; value: TimelineOptions['wave'] | string | null }
  | { type: 'ADD_TRACK' }
  | { type: 'DELETE_TRACK'; rowIndex: number }
  | { type: 'TOGGLE_MODAL'; kind: ModalKind }
  | { type: 'RESET_SETTINGS' }
  | { type: 'SET_ERRORS'; errors: CompositionErrors | null }
  | { type: 'LOAD_COMPOSITION'; timelines: Timeline[]; nextId: number }
  | { type: 'INSERT_SEGMENT'; row: number; col: number; segment: { title: string; expression: string; length: number; volume: number } }
  | { type: 'ANIMATE_GRAPH' };

// ── Pure helpers ───────────────────────────────────────────────────

export function computeErrors(s: AppState): CompositionErrors | null {
  const settingsErrors: string[] = [];
  for (const [key, value] of Object.entries(s.settings)) {
    if (
      value &&
      typeof value === 'object' &&
      'error' in value &&
      (value as { error: string | null }).error &&
      key !== 'graphRange'
    ) {
      settingsErrors.push(key);
    }
  }

  const editorErrors: CompositionErrors['editor'] = [];
  s.timelines.forEach((timeline, rowIndex) => {
    timeline.segments.forEach((segment, colIndex) => {
      for (const [key, value] of Object.entries(segment)) {
        if (value && typeof value === 'object' && 'error' in value && (value as { error: string | null }).error) {
          editorErrors.push({
            key,
            title: segment.title.value,
            row: rowIndex + 1,
            col: colIndex + 1,
          });
        }
      }
    });
  });

  if (settingsErrors.length || editorErrors.length) {
    return { settings: settingsErrors, editor: editorErrors };
  }
  return null;
}

function updateSegmentField(segment: Segment, field: SegmentField, value: string | number): Segment {
  const seg = { ...segment };

  if (field === 'title') {
    const strVal = String(value);
    seg.title = {
      value: strVal,
      error: strVal.length > 0 ? '' : 'Too short',
    };
  } else if (field === 'expression') {
    const strVal = String(value);
    let error: string | null = null;
    if (strVal.length === 0) {
      error = 'Undefined';
    } else {
      try {
        parse(strVal).evaluate({ x: 1 });
      } catch (e: unknown) {
        error = e instanceof Error ? e.message : String(e);
      }
    }
    seg.expression = { value: strVal, error };
  } else if (field === 'length') {
    const parsedVal = parseInt(String(value));
    if (parsedVal >= 0) {
      seg.length = { value: parsedVal, error: null };
    } else if (isNaN(parsedVal)) {
      seg.length = { value: segment.length.value, error: 'Not a number' };
    } else {
      seg.length = { value: segment.length.value, error: "Can't be negative" };
    }
  } else if (field === 'volume') {
    const parsedVal = parseInt(String(value));
    if (parsedVal >= 0) {
      seg.volume = { value: parsedVal, error: null };
    } else if (isNaN(parsedVal)) {
      seg.volume = { value: segment.volume.value, error: 'Not a number' };
    } else {
      seg.volume = { value: segment.volume.value, error: "Can't be negative" };
    }
  }
  return seg;
}

// ── Reducer ────────────────────────────────────────────────────────

function compositionReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SETTINGS_CHANGE': {
      const settings: Record<string, unknown> & typeof state.settings = { ...state.settings };
      let parsedVal = NaN;
      if (action.field !== 'aliasing') {
        parsedVal = parseInt(action.value!);
      }

      if (action.field === 'volume') {
        if (parsedVal >= 0) {
          settings.volume = { value: parsedVal, error: null };
        } else if (isNaN(parsedVal)) {
          settings.volume = { ...settings.volume, error: 'Not a number' };
        } else {
          settings.volume = { ...settings.volume, error: "Can't be negative" };
        }
      } else if (action.field === 'multiplier') {
        if (isNaN(parsedVal)) {
          settings.multiplier = { ...settings.multiplier, error: 'Not a number' };
        } else {
          settings.multiplier = { value: parsedVal, error: null };
        }
      } else if (action.field === 'graphRange') {
        if (isNaN(parsedVal)) {
          settings.graphRange = { ...settings.graphRange, error: 'Not a number' };
        } else if (parsedVal < 0) {
          settings.graphRange = { ...settings.graphRange, error: "Can't be negative" };
        } else {
          settings.graphRange = { value: parsedVal, error: null };
        }
      } else if (action.field === 'fs') {
        if (isNaN(parsedVal)) {
          settings.fs = { ...settings.fs, error: 'Not a number' };
        } else if (parsedVal < 3000) {
          settings.fs = { ...settings.fs, error: 'Must be at least 3000' };
        } else if (parsedVal > 96000) {
          settings.fs = { ...settings.fs, error: 'Must be less than 96000' };
        } else {
          settings.fs = { value: parsedVal, error: null };
        }
      } else if (action.field === 'aliasing') {
        settings.aliasing = !settings.aliasing;
      }

      const next = { ...state, settings };
      return { ...next, compositionErrors: computeErrors(next) };
    }

    case 'TRACK_DATA_CHANGE': {
      const timelines = state.timelines.map((tl, ri) =>
        ri === action.row
          ? {
              ...tl,
              segments: tl.segments.map((seg, ci) =>
                ci === action.col ? updateSegmentField(seg, action.field, action.value) : seg
              ),
            }
          : tl
      );
      const next = { ...state, timelines };
      return { ...next, compositionErrors: computeErrors(next) };
    }

    case 'SEGMENT_SELECT':
      return { ...state, selectedSegment: { row: action.row, col: action.col } };

    case 'SEGMENT_REARRANGE': {
      const timelines = state.timelines.map((tl, ri) =>
        ri === action.rowIndex ? { ...tl, segments: action.segments } : tl
      );
      const selectedSegment = { ...state.selectedSegment };
      if (action.sourceCol === selectedSegment.col && action.rowIndex === selectedSegment.row) {
        selectedSegment.col = action.destCol;
      }
      return { ...state, timelines, selectedSegment };
    }

    case 'SEGMENT_MOVE_CROSS_TRACK': {
      const { sourceRow, sourceCol, destRow, destCol } = action;
      const segment = state.timelines[sourceRow].segments[sourceCol];
      const timelines = state.timelines.map((tl, ri) => {
        if (ri === sourceRow) {
          return { ...tl, segments: tl.segments.filter((_, i) => i !== sourceCol) };
        }
        if (ri === destRow) {
          const newSegments = [...tl.segments];
          newSegments.splice(destCol, 0, segment);
          return { ...tl, segments: newSegments };
        }
        return tl;
      });
      return { ...state, timelines, selectedSegment: { row: destRow, col: destCol } };
    }

    case 'ADD_SEGMENT': {
      const newId = `t${state.nextId}`;
      const timelines = state.timelines.map((tl, ri) =>
        ri === action.rowIndex
          ? {
              ...tl,
              segments: [
                ...tl.segments,
                {
                  id: newId,
                  title: { value: 'New Tab', error: null },
                  expression: { value: '440 + 100 * x', error: null },
                  length: { value: 500, error: null },
                  volume: { value: 100, error: null },
                },
              ],
            }
          : tl
      );
      return { ...state, timelines, nextId: state.nextId + 1 };
    }

    case 'INSERT_SEGMENT': {
      const newId = `t${state.nextId}`;
      const { title, expression, length, volume } = action.segment;
      const newSegment: Segment = {
        id: newId,
        title: { value: title, error: null },
        expression: { value: expression, error: null },
        length: { value: length, error: null },
        volume: { value: volume, error: null },
      };
      const timelines = state.timelines.map((tl, ri) => {
        if (ri !== action.row) return tl;
        const newSegments = [...tl.segments];
        newSegments.splice(action.col, 0, newSegment);
        return { ...tl, segments: newSegments };
      });
      return {
        ...state,
        timelines,
        nextId: state.nextId + 1,
        selectedSegment: { row: action.row, col: action.col },
      };
    }

    case 'DELETE_SEGMENT': {
      const { row, col } = state.selectedSegment;
      const timelines = state.timelines.map((tl, ri) =>
        ri === row ? { ...tl, segments: tl.segments.filter((_, ci) => ci !== col) } : tl
      );
      let newRow = row;
      let newCol = col;
      if (col === 0) {
        if (row > 0) {
          newRow = row - 1;
          newCol = timelines[newRow].segments.length - 1;
        }
      } else {
        newCol = col - 1;
      }
      return { ...state, timelines, selectedSegment: { row: newRow, col: newCol } };
    }

    case 'TRACK_OPTION_CHANGE': {
      const timelines = state.timelines.map((tl, ri) => {
        if (ri !== action.index) return tl;
        const options = { ...tl.options };
        if (action.field === 'title') {
          options.title = action.value as string;
        } else if (action.field === 'wave') {
          options.wave = (action.value ?? 'sine') as TimelineOptions['wave'];
        } else if (action.field === 'mute') {
          options.mute = !options.mute;
        }
        return { ...tl, options };
      });
      return { ...state, timelines };
    }

    case 'ADD_TRACK':
      return {
        ...state,
        timelines: [
          ...state.timelines,
          { options: { title: 'Untitled Track', wave: 'sine' as const, mute: false }, segments: [] },
        ],
      };

    case 'DELETE_TRACK': {
      const timelines = state.timelines.filter((_, ri) => ri !== action.rowIndex);
      const selectedSegment = { ...state.selectedSegment };
      if (selectedSegment.row === action.rowIndex) {
        selectedSegment.row = Math.max(0, selectedSegment.row - 1);
        selectedSegment.col = 0;
      } else if (selectedSegment.row > action.rowIndex) {
        selectedSegment.row--;
      }
      return { ...state, timelines, selectedSegment };
    }

    case 'TOGGLE_MODAL': {
      const showingModals = { ...state.showingModals };
      if (action.kind === 'save' && state.compositionErrors) {
        showingModals.alert = true;
      } else {
        showingModals[action.kind] = !showingModals[action.kind];
      }
      return { ...state, showingModals };
    }

    case 'RESET_SETTINGS': {
      const next: AppState = {
        ...state,
        settings: {
          fs: { value: 44100, error: null },
          volume: { value: 10, error: null },
          multiplier: { value: 1, error: null },
          graphRange: { value: 4000, error: null },
          aliasing: false,
        },
      };
      return { ...next, compositionErrors: computeErrors(next) };
    }

    case 'SET_ERRORS':
      return { ...state, compositionErrors: action.errors };

    case 'LOAD_COMPOSITION': {
      const next: AppState = {
        ...state,
        timelines: action.timelines,
        nextId: action.nextId,
        selectedSegment: { row: 0, col: 0 },
        showingModals: { ...state.showingModals, load: false },
      };
      return { ...next, compositionErrors: computeErrors(next) };
    }

    case 'ANIMATE_GRAPH':
      return { ...state, revision: state.revision + 1 };

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────

const CompositionContext = createContext<{
  state: AppState;
  dispatch: Dispatch<Action>;
} | null>(null);

export function CompositionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(compositionReducer, {
    ...initialState,
    revision: 0,
    nextId: initialState.timelines.reduce((acc, tl) => acc + tl.segments.length, 0),
  });

  return (
    <CompositionContext.Provider value={{ state, dispatch }}>
      {children}
    </CompositionContext.Provider>
  );
}

export function useComposition() {
  const ctx = useContext(CompositionContext);
  if (!ctx) throw new Error('useComposition must be used within CompositionProvider');
  return ctx;
}

// ── Utility functions ──────────────────────────────────────────────

export function exportCompositionJson(timelines: Timeline[]): string {
  const minimizedJson: Array<{ options: TimelineOptions; segments: unknown[] }> = [];

  timelines.forEach((timeline) => {
    const segments: unknown[] = [];
    timeline.segments.forEach((segment) => {
      let expr: { toString(): string } = { toString: () => '' };
      try {
        const parsed = parse(segment.expression.value);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parsed.traverse((node: any) => {
          if (node.type === 'OperatorNode' && node.op === '*' && node.implicit) {
            node.implicit = !node.implicit;
          }
        });
        expr = parsed;
      } catch {
        /* Doesn't matter because save is disabled on errors */
      }
      segments.push({
        title: segment.title.value,
        expression: expr.toString(),
        length: segment.length.value,
        volume: segment.volume.value,
      });
    });
    minimizedJson.push({ options: timeline.options, segments });
  });

  return JSON.stringify(minimizedJson);
}

export function loadCompositionJson(
  json: string,
  dispatch: Dispatch<Action>,
): string | undefined {
  let parsedJson;
  try {
    parsedJson = JSON.parse(json);
  } catch {
    return 'Invalid JSON';
  }

  if (!Array.isArray(parsedJson)) {
    return 'Unexpected format';
  }

  let id = 0;
  try {
    for (let rowIndex = 0; rowIndex < parsedJson.length; rowIndex++) {
      for (let colIndex = 0; colIndex < parsedJson[rowIndex].segments.length; colIndex++) {
        const oldSegment = { ...parsedJson[rowIndex].segments[colIndex] };
        const segmentId = `t${id}`;

        let seg: Segment = {
          id: segmentId,
          title: { value: oldSegment.title, error: null },
          expression: { value: oldSegment.expression, error: null },
          length: { value: oldSegment.length, error: null },
          volume: { value: oldSegment.volume, error: null },
        };

        seg = updateSegmentField(seg, 'title', oldSegment.title);
        seg = updateSegmentField(seg, 'expression', oldSegment.expression);
        seg = updateSegmentField(seg, 'length', oldSegment.length);
        seg = updateSegmentField(seg, 'volume', oldSegment.volume);
        parsedJson[rowIndex].segments[colIndex] = seg;
        id++;
      }
    }
  } catch (e: unknown) {
    return e instanceof Error ? e.message : String(e);
  }

  dispatch({ type: 'LOAD_COMPOSITION', timelines: parsedJson as Timeline[], nextId: id });
}
