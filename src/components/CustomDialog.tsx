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
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          },
        },
      }}
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
            borderRadius: '8px',
            p: 0.5,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'scale(1.1)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <CloseIcon
            sx={{
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
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
