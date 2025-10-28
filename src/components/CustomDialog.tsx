import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  styled,
} from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText';
import { ReactNode } from 'react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

type CustomDialogProps = {
  readonly onClose: () => void;
  readonly title: string;
  readonly dividers?: boolean;
  readonly contentText?: string;
  readonly actions?: ReactNode;
} & DialogProps;

export const CustomDialog = ({
  open,
  onClose,
  title,
  dividers,
  contentText,
  children,
  actions,
}: CustomDialogProps) => {
  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby='dialog-title'
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {title}
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers={dividers}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
        }}
      >
        {contentText && <DialogContentText>{contentText}</DialogContentText>}
        {children}
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </BootstrapDialog>
  );
};
