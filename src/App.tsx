import { useState, useRef, useCallback, useEffect } from 'react';

import { Play, Pause, Square, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { CompositionProvider, useComposition, computeErrors, exportCompositionJson } from './context/CompositionContext';
import { SynthesizeComposition } from './lib/synthesize';
import Graph from './components/graph';
import Editor from './components/editor';
import { SaveModal, LoadModal, SettingsModal, AlertModal } from './components/modals';

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
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <div className="solar-panel w-full" />
      <header className="flex items-center gap-3 border-b border-border bg-surface-alt px-4 py-2">
        <div className="flex flex-col select-none leading-tight">
          <span className="font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Arithmusic
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            fx-AM1 <span className="ml-2 text-xs font-normal uppercase tracking-widest text-muted-foreground">{TAG_LINE}</span>
          </span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <Button variant="calc" size="icon" onClick={handlePlay}>
            <Play className="size-5" />
          </Button>
          <Button variant="calc" size="icon" onClick={handlePause}>
            <Pause className="size-5" />
          </Button>
        </div>
        <Button variant="calc-accent" size="icon" onClick={handleStop}>
          <Square className="size-5" />
        </Button>
        <div className="mx-1 self-stretch border-r border-border/40" />
        <Button variant="calc-secondary" size="icon" onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'settings' })}>
          <SlidersHorizontal className="size-5" />
        </Button>
      </header>
      <div className="flex flex-1 flex-col justify-end overflow-hidden">
        <Graph playbackTime={playbackTime} />
        <Editor />
        <LoadModal />
        <SaveModal />
        <SettingsModal />
        <AlertModal />
      </div>
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
