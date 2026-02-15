import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
    <Dialog open={state.showingModals.load} onOpenChange={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'load' })}>
      <DialogContent showCloseButton={false} className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Load Composition</DialogTitle>
          <DialogDescription>Paste json below</DialogDescription>
        </DialogHeader>
        <Textarea
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="font-mono text-xs"
        />
        <p className="text-sm text-muted-foreground">or</p>
        <div
          {...getRootProps()}
          className="cursor-pointer rounded-sm border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-5 text-center text-sm text-muted-foreground transition-colors hover:border-primary/50"
        >
          <input {...getInputProps()} />
          <p>Drag 'n' drop a file here, or click to select file</p>
        </div>
        <DialogFooter>
          <Button variant="calc-secondary" size="sm" onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'load' })}>
            Cancel
          </Button>
          <Button variant="calc" size="sm" onClick={handleLoad}>Load</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
