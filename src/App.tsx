import { useRef, useCallback, useEffect } from 'react';
import './App.css';

import { AppBar, Toolbar, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import TuneIcon from '@mui/icons-material/Tune';

import useComposition from './hooks/useComposition';
import { SynthesizeComposition } from './api/synthesize';
import Graph from './components/graph';
import Editor from './components/editor';
import { SaveModal, LoadModal, SettingsModal, AlertModal } from './components/modals';

export default function App() {
  const {
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
  } = useComposition();

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
    const errors = getCompositionErrors();
    if (errors) {
      toggleModal('alert');
      return;
    }

    const composition = exportCompositionJson();
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
  }, [state, getCompositionErrors, toggleModal, exportCompositionJson]);

  const handleStop = useCallback(() => {
    audioSourcesRef.current.forEach((source) => {
      try { source.stop(0); } catch { /* already stopped */ }
    });
    audioSourcesRef.current = [];
  }, []);

  const { timelines } = state;

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar className="AppBar">
          <span className="title">Arithmusic</span>
          <div style={{ flexGrow: 1 }} />
          <IconButton color="inherit" onClick={handlePlay}><PlayArrowIcon /></IconButton>
          <IconButton color="inherit" onClick={handleStop}><StopIcon /></IconButton>
          <IconButton color="inherit" onClick={() => toggleModal('settings')}><TuneIcon /></IconButton>
        </Toolbar>
      </AppBar>
      <div className="AppContainer">
        <Graph
          revision={state.revision}
          multiplier={state.settings.multiplier.value}
          upperRange={state.settings.graphRange.value}
          data={
            timelines[state.selectedSegment.row]
              ? timelines[state.selectedSegment.row].segments
              : null
          }
        />
        <Editor
          animateGraph={animateGraph}
          timelines={timelines}
          selectedSegment={state.selectedSegment}
          onSegmentSelection={segmentSelection}
          onSegmentRearrange={segmentRearrange}
          onAddTrack={addTrack}
          onDeleteTrack={deleteTrack}
          onTrackOptionChange={trackOptionChange}
          onTrackDataChange={trackDataChange}
          onAddSegment={addSegment}
          onDeleteSegment={deleteSegment}
          toggleModal={toggleModal}
        />
        <LoadModal
          open={state.showingModals.load}
          toggleModal={toggleModal}
          onLoadJson={loadCompositionJson}
        />
        <SaveModal
          open={state.showingModals.save}
          toggleModal={toggleModal}
          currentComposition={exportCompositionJson()}
        />
        <SettingsModal
          open={state.showingModals.settings}
          settings={state.settings}
          toggleModal={toggleModal}
          onChange={settingsChange}
          resetSettings={resetSettings}
        />
        <AlertModal
          open={state.showingModals.alert}
          errors={state.compositionErrors}
          toggleModal={toggleModal}
        />
      </div>
    </div>
  );
}
