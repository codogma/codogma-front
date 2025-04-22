import { Admin, Resource } from 'react-admin';

import { UserList } from '@/components/admin/UserList';
import { dataProvider } from '@/helpers/dataProvider';

export const AdminApp = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name='users' list={UserList} />
  </Admin>
);
