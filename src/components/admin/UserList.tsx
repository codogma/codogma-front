'use client';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Datagrid,
  EmailField,
  List,
  SimpleList,
  TextField,
  TextInput,
} from 'react-admin';

import { GetUserDTO } from '@/types';

export const UserList = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <List
      filters={[<TextInput key={0} source='info' label='Search' alwaysOn />]}
    >
      {isSmall ? (
        <SimpleList
          primaryText={(record: GetUserDTO) =>
            record.firstName + ' ' + record.lastName
          }
          secondaryText={(record: GetUserDTO) => record.username}
          tertiaryText={(record: GetUserDTO) => record.email}
        />
      ) : (
        <Datagrid rowClick='edit'>
          <TextField source='id' />
          <TextField source='username' />
          <EmailField source='email' />
          <TextField source='firstName' />
          <TextField source='lastName' />
        </Datagrid>
      )}
    </List>
  );
};
