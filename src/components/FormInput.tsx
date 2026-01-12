import { TextField, TextFieldProps } from '@mui/material';
import { FC, useMemo } from 'react';
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

  const stableId = useMemo(
    () => (otherProps.id ?? `field-${name}`).replaceAll('.', '-'),
    [otherProps.id, name],
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <TextField
          {...otherProps}
          {...field}
          id={stableId}
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
