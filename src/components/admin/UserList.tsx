import { Theme, useMediaQuery } from '@mui/material';
import {
  Datagrid,
  EmailField,
  List,
  SimpleList,
  TextField,
  TextInput,
} from 'react-admin';

export const UserList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  return (
    <List
      filters={[<TextInput key={0} source='info' label='Search' alwaysOn />]}
    >
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.firstName + ' ' + record.lastName}
          secondaryText={(record) => record.username}
          tertiaryText={(record) => record.email}
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
