import { Admin, Resource } from 'react-admin';

import { UserList } from '@/components/admin/UserList';
import { dataProvider } from '@/helpers/dataProvider';
import { Language } from '@/types';

type PageParams = {
  readonly lang: Language;
};

export const AdminApp = ({ lang }: PageParams) => (
  <Admin dataProvider={dataProvider}>
    <Resource name='users' list={UserList} />
  </Admin>
);
