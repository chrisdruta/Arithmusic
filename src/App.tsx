import { useRef, useCallback, useEffect } from 'react';
import './App.css';

import { AppBar, Toolbar, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import TuneIcon from '@mui/icons-material/Tune';

import { CompositionProvider, useComposition, computeErrors, exportCompositionJson } from './context/CompositionContext';
import { SynthesizeComposition } from './api/synthesize';
import Graph from './components/graph';
import Editor from './components/editor';
import { SaveModal, LoadModal, SettingsModal, AlertModal } from './components/modals';

function AppContent() {
  const { state, dispatch } = useComposition();

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const wasmRef = useRef<typeof import('synthesis') | null>(null);

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
  }, [state, dispatch]);

  const handleStop = useCallback(() => {
    audioSourcesRef.current.forEach((source) => {
      try { source.stop(0); } catch { /* already stopped */ }
    });
    audioSourcesRef.current = [];
  }, []);

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar className="AppBar">
          <span className="title">Arithmusic</span>
          <div style={{ flexGrow: 1 }} />
          <IconButton color="inherit" onClick={handlePlay}><PlayArrowIcon /></IconButton>
          <IconButton color="inherit" onClick={handleStop}><StopIcon /></IconButton>
          <IconButton color="inherit" onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'settings' })}><TuneIcon /></IconButton>
        </Toolbar>
      </AppBar>
      <div className="AppContainer">
        <Graph />
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
