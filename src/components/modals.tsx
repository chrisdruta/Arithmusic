export { default as SaveModal } from './modals/save-modal';
export { default as LoadModal } from './modals/load-modal';
export { default as SettingsModal } from './modals/settings-modal';
export { default as AlertModal } from './modals/alert-modal';

export const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'space-evenly',
  outline: 'none',
};
