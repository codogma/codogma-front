import { TextField, TextFieldProps } from '@mui/material';
import { FC } from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

type IFormInputProps = {
  readonly name: string;
} & TextFieldProps;

const FormInput: FC<IFormInputProps> = ({
  name,
  error,
  helperText,
  ...otherProps
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <TextField
          {...otherProps}
          {...field}
          error={error || !!errors[name]}
          helperText={
            helperText ||
            (errors[name] ? ((errors[name] as FieldError).message ?? '') : '')
          }
        />
      )}
    />
  );
};

export default FormInput;
