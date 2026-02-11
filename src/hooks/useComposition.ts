import { useState, useRef, useCallback } from 'react';
import { parse, simplify } from 'mathjs';
import initialState from '../initial-state';
import type {
  AppState,
  CompositionErrors,
  Segment,
  Settings,
  Timeline,
  TimelineOptions,
} from '../types';

type SettingsField = keyof Omit<Settings, 'aliasing'> | 'aliasing';
type SegmentField = 'title' | 'expression' | 'length' | 'volume';
type ModalKind = 'load' | 'save' | 'settings' | 'alert';

function computeErrors(s: AppState): CompositionErrors | null {
  const settingsErrors: string[] = [];
  for (const [key, value] of Object.entries(s.settings)) {
    if (
      value &&
      typeof value === 'object' &&
      'error' in value &&
      (value as { error: string }).error &&
      key !== 'graphRange'
    ) {
      settingsErrors.push(key);
    }
  }

  const editorErrors: CompositionErrors['editor'] = [];
  s.timelines.forEach((timeline, rowIndex) => {
    timeline.segments.forEach((segment, colIndex) => {
      for (const [key, value] of Object.entries(segment)) {
        if (value && typeof value === 'object' && 'error' in value && (value as { error: string }).error) {
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
    let error = '';
    if (strVal.length === 0) {
      error = 'Undefined';
    } else {
      try {
        const parsedMath = simplify(strVal);
        parsedMath.evaluate({ x: 1 });
      } catch (e: unknown) {
        error = e instanceof Error ? e.message : String(e);
      }
    }
    seg.expression = { value: strVal, error };
  } else if (field === 'length') {
    const parsedVal = parseInt(String(value));
    if (parsedVal >= 0) {
      seg.length = { value: parsedVal, error: '' };
    } else if (isNaN(parsedVal)) {
      seg.length = { value: segment.length.value, error: 'Not a number' };
    } else {
      seg.length = { value: segment.length.value, error: "Can't be negative" };
    }
  } else if (field === 'volume') {
    const parsedVal = parseInt(String(value));
    if (parsedVal >= 0) {
      seg.volume = { value: parsedVal, error: '' };
    } else if (isNaN(parsedVal)) {
      seg.volume = { value: segment.volume.value, error: 'Not a number' };
    } else {
      seg.volume = { value: segment.volume.value, error: "Can't be negative" };
    }
  }
  return seg;
}

export default function useComposition() {
  const [state, setState] = useState<AppState>(() => ({
    ...initialState,
    revision: 0,
  }));

  const idCount = useRef(
    initialState.timelines.reduce((acc, tl) => acc + tl.segments.length, 0)
  );

  // ── Error checking ──────────────────────────────────────────────

  const getCompositionErrors = useCallback((): CompositionErrors | null => {
    let errors: CompositionErrors | null = null;
    setState((prev) => {
      errors = computeErrors(prev);
      return { ...prev, compositionErrors: errors };
    });
    return errors;
  }, []);

  // ── Settings ────────────────────────────────────────────────────

  const settingsChange = useCallback((field: string, value?: string) => {
    setState((prev) => {
      const settings: Record<string, unknown> & typeof prev.settings = { ...prev.settings };
      let parsedVal = NaN;
      if (field !== 'aliasing') {
        parsedVal = parseInt(value!);
      }

      if (field === 'volume') {
        if (parsedVal >= 0) {
          settings.volume = { value: parsedVal, error: '' };
        } else if (isNaN(parsedVal)) {
          settings.volume = { ...settings.volume, error: 'Not a number' };
        } else {
          settings.volume = { ...settings.volume, error: "Can't be negative" };
        }
      } else if (field === 'multiplier') {
        if (isNaN(parsedVal)) {
          settings.multiplier = { ...settings.multiplier, error: 'Not a number' };
        } else {
          settings.multiplier = { value: parsedVal, error: '' };
        }
      } else if (field === 'graphRange') {
        if (isNaN(parsedVal)) {
          settings.graphRange = { ...settings.graphRange, error: 'Not a number' };
        } else if (parsedVal < 0) {
          settings.graphRange = { ...settings.graphRange, error: "Can't be negative" };
        } else {
          settings.graphRange = { value: parsedVal, error: '' };
        }
      } else if (field === 'fs') {
        if (isNaN(parsedVal)) {
          settings.fs = { ...settings.fs, error: 'Not a number' };
        } else if (parsedVal < 3000) {
          settings.fs = { ...settings.fs, error: 'Must be at least 3000' };
        } else if (parsedVal > 96000) {
          settings.fs = { ...settings.fs, error: 'Must be less than 96000' };
        } else {
          settings.fs = { value: parsedVal, error: '' };
        }
      } else if (field === 'aliasing') {
        settings.aliasing = !settings.aliasing;
      }

      const next = { ...prev, settings };
      return { ...next, compositionErrors: computeErrors(next) };
    });
  }, []);

  // ── Track data changes ──────────────────────────────────────────

  const trackDataChange = useCallback(
    (col: number, row: number, field: SegmentField, value: string | number) => {
      setState((prev) => {
        const timelines = prev.timelines.map((tl, ri) =>
          ri === row
            ? {
                ...tl,
                segments: tl.segments.map((seg, ci) =>
                  ci === col ? updateSegmentField(seg, field, value) : seg
                ),
              }
            : tl
        );
        const next = { ...prev, timelines };
        return { ...next, compositionErrors: computeErrors(next) };
      });
    },
    []
  );

  // ── Editor state changes ────────────────────────────────────────

  const segmentSelection = useCallback((row: number, col: number) => {
    setState((prev) => ({ ...prev, selectedSegment: { row, col } }));
  }, []);

  const segmentRearrange = useCallback(
    (rowIndex: number, sourceCol: number, destCol: number, segments: Segment[]) => {
      setState((prev) => {
        const timelines = prev.timelines.map((tl, ri) =>
          ri === rowIndex ? { ...tl, segments } : tl
        );
        const selectedSegment = { ...prev.selectedSegment };
        if (sourceCol === selectedSegment.col && rowIndex === selectedSegment.row) {
          selectedSegment.col = destCol;
        }
        return { ...prev, timelines, selectedSegment };
      });
    },
    []
  );

  const addSegment = useCallback((rowIndex: number) => {
    setState((prev) => {
      const newId = `t${++idCount.current}`;
      const timelines = prev.timelines.map((tl, ri) =>
        ri === rowIndex
          ? {
              ...tl,
              segments: [
                ...tl.segments,
                {
                  id: newId,
                  title: { value: 'New Tab', error: '' },
                  expression: { value: '440 + 100 * x', error: '' },
                  length: { value: 500, error: '' },
                  volume: { value: 100, error: '' },
                },
              ],
            }
          : tl
      );
      return { ...prev, timelines };
    });
  }, []);

  const deleteSegment = useCallback(() => {
    setState((prev) => {
      const { row, col } = prev.selectedSegment;
      const timelines = prev.timelines.map((tl, ri) =>
        ri === row
          ? { ...tl, segments: tl.segments.filter((_, ci) => ci !== col) }
          : tl
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

      return {
        ...prev,
        timelines,
        selectedSegment: { row: newRow, col: newCol },
      };
    });
  }, []);

  const trackOptionChange = useCallback(
    (index: number, field: string, value: TimelineOptions['wave'] | string | null) => {
      setState((prev) => {
        const timelines = prev.timelines.map((tl, ri) => {
          if (ri !== index) return tl;
          const options = { ...tl.options };
          if (field === 'title') {
            options.title = value as string;
          } else if (field === 'wave') {
            options.wave = (value ?? 'sine') as TimelineOptions['wave'];
          } else if (field === 'mute') {
            options.mute = !options.mute;
          }
          return { ...tl, options };
        });
        return { ...prev, timelines };
      });
    },
    []
  );

  const addTrack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      timelines: [
        ...prev.timelines,
        {
          options: { title: 'Untitled Track', wave: 'sine' as const, mute: false },
          segments: [],
        },
      ],
    }));
  }, []);

  const deleteTrack = useCallback((rowIndex: number) => {
    setState((prev) => {
      const timelines = prev.timelines.filter((_, ri) => ri !== rowIndex);
      const selectedSegment = { ...prev.selectedSegment };
      if (selectedSegment.row === rowIndex) {
        selectedSegment.row = Math.max(0, selectedSegment.row - 1);
        selectedSegment.col = 0;
      } else if (selectedSegment.row > rowIndex) {
        selectedSegment.row--;
      }
      return { ...prev, timelines, selectedSegment };
    });
  }, []);

  // ── Modals ──────────────────────────────────────────────────────

  const toggleModal = useCallback((kind: ModalKind) => {
    setState((prev) => {
      const showingModals = { ...prev.showingModals };
      if (kind === 'save' && prev.compositionErrors) {
        showingModals.alert = true;
      } else {
        showingModals[kind] = !showingModals[kind];
      }
      return { ...prev, showingModals };
    });
  }, []);

  const resetSettings = useCallback(() => {
    setState((prev) => {
      const next: AppState = {
        ...prev,
        settings: {
          fs: { value: 44100, error: '' },
          volume: { value: 10, error: '' },
          multiplier: { value: 1, error: '' },
          graphRange: { value: 4000, error: '' },
          aliasing: false,
        },
      };
      return { ...next, compositionErrors: computeErrors(next) };
    });
  }, []);

  // ── JSON export / import ────────────────────────────────────────

  const exportCompositionJson = useCallback(
    (currentTimelines?: Timeline[]): string => {
      const timelines = currentTimelines ?? state.timelines;
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
    },
    [state.timelines]
  );

  const loadCompositionJson = useCallback((json: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsedJson = JSON.parse(json) as any[];
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
            title: { value: oldSegment.title, error: '' },
            expression: { value: oldSegment.expression, error: '' },
            length: { value: oldSegment.length, error: '' },
            volume: { value: oldSegment.volume, error: '' },
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
      alert(e instanceof Error ? e.message : String(e));
      return;
    }

    idCount.current = id;

    setState((prev) => {
      const next: AppState = {
        ...prev,
        timelines: parsedJson as Timeline[],
        selectedSegment: { row: 0, col: 0 },
        showingModals: { ...prev.showingModals, load: false },
      };
      return { ...next, compositionErrors: computeErrors(next) };
    });
  }, []);

  // ── Graph animation ─────────────────────────────────────────────

  const animateGraph = useCallback(() => {
    setState((prev) => ({ ...prev, revision: prev.revision + 1 }));
  }, []);

  return {
    state,
    settingsChange,
    trackDataChange,
    segmentSelection,
    segmentRearrange,
    addSegment,
    deleteSegment,
    trackOptionChange,
    addTrack,
    deleteTrack,
    toggleModal,
    resetSettings,
    getCompositionErrors,
    exportCompositionJson,
    loadCompositionJson,
    animateGraph,
  };
}
