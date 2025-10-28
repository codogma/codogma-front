import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useTranslations } from 'next-intl';
import { FormEvent } from 'react';

import { CustomDialog } from '@/components/CustomDialog';

interface ForgotPasswordProps {
  readonly open: boolean;
  readonly handleClose: () => void;
}

export function ForgotPasswordDialog({
  open,
  handleClose,
}: ForgotPasswordProps) {
  const t = useTranslations('signInPage');
  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      title={t('resetPassword')}
      contentText={t('contentText')}
      actions={
        <>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant='contained' type='submit'>
            Continue
          </Button>
        </>
      }
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleClose();
          },
        },
      }}
    >
      <OutlinedInput
        required
        margin='dense'
        id='email'
        name='email'
        label='Email address'
        placeholder='Email address'
        type='email'
        fullWidth
      />
    </CustomDialog>
  );
}
