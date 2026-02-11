import { Box, Button, Divider, List, ListItem, ListItemText, Modal, Typography } from '@mui/material';
import { modalStyle } from '../modals';
import { useComposition } from '../../context/CompositionContext';

const errorKeyMap: Record<string, string> = {
  fs: 'Sampling frequency',
  volume: 'Volume',
  multiplier: 'Auto multiplier',
  expression: 'Expression',
  length: 'Length',
};

export default function AlertModal() {
  const { state, dispatch } = useComposition();
  const errors = state.compositionErrors;

  const listItems: React.ReactNode[] = [];

  if (errors) {
    errors.settings.forEach((key, index) => {
      listItems.push(
        <ListItem key={`s${index}`}>
          <ListItemText primary={`${errorKeyMap[key] ?? key} in Settings`} />
        </ListItem>
      );
      if (index !== errors.settings.length - 1 || errors.editor.length) {
        listItems.push(<Divider key={`ds${index}`} variant="middle" />);
      }
    });

    errors.editor.forEach((err, index) => {
      listItems.push(
        <ListItem key={`e${index}`}>
          <ListItemText
            primary={`${errorKeyMap[err.key] ?? err.key} for tab titled '${err.title}' in Timeline [row ${err.row}, column ${err.col}]`}
          />
        </ListItem>
      );
      if (index !== errors.editor.length - 1) {
        listItems.push(<Divider key={`de${index}`} variant="middle" />);
      }
    });
  }

  return (
    <Modal open={state.showingModals.alert}>
      <Box sx={modalStyle}>
        <Typography variant="h5">Composition Errors</Typography>
        <br />
        <Typography variant="subtitle1">
          Please fix the following errors and try again
        </Typography>
        <List sx={{ width: '80%' }}>{listItems}</List>
        <br />
        <div className="modalActions">
          <Button variant="contained" onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'alert' })}>
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
