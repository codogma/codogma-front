'use client';
import { AdminApp } from '@/components/admin/AdminApp';
import { Language } from '@/types';

type PageParams = {
  readonly params: { lng: Language };
};

const Page = ({ params: { lng } }: PageParams) => {
  return <AdminApp lang={lng} />;
};

export default Page;
