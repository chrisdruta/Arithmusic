import { useState, useCallback } from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { modalStyle } from '../modals';
import { useComposition, loadCompositionJson } from '../../context/CompositionContext';

export default function LoadModal() {
  const { state, dispatch } = useComposition();
  const [text, setText] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const reader = new FileReader();
    reader.onabort = () => alert('File reading aborted');
    reader.onerror = () => alert('File reading has failed');
    reader.onload = () => {
      setText(reader.result as string);
    };
    acceptedFiles.forEach((file) => reader.readAsText(file));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    multiple: false,
  });

  const handleLoad = () => {
    const error = loadCompositionJson(text, dispatch);
    if (error) alert(error);
  };

  return (
    <Modal open={state.showingModals.load}>
      <Box sx={modalStyle}>
        <Typography variant="h5">Load Composition</Typography>
        <br />
        <Typography variant="subtitle1">Paste json below</Typography>
        <TextField
          label="Input"
          multiline
          rows={7}
          value={text}
          margin="normal"
          variant="filled"
          onChange={(e) => setText(e.target.value)}
        />
        <br />
        <Typography variant="subtitle1">or</Typography>
        <br />
        <div {...getRootProps()} className="LoadModalFileZone">
          <input {...getInputProps()} />
          <p>Drag 'n' drop a file here, or click to select file</p>
        </div>
        <br />
        <div className="modalActions">
          <Button variant="contained" sx={{ marginRight: '10px' }} onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'load' })}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleLoad}>
            Load
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
