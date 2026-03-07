import { useState, useRef, useCallback, useEffect } from 'react';

import { Play, Pause, Square, SlidersHorizontal, CircleHelp } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { CompositionProvider, useComposition, computeErrors, exportCompositionJson } from './context/CompositionContext';
import { SynthesizeComposition } from './lib/synthesize';
import Graph from './components/graph';
import { TimelinePanel, SegmentPanel } from './components/editor';
import { SaveModal, LoadModal, SettingsModal, AlertModal, TutorialModal } from './components/modals';
import DomainToggle from './components/editor/domain-toggle';

const RANDOM_TAG_LINES = [
  "ARITHMETIC SYNTH",
  "ALGORITHMIC AUDIO",
  "COMPUTED SOUND",
  "SPECTRAL GRAPHICS",
  "FORMULA SYNTH",
  "PARAMETRIC AUDIO",
  "VECTOR SOUND",
  "OSCILLATION ENGINE",
  "SONIC GRAPHICS",
  "NUMERIC AUDIO",
]
const TAG_LINE = RANDOM_TAG_LINES[Math.floor(Math.random() * RANDOM_TAG_LINES.length)]

function AppContent() {
  const { state, dispatch } = useComposition();

  const [playbackTime, setPlaybackTime] = useState<number | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const wasmRef = useRef<typeof import('synthesis') | null>(null);
  const rafRef = useRef<number | null>(null);
  const playbackStartRef = useRef<number>(0);

  useEffect(() => {
    audioContextRef.current = new AudioContext();
    import('synthesis')
      .then((mod) => {
        wasmRef.current = mod;
      })
      .catch((err) => {
        console.warn('WASM load failed, falling back to JS synthesis:', err);
      });
  }, []);

  // Keyboard shortcuts (scoped: suppressed when focus is in text inputs)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const inTextField = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable;
      const mod = e.ctrlKey || e.metaKey;

      // Undo: Ctrl+Z / Cmd+Z (not in text fields)
      if (mod && e.key === 'z' && !e.shiftKey && !inTextField) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
        return;
      }
      // Redo: Ctrl+Y / Cmd+Shift+Z / Ctrl+Shift+Z (not in text fields)
      if (!inTextField && ((mod && e.key === 'y') || (mod && e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
        return;
      }
      // Delete selected segment: Delete / Backspace (not in text fields)
      if ((e.key === 'Delete' || e.key === 'Backspace') && !inTextField) {
        const { row, col } = state.selectedSegment;
        if (!state.timelines[row]?.segments[col]) return;
        e.preventDefault();
        dispatch({ type: 'DELETE_SEGMENT', row, col });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.selectedSegment, state.timelines, dispatch]);

  const stopPlaybackAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setPlaybackTime(null);
  }, []);

  const handlePlay = useCallback(() => {
    const errors = computeErrors(state);
    dispatch({ type: 'SET_ERRORS', errors });
    if (errors) {
      dispatch({ type: 'TOGGLE_MODAL', kind: 'alert' });
      return;
    }

    const composition = exportCompositionJson(state.timelines);
    const settingsJson = JSON.stringify({
      fs: state.settings.fs.value,
      volume: state.settings.volume.value,
      multiplier: state.settings.multiplier.value,
      aliasing: state.settings.aliasing,
    });

    const audioContext = audioContextRef.current!;

    let rawBuffer: Float32Array;
    if (wasmRef.current) {
      rawBuffer = wasmRef.current.synthesize_composition(composition, settingsJson);
    } else {
      rawBuffer = SynthesizeComposition(state.timelines, state.settings);
    }

    const audioSourceBuffer = audioContext.createBuffer(
      1,
      rawBuffer.length,
      state.settings.fs.value
    );
    audioSourceBuffer.copyToChannel(rawBuffer as unknown as Float32Array<ArrayBuffer>, 0);
    const audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioSourceBuffer;

    audioSourcesRef.current.push(audioSource);
    audioSource.connect(audioContext.destination);
    audioSource.start(0);

    // Start playhead animation
    const duration = rawBuffer.length / state.settings.fs.value;
    playbackStartRef.current = performance.now();
    stopPlaybackAnimation();

    const animate = () => {
      const elapsed = (performance.now() - playbackStartRef.current) / 1000;
      if (elapsed >= duration) {
        setPlaybackTime(null);
        rafRef.current = null;
        return;
      }
      setPlaybackTime(elapsed);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    audioSource.onended = stopPlaybackAnimation;
  }, [state, dispatch, stopPlaybackAnimation]);

  const handlePause = useCallback(() => {
    // Detach onended so stopping doesn't reset playbackTime
    audioSourcesRef.current.forEach((source) => {
      source.onended = null;
      try { source.stop(0); } catch { /* already stopped */ }
    });
    audioSourcesRef.current = [];
    // Freeze playhead at current position (don't reset playbackTime)
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const handleStop = useCallback(() => {
    audioSourcesRef.current.forEach((source) => {
      try { source.stop(0); } catch { /* already stopped */ }
    });
    audioSourcesRef.current = [];
    stopPlaybackAnimation();
  }, [stopPlaybackAnimation]);

  return (
    <div className="flex h-screen flex-col bg-[#2f2b38] px-3 py-5 text-foreground">
      {/* Calculator assembly — body + ribbed grip strips */}
      <div className="calc-frame flex flex-1 overflow-hidden rounded-[0.75rem]">
        {/* Left ribbed grip */}
        <div className="grip-ribs w-3.5 shrink-0 shadow-[inset_-2px_0_3px_rgba(0,0,0,0.5)]" />
        {/* Calculator body */}
        <div className="flex flex-1 flex-col overflow-hidden bg-background">
        {/* Top bezel — branding (mirrors TI-92 "TEXAS INSTRUMENTS / TI-92 II" placement) */}
        <div className="flex items-center justify-between border-b border-border/40 bg-surface-alt/50 px-5 py-2.5">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-base uppercase tracking-[0.3em] text-muted-foreground">
              Arithmusic
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              fx-AM1
            </span>
          </div>
          <span className="font-display text-base uppercase tracking-widest text-highlight/40 [text-shadow:0_0_6px_rgba(51,255,102,0.2)]">
            {TAG_LINE}
          </span>
        </div>

        {/* Upper region: control column + graph + segment editor */}
        <div className="flex flex-[5] overflow-hidden">
          {/* Left control column — function key strip */}
          <div className="flex w-28 shrink-0 flex-col items-center gap-3 border-r border-border/50 bg-gradient-to-b from-surface-alt to-surface px-2 py-4">
            {/* Playback controls */}
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-1">
                <Button variant="calc" size="icon" onClick={handlePlay}>
                  <Play className="size-5" />
                </Button>
                <Button variant="calc" size="icon" onClick={handlePause}>
                  <Pause className="size-5" />
                </Button>
              </div>
              <Button variant="calc-accent" className="w-full" onClick={handleStop}>
                <Square className="size-5" />
              </Button>
            </div>

            <div className="w-12 border-t border-border/40" />

            {/* Domain toggle */}
            <DomainToggle />

            <div className="flex-1" />

            <div className="w-12 border-t border-border/40" />

            {/* Settings */}
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Settings</span>
            <Button variant="calc-secondary" size="icon" onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'settings' })}>
              <SlidersHorizontal className="size-5" />
            </Button>

            <div className="w-12 border-t border-border/40" />

            {/* Help / Tutorial */}
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Help</span>
            <Button variant="calc-secondary" size="icon" onClick={() => window.dispatchEvent(new Event('open-tutorial'))}>
              <CircleHelp className="size-5" />
            </Button>
          </div>

          {/* Graph (dominant LCD screen) */}
          <div className="flex min-w-0 flex-1 flex-col p-4">
            <Graph playbackTime={playbackTime} />
          </div>

          {/* Segment editor panel (right) */}
          <SegmentPanel />
        </div>

        {/* Bottom: Timeline */}
        <div className="groove flex-[2] overflow-hidden border-t border-border/50">
          <TimelinePanel />
        </div>
        </div>
        {/* Right ribbed grip */}
        <div className="grip-ribs w-3.5 shrink-0 shadow-[inset_2px_0_3px_rgba(0,0,0,0.5)]" />
      </div>
      <LoadModal />
      <SaveModal />
      <SettingsModal />
      <AlertModal />
      <TutorialModal />
    </div>
  );
}

export default function App() {
  return (
    <CompositionProvider>
      <AppContent />
    </CompositionProvider>
  );
}
