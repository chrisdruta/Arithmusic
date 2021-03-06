import React, { Component } from 'react';
import './App.css';

import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Play, Stop, Tune } from 'mdi-material-ui';

import {
  settingsChange, trackDataChange, toggleModal, segmentSelection, segmentRearrange,
  addSegment, deleteSegment, trackOptionChange, addTrack, deleteTrack, getCompositionErrors,
  exportCompositionJson, loadCompositionJson, resetSettings
} from './api/handlers';

import Graph from './components/graph';
import Editor from './components/editor';
import { SaveModal, LoadModal, SettingsModal, AlertModal } from './components/modals';
import initialState from './initial-state';
import Spectrogram from './components/spectrogram';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = initialState;
    this.state.revision = 0;

    this.settingsChange = settingsChange.bind(this);
    this.trackDataChange = trackDataChange.bind(this);
    this.toggleModal = toggleModal.bind(this);
    this.segmentSelection = segmentSelection.bind(this);
    this.segmentRearrange = segmentRearrange.bind(this);
    this.addSegment = addSegment.bind(this);
    this.deleteSegment = deleteSegment.bind(this);
    this.trackOptionChange = trackOptionChange.bind(this);
    this.addTrack = addTrack.bind(this);
    this.deleteTrack = deleteTrack.bind(this);
    this.getCompositionErrors = getCompositionErrors.bind(this);
    this.exportCompositionJson = exportCompositionJson.bind(this);
    this.loadCompositionJson = loadCompositionJson.bind(this);
    this.resetSettings = resetSettings.bind(this);

    let count = 0;
    for (let tl of this.state.timelines) {
      count += tl.segments.length;
    }
    this.idCount = count;

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.audioSources = [];
  }

  async componentDidMount() {
    this.wasm = await import('synthesis');
  }

  handlePlay = () => {

    // Check for errors before synthesizing
    const errors = this.getCompositionErrors();
    if (errors) {
      this.toggleModal("alert");
      return;
    }

    const composition = this.exportCompositionJson();
    const settings = JSON.stringify({
      fs: this.state.settings.fs.value,
      volume: this.state.settings.volume.value,
      multiplier: this.state.settings.multiplier.value,
      aliasing: this.state.settings.aliasing
    });

    this.wasm.synthesize_composition(composition, settings);
    console.log(this.wasm.get_audio_buffer_ptr());
    console.log(this.wasm.get_audio_buffer_size());

    const rawBuffer = new Float32Array(
                            this.wasm.get_wasm_heap_memory().buffer,
                            this.wasm.get_audio_buffer_ptr(),
                            this.wasm.get_audio_buffer_size()
                          );
    console.log(this.wasm.get_wasm_heap_memory())

    const audioSourceBuffer = this.audioContext.createBuffer(1, rawBuffer.length, this.state.settings.fs.value);
    audioSourceBuffer.copyToChannel(rawBuffer, 0);
    const audioSource = this.audioContext.createBufferSource();
    audioSource.buffer = audioSourceBuffer;

    this.audioSources.push(audioSource);
    audioSource.connect(this.audioContext.destination);
    audioSource.start(0);

    // Leaky boi
    this.wasm.dealloc(this.wasm.get_audio_buffer_ptr(), this.wasm.get_audio_buffer_size())
  }

  handleStop = () => this.audioSources.forEach((source) => source.stop(0));

  handleAnimateGraph = () => {
    this.setState({ revision: this.state.revision + 1 });
    //this.forceUpdate();
  }

  wasmGenerateSpectrogram = () => {
    const composition = this.exportCompositionJson();
    const settings = JSON.stringify({
      fs: this.state.settings.fs.value,
      volume: this.state.settings.volume.value,
      multiplier: this.state.settings.multiplier.value,
      aliasing: this.state.settings.aliasing
    });

    if (this.wasm) {
      console.log("generating spec")
      this.wasm.synthesize_spectrogram(composition, settings);
      console.log(this.wasm.get_audio_buffer_ptr())
    }
    
  }
  wasmGetTx = () => (null);
  wasmGetFx = () => (null);

  render() {
    const { timelines, settings } = this.state;
    return (
      <div className="App">
        
          <AppBar position="static">
            <Toolbar className="AppBar">
              <span className="title">
                Arithmusic
              </span>
              <div style={{ flexGrow: 1 }}></div>
              <IconButton color="inherit" onClick={this.handlePlay}><Play /></IconButton>
              <IconButton color="inherit" onClick={this.handleStop}><Stop /></IconButton>
              <IconButton color="inherit" onClick={() => this.toggleModal("settings")}><Tune /></IconButton>
            </Toolbar>
          </AppBar>
          
          {!settings.spectrogram ? 
          <Graph
            multiplier={this.state.settings.multiplier.value}
            upperRange={this.state.settings.graphRange.value}
            data={this.state.timelines[this.state.selectedSegment.row]
              ? this.state.timelines[this.state.selectedSegment.row].segments : null
            }
          /> :
          <Spectrogram
            errors={!!this.state.compositionErrors}
            composition={this.timelines} settings={this.state.settings} 
            generateSpectrogram={this.wasmGenerateSpectrogram} getTx={this.wasmGetTx} getFx={this.wasmGetFx}
          />
          }
          <Editor
            animateGraph={this.handleAnimateGraph}
            timelines={timelines}
            selectedSegment={this.state.selectedSegment}
            onSegmentSelection={this.segmentSelection}
            onSegmentRearrange={this.segmentRearrange}
            onAddTrack={this.addTrack}
            onDeleteTrack={this.deleteTrack}
            onTrackOptionChange={this.trackOptionChange}
            onTrackDataChange={this.trackDataChange}
            onAddSegment={this.addSegment}
            onDeleteSegment={this.deleteSegment}
            toggleModal={this.toggleModal}
          />
          <LoadModal open={this.state.showingModals.load}
            toggleModal={this.toggleModal}
            onLoadJson={this.loadCompositionJson}
          />
          <SaveModal open={this.state.showingModals.save}
            toggleModal={this.toggleModal}
            currentComposition={(this.exportCompositionJson())}
          />
          <SettingsModal open={this.state.showingModals.settings} settings={this.state.settings}
            toggleModal={this.toggleModal} onChange={this.settingsChange} resetSettings={this.resetSettings}
          />
          <AlertModal open={this.state.showingModals.alert} errors={this.state.compositionErrors}
            toggleModal={this.toggleModal}
          />
        
      </div>
    );
  }
}

export default App;
